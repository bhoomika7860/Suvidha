from app.models.user import User
from app.models.store import Store
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.task import Task
from app.schemas.task import (
    TaskCreate,
    TaskComplete,
)
from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_role
from app.utils.audit import create_audit_log

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


# Owner creates a task
@router.post("/")
def create_task(
    data: TaskCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
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
        due_date=data.due_date,
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
        description="Created task"
    )

    return task


# Employee views own tasks
@router.get("/my")
def get_my_tasks(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tasks = (
    db.query(Task)
    .filter(
        Task.assigned_to == current_user["user_id"]
    )
    .all()
)

    return [
    {
        "id": task.id,
        "title": task.task_title,
        "type": task.task_type,
        "requiresPhoto": task.requires_photo,
        "photoUploaded": task.photo_url is not None,
        "target_quantity": task.target_quantity,
        "completed_quantity": task.completed_quantity,
        "status": task.status,
        "due_date": task.due_date,
    }
    for task in tasks
]


# Employee completes task
@router.put("/{task_id}/complete")
def complete_task(
    task_id: int,
    data: TaskComplete,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    if task.assigned_to != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    task.completed_quantity = data.completed_quantity

    if task.target_quantity > 0:
        percentage = (
            data.completed_quantity / task.target_quantity
        ) * 100
    else:
        percentage = 100

    task.completion_percentage = min(percentage, 100)
    task.status = "completed"

    db.commit()
    db.refresh(task)

    create_audit_log(
        db=db,
        user_id=current_user["user_id"],
        action="UPDATE",
        table_name="task_targets",
        record_id=task.id,
        description="Completed task"
    )

    return task


# Owner views all tasks
@router.get("/")
def get_all_tasks(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    require_role(["owner"], current_user["role"])

    tasks = db.query(Task).all()

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

        results.append({
            "id": task.id,

            "task_title": task.task_title,

            "task_type": task.task_type,

            "role": task.role,

            "store_id": task.store_id,
            "store_name": store.name if store else "",

            "assigned_to": task.assigned_to,
            "employee_name": employee.full_name if employee else "",

            "target_quantity": task.target_quantity,

            "completed_quantity": task.completed_quantity,

            "completion_percentage": task.completion_percentage,

            "requires_photo": task.requires_photo,

            "status": task.status,

            "due_date": task.due_date,
        })

    return results