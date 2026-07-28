from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies.auth import get_current_user
from app.database import get_db
from app.models.delivery_assignment import DeliveryAssignment
from app.models.user import User
from app.schemas.delivery_assignment import (
    DeliveryAssignmentCreate,
)

router = APIRouter(
    prefix="/delivery-assignments",
    tags=["Delivery Assignments"],
)


@router.get("/delivery-boys")
def get_delivery_boys(
    db: Session = Depends(get_db),
):
    return (
        db.query(User)
        .filter(User.role == "delivery_boy")
        .all()
    )


@router.get("/{daily_report_id}")
def get_assignments(
    daily_report_id: int,
    db: Session = Depends(get_db),
):
    return (
        db.query(DeliveryAssignment)
        .filter(
            DeliveryAssignment.daily_report_id
            == daily_report_id
        )
        .all()
    )


@router.post("/")
def create_assignment(
    data: DeliveryAssignmentCreate,
    db: Session = Depends(get_db),
):
    assignment = DeliveryAssignment(
        daily_report_id=data.daily_report_id,
        delivery_boy_id=data.delivery_boy_id,
        deliveries_completed=data.deliveries_completed,
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return assignment

@router.get("/delivery-boys")
def get_delivery_boys(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(User)
        .filter(
            User.role == "delivery_boy",
            User.store_id == current_user["store_id"],
        )
        .order_by(User.full_name)
        .all()
    )