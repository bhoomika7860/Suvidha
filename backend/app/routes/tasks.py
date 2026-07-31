from datetime import date
import os
import shutil
import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.orm import Session
from datetime import datetime
from zoneinfo import ZoneInfo
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_role
from app.models.store import Store
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate
from app.utils.audit import create_audit_log

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)
def ist_today():
    return datetime.now(ZoneInfo("Asia/Kolkata")).date()

# -------------------------------------------------------------------
# Owner creates task
# -------------------------------------------------------------------
@router.post("/")
def create_task(
    data: TaskCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(["owner"], current_user["role"])

    task = Task(
        store_id=data.store_id,
        assigned_to=data.assigned_to,
        task_title=data.task_title,
        task_type=data.task_type,
        role=data.role,
        target_quantity=data.target_quantity,
        requires_photo=data.requires_photo,
        due_date=ist_today(),
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    create_audit_log(
        db=db,
        user_id=current_user["user_id"],
        action="CREATE",
        table_name="task_targets",
        record_id=task.id,
        description="Created task",
    )

    return task


# -------------------------------------------------------------------
# Employee views own tasks
# -------------------------------------------------------------------
@router.get("/my")
def get_my_tasks(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    today = ist_today()

    tasks = (
        db.query(Task)
        .filter(Task.assigned_to == current_user["user_id"])
        .filter(
            (Task.status != "completed")
            | (Task.due_date == today)
        )
        .all()
    )

    results = []

    for task in tasks:

        store = (
            db.query(Store)
            .filter(Store.id == task.store_id)
            .first()
        )

        results.append(
            {
                "id": task.id,
                "title": task.task_title,
                "employee": current_user["username"],
                "role": task.role,
                "store": store.name if store else "",
                "type": task.task_type,
                "target_quantity": task.target_quantity,
                "completed_quantity": task.completed_quantity,
                "completion_percentage": task.completion_percentage,
                "requiresPhoto": task.requires_photo,
                "photo_url": task.photo_url,
                "note": task.note,
                "status": task.status,
                "due_date": task.due_date,
            }
        )

    return results


# -------------------------------------------------------------------
# Employee completes task
# -------------------------------------------------------------------
@router.put("/{task_id}/complete")
def complete_task(
    task_id: int,
    completed_quantity: int = Form(...),
    note: str = Form(""),
    photo: UploadFile | None = File(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    print("PHOTO RECEIVED:", photo)

    task = (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )

    
    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    # Prevent resubmission
    if task.status == "completed":
            raise HTTPException(
            status_code=400,
            detail="This delivery has already been submitted."
        )
    

    if task.assigned_to != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    task.completed_quantity = completed_quantity

    if task.target_quantity > 0:
        percentage = (
            completed_quantity / task.target_quantity
        ) * 100
    else:
        percentage = 100

    task.completion_percentage = min(
        percentage,
        100,
    )

    task.note = note

    if photo:

        os.makedirs(
            "uploads/tasks",
            exist_ok=True,
        )

        filename = (
            f"{uuid.uuid4()}_{photo.filename}"
        )

        filepath = os.path.join(
            "uploads",
            "tasks",
            filename,
        )

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(
                photo.file,
                buffer,
            )

        task.photo_url = (
            f"http://127.0.0.1:8000/uploads/tasks/{filename}"
        )

    task.status = "completed"

    db.commit()
    db.refresh(task)

    create_audit_log(
        db=db,
        user_id=current_user["user_id"],
        action="UPDATE",
        table_name="task_targets",
        record_id=task.id,
        description="Completed task",
    )

    return task


# -------------------------------------------------------------------
# Owner views all tasks
# -------------------------------------------------------------------
@router.get("/")
def get_all_tasks(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(["owner"], current_user["role"])

    today = ist_today()

    tasks = (
        db.query(Task)
        .filter(
            (Task.status != "completed")
            | (Task.due_date == today)
        )
        .all()
    )

    results = []

    for task in tasks:

        employee = (
            db.query(User)
            .filter(User.id == task.assigned_to)
            .first()
        )

        store = (
            db.query(Store)
            .filter(Store.id == task.store_id)
            .first()
        )

        results.append(
            {
                "id": task.id,
                "title": task.task_title,
                "employee": employee.full_name if employee else "",
                "role": task.role,
                "store": store.name if store else "",
                "type": task.task_type,
                "target_quantity": task.target_quantity,
                "completed_quantity": task.completed_quantity,
                "completion_percentage": task.completion_percentage,
                "requiresPhoto": task.requires_photo,
                "photo_url": task.photo_url,
                "note": task.note,
                "status": task.status,
                "due_date": task.due_date,
            }
        )

    return results