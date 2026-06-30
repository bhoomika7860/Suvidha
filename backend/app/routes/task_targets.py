from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.task_target import TaskTarget
from app.schemas.task_target import (
    TaskTargetCreate,
    TaskTargetComplete
)
from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_role
from app.utils.audit import create_audit_log

router = APIRouter(
    prefix="/targets",
    tags=["Task Targets"]
)


# Owner creates target
@router.post("/")
def create_target(
    data: TaskTargetCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    require_role(["owner"], current_user["role"])

    target = TaskTarget(
        store_id=data.store_id,
        assigned_to=data.assigned_to,
        task_title=data.task_title,
        target_quantity=data.target_quantity
    )

    db.add(target)
    db.commit()
    db.refresh(target)

    create_audit_log(
        db=db,
        user_id=current_user["user_id"],
        action="CREATE",
        table_name="task_targets",
        record_id=target.id,
        description="Created task target"
    )

    return {
    "id": target.id,
    "store_id": target.store_id,
    "assigned_to": target.assigned_to,
    "task_title": target.task_title,
    "target_quantity": target.target_quantity,
    "completed_quantity": target.completed_quantity,
    "completion_percentage": target.completion_percentage,
    "status": target.status
}


# Staff views own targets
@router.get("/my")
def get_my_targets(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(TaskTarget).filter(
        TaskTarget.assigned_to == current_user["user_id"]
    ).all()


# Staff submits completed work
@router.put("/{target_id}/complete")
def complete_target(
    target_id: int,
    data: TaskTargetComplete,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target = db.query(TaskTarget).filter(
        TaskTarget.id == target_id
    ).first()

    if not target:
        raise HTTPException(
            status_code=404,
            detail="Target not found"
        )

    if target.assigned_to != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    target.completed_quantity = data.completed_quantity

    percentage = (
        data.completed_quantity / target.target_quantity
    ) * 100

    target.completion_percentage = min(percentage, 100)

    target.status = "completed"

    db.commit()
    db.refresh(target)

    create_audit_log(
        db=db,
        user_id=current_user["user_id"],
        action="UPDATE",
        table_name="task_targets",
        record_id=target.id,
        description="Completed task target"
    )

    return {
    "id": target.id,
    "task_title": target.task_title,
    "target_quantity": target.target_quantity,
    "completed_quantity": target.completed_quantity,
    "completion_percentage": target.completion_percentage,
    "status": target.status
}


# Owner views all progress
@router.get("/progress")
def get_all_progress(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    require_role(["owner"], current_user["role"])

    return db.query(TaskTarget).all()