from fastapi import APIRouter, Depends
from app.database import SessionLocal
from app.models.delivery import Delivery
from app.models.daily_report import DailyReport
from app.schemas.delivery import DeliveryCreate
from app.dependencies.auth import get_current_user
import os
import uuid

from fastapi import (
    UploadFile,
    File,
    Form,
)

router = APIRouter(prefix="/deliveries", tags=["Deliveries"])


@router.post("/")
async def create_delivery(
    daily_report_id: int = Form(...),
    customer_name: str = Form(...),
    status: str = Form("completed"),

    bill_number: str = Form(None),

    payment: str = Form(None),

    payment_method: str = Form(None),

    notes: str = Form(None),

    bill_image: UploadFile | None = File(None),
):
    
    print(
    daily_report_id,
    customer_name,
    status,
)
    db = SessionLocal()

    image_path = None

    if bill_image:

        extension = os.path.splitext(
            bill_image.filename
        )[1]

        filename = f"{uuid.uuid4()}{extension}"

        upload_dir = os.path.join(
            "uploads",
            "delivery_bills",
        )

        os.makedirs(
            upload_dir,
            exist_ok=True,
        )

        filepath = os.path.join(
            upload_dir,
            filename,
        )

        with open(filepath, "wb") as buffer:
            buffer.write(
                await bill_image.read()
            )

        image_path = (
            f"/uploads/delivery_bills/{filename}"
        )

    delivery = Delivery(
        daily_report_id=daily_report_id,
        customer_name=customer_name,
        status=status,
        bill_number=bill_number,
        payment=payment,
        payment_method=payment_method,
        notes=notes,
        bill_image=image_path,
    )

    db.add(delivery)

    db.commit()

    db.refresh(delivery)

    db.close()

    return delivery


@router.put("/{delivery_id}")
def update_delivery(
    delivery_id: int,
    data: DeliveryCreate,
):
    db = SessionLocal()

    delivery = (
        db.query(Delivery)
        .filter(Delivery.id == delivery_id)
        .first()
    )

    if not delivery:
        db.close()
        return {
            "message": "Delivery not found"
        }

    delivery.assigned_to = data.assigned_to
    delivery.customer_name = data.customer_name
    delivery.bill_number = data.bill_number
    delivery.payment_amount = data.payment_amount
    delivery.payment_method = data.payment_method
    delivery.notes = data.notes
    delivery.status = data.status

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


@router.put("/{delivery_id}/complete")
def complete_delivery(delivery_id: int):
    db = SessionLocal()

    delivery = (
        db.query(Delivery)
        .filter(Delivery.id == delivery_id)
        .first()
    )

    if not delivery:
        db.close()
        return {
            "message": "Delivery not found"
        }

    delivery.status = "completed"

    db.commit()
    db.refresh(delivery)
    db.close()

    return delivery