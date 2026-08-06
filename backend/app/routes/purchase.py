from datetime import date
from app.models.store import Store
from app.schemas.purchase import OwnerPurchaseResponse
from fastapi import Query
import os
import uuid

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.daily_report import DailyReport
from app.models.purchase import Purchase
from app.schemas.purchase import (
    PurchaseCreate,
    PurchaseResponse,
    PurchaseUpdate,
    OwnerPurchaseResponse,
    PaginatedOwnerPurchaseResponse,
)
from datetime import datetime
from zoneinfo import ZoneInfo

router = APIRouter(
    prefix="/purchases",
    tags=["Purchases"],
)
def ist_today():
    return datetime.now(ZoneInfo("Asia/Kolkata")).date()

# ----------------------------------------------------
# Create Purchase
# ----------------------------------------------------

@router.post("/", response_model=PurchaseResponse)
async def create_purchase(
    store_id: int = Form(...),
    daily_report_id: int = Form(...),
    product_name: str = Form(...),
    quantity: int = Form(...),
    supplier_name: str | None = Form(None),
    purchase_amount: float = Form(...),
    created_by: int = Form(...),
    bill_number: str = Form(...),
    received_by: str | None = Form(None),
    
    entered_by: str | None = Form(None),
    status: str = Form("received"),
    
    bill_image: UploadFile | None = File(None),
    current_user=Depends(get_current_user),
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
            buffer.write(await bill_image.read())

        image_path = f"/uploads/bills/{filename}"

    report = (
        db.query(DailyReport)
    .filter(
        DailyReport.id == daily_report_id,
        DailyReport.store_id == current_user["store_id"],
    )
    .first()
)

    if not report:
        raise HTTPException(
        status_code=404,
        detail="Daily report not found",
    )

    purchase = Purchase(
    store_id=current_user["store_id"],
    daily_report_id=daily_report_id,

    product_name=product_name,
    quantity=quantity,
    supplier_name=supplier_name,
    purchase_amount=purchase_amount,

    created_by=current_user["user_id"],

    bill_number=bill_number,
    received_by=received_by,
    entered_by=entered_by,

    status="received",

    bill_image=image_path,
)

    db.add(purchase)

    db.commit()
    db.refresh(purchase)

    return purchase

# ----------------------------------------------------
# Update Purchase Workflow
# ----------------------------------------------------

@router.put("/{purchase_id}")
def update_purchase(
    purchase_id: int,
    data: PurchaseUpdate,
    current_user=Depends(get_current_user),
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
    if (
    current_user["role"] != "owner"
    and purchase.store_id != current_user["store_id"]
):
        raise HTTPException(
        status_code=403,
        detail="Not allowed",
    )
    was_completed = purchase.status == "completed"

    purchase.status = data.status

    

    if data.entered_by is not None:
        purchase.entered_by = data.entered_by

    if data.grn_number is not None:
        purchase.grn_number = data.grn_number

  

    if (
        purchase.status == "completed"
        and not purchase.grn_number
):
        raise HTTPException(
        status_code=400,
        detail="GRN Number is required before completing the purchase.",
    )

    if (
        not was_completed
        and purchase.status == "completed"
    ):
        purchase.completed_at = datetime.utcnow()

        report = (
    db.query(DailyReport)
    .filter(
        DailyReport.id == purchase.daily_report_id
    )
    .first()
)

        if report:
            report.total_purchases += purchase.purchase_amount

    db.commit()
    db.refresh(purchase)

    return purchase
# ----------------------------------------------------
# Get All Purchases
# ----------------------------------------------------

@router.get("/", response_model=List[PurchaseResponse])
def get_all_purchases(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Purchase)

    if current_user["role"] != "owner":
        query = query.filter(
            Purchase.store_id == current_user["store_id"]
        )

    purchases = (
        query.order_by(
            Purchase.purchase_date.desc(),
            Purchase.id.desc(),
        )
        .all()
    )

    return purchases



@router.get(
    "/owner",
    response_model=PaginatedOwnerPurchaseResponse,
)
def get_owner_purchases(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),

    store_id: int | None = Query(None),
    status: str | None = Query(None),
    supplier: str | None = Query(None),
    bill_number: str | None = Query(None),
    date: date | None = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "owner":
        raise HTTPException(
            status_code=403,
            detail="Only owners can access this endpoint.",
        )

    query = (
        db.query(Purchase, Store.name)
        .join(
            Store,
            Purchase.store_id == Store.id,
        )
    )

    if store_id:
        query = query.filter(
            Purchase.store_id == store_id
        )

    if status:
        query = query.filter(
            Purchase.status == status
        )

    if supplier:
        query = query.filter(
            Purchase.supplier_name.ilike(f"%{supplier}%")
        )

    if bill_number:
        query = query.filter(
            Purchase.bill_number.ilike(f"%{bill_number}%")
        )

    if date:
        query = query.filter(
        func.date(
    func.timezone("Asia/Kolkata", Purchase.purchase_date)
) == date
    )

    total = query.count()

    purchases = (
        query.order_by(
        Purchase.purchase_date.desc(),
        Purchase.id.desc(),
    )
    .offset((page - 1) * page_size)
    .limit(page_size)
    .all()
)
    return {
    "items": [
        {
            "id": purchase.id,
            "purchase_date": purchase.purchase_date,
            "store_id": purchase.store_id,
            "store_name": store_name,
            "product_name": purchase.product_name,
            "quantity": purchase.quantity,
            "supplier_name": purchase.supplier_name,
            "purchase_amount": purchase.purchase_amount,
            "bill_number": purchase.bill_number,
            "status": purchase.status,
            "received_by": purchase.received_by,
            "checked_by": purchase.checked_by,
            "entered_by": purchase.entered_by,
            "bill_image": purchase.bill_image,
        }
        for purchase, store_name in purchases
    ],
    "total": total,
    "page": page,
    "page_size": page_size,
}

# ----------------------------------------------------
# Get Store Purchases
# ----------------------------------------------------

@router.get(
    "/store/{store_id}",
    response_model=List[PurchaseResponse],
)
def get_store_purchases(
    store_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if (
    current_user["role"] != "owner"
    and store_id != current_user["store_id"]
):
        raise HTTPException(
        status_code=403,
        detail="Not allowed",
    )
    return (
        db.query(Purchase)
        .filter(
            Purchase.store_id == store_id
        )
        .order_by(
            Purchase.purchase_date.desc()
        )
        .all()
    )


# ----------------------------------------------------
# Get Today's Purchases
# ----------------------------------------------------

@router.get(
    "/today",
    response_model=List[PurchaseResponse],
)
def get_today_purchases(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Purchase).filter(
        func.date(
    func.timezone("Asia/Kolkata", Purchase.purchase_date)
)
        == ist_today()
    )

    if current_user["role"] != "owner":
        query = query.filter(
            Purchase.store_id == current_user["store_id"]
        )

    return (
        query.order_by(
            Purchase.purchase_date.desc()
        )
        .all()
    )