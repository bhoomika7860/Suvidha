from fastapi import APIRouter, Depends
from app.database import SessionLocal
from app.models.delivery import Delivery
from app.models.daily_report import DailyReport
from app.schemas.delivery import DeliveryCreate
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/deliveries", tags=["Deliveries"])


@router.post("/")
def create_delivery(data: DeliveryCreate):
    db = SessionLocal()

    delivery = Delivery(
        daily_report_id=data.daily_report_id,
        customer_name=data.customer_name,
        status=data.status
    )

    db.add(delivery)
    db.commit()
    db.refresh(delivery)
    db.close()

    return delivery


@router.get("/")
def get_all_deliveries(
    current_user: dict = Depends(get_current_user)
):
    db = SessionLocal()

    if current_user["role"] == "owner":
        deliveries = db.query(Delivery).all()
        db.close()
        return deliveries

    deliveries = db.query(Delivery).join(
        DailyReport,
        Delivery.daily_report_id == DailyReport.id
    ).filter(
        DailyReport.store_id == current_user["store_id"]
    ).all()

    db.close()
    return deliveries


@router.get("/{delivery_id}")
def get_delivery(delivery_id: int):
    db = SessionLocal()

    delivery = db.query(Delivery).filter(
        Delivery.id == delivery_id
    ).first()

    db.close()

    if not delivery:
        return {"message": "Delivery not found"}

    return delivery


@router.delete("/{delivery_id}")
def delete_delivery(delivery_id: int):
    db = SessionLocal()

    delivery = db.query(Delivery).filter(
        Delivery.id == delivery_id
    ).first()

    if not delivery:
        db.close()
        return {"message": "Delivery not found"}

    db.delete(delivery)
    db.commit()
    db.close()

    return {"message": "Delivery deleted"}