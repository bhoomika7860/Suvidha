from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.purchase import Purchase
from app.schemas.purchase import PurchaseCreate, PurchaseResponse
from typing import List
from sqlalchemy import func
from datetime import date
from app.schemas.purchase import PurchaseUpdate
from fastapi import HTTPException
from app.models.purchase_order import PurchaseOrder
import os
import uuid

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException,
)

router = APIRouter(
    prefix="/purchases",
    tags=["Purchases"]
)


# Create purchase
@router.post("/", response_model=PurchaseResponse)
async def create_purchase(
    store_id: int = Form(...),
    product_name: str = Form(...),
    quantity: int = Form(...),
    supplier_name: str = Form(None),
    purchase_amount: float = Form(...),
    created_by: int = Form(...),
    bill_number: str = Form(...),
    received_by: str = Form(None),
    checked_by: str = Form(None),
    entered_by: str = Form(None),
    status: str = Form("received"),
    purchase_order_id: int | None = Form(None),
    bill_image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    image_path = None

    if bill_image:

        extension = os.path.splitext(
            bill_image.filename
        )[1]

        filename = f"{uuid.uuid4()}{extension}"

        upload_dir = os.path.join(
            "uploads",
            "bills",
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

        image_path = f"/uploads/bills/{filename}"

    print("===================================")
    print("purchase_order_id =", purchase_order_id)
    print("status =", status)
    print("===================================")

    purchase = Purchase(
        store_id=store_id,
        product_name=product_name,
        quantity=quantity,
        supplier_name=supplier_name,
        purchase_amount=purchase_amount,
        created_by=created_by,
        bill_number=bill_number,
        received_by=received_by,
        checked_by=checked_by,
        entered_by=entered_by,
        status=status,
        purchase_order_id=purchase_order_id,
        bill_image=image_path,
    )

    db.add(purchase)

    if purchase.purchase_order_id:

     print("Looking for PO:", purchase.purchase_order_id)

    purchase_order = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.id == purchase.purchase_order_id
        )
        .first()
    )

    print("Purchase Order Found:", purchase_order)

    if purchase_order:
        purchase_order.status = "Received"

        print("Status Changed To:", purchase_order.status)

    db.commit()
    db.refresh(purchase)

    return purchase

@router.put("/{purchase_id}")
def update_purchase(
    purchase_id: int,
    data: PurchaseUpdate,
    db: Session = Depends(get_db),
):
    purchase = (
        db.query(Purchase)
        .filter(Purchase.id == purchase_id)
        .first()
    )

    if purchase is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase not found",
        )

    was_completed = (
        purchase.status == "completed"
    )

    if purchase.purchase_order_id:
        purchase_order = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.id == purchase.purchase_order_id
        )
        .first()
    )

    if purchase_order:
        purchase_order.status = "Closed"
    print("Purchase Order Updated:", purchase.id)
    print("New Status:", purchase.status)

    purchase.status = data.status

    if data.checked_by is not None:
        purchase.checked_by = data.checked_by

    if data.entered_by is not None:
        purchase.entered_by = data.entered_by

    if (
        not was_completed
        and purchase.status == "completed"
    ):
        from app.models.daily_report import DailyReport

        report = (
            db.query(DailyReport)
            .filter(
                DailyReport.store_id == purchase.store_id,
                DailyReport.report_date == date.today(),
            )
            .first()
        )

        if report:
            report.total_purchases += purchase.purchase_amount

    db.commit()
    db.refresh(purchase)

    return purchase

# Get all purchases
@router.get("/", response_model=List[PurchaseResponse])
def get_all_purchases(
    db: Session = Depends(get_db),
):
    purchases = (
        db.query(Purchase)
        .filter(
            func.date(Purchase.purchase_date)
            == date.today()
        )
        .all()
    )

    return purchases


# Get store-wise purchases
@router.get("/store/{store_id}", response_model=List[PurchaseResponse])
def get_store_purchases(store_id: int, db: Session = Depends(get_db)):
    purchases = db.query(Purchase).filter(
        Purchase.store_id == store_id
    ).all()

    return purchases


# Get today's purchases
from datetime import date
from sqlalchemy import func


@router.get("/today", response_model=List[PurchaseResponse])
def get_today_purchases(db: Session = Depends(get_db)):
    today = date.today()

    purchases = db.query(Purchase).filter(
        func.date(Purchase.purchase_date) == today
    ).all()

    return purchases