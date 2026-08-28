from datetime import datetime, date, timedelta
from zoneinfo import ZoneInfo

import os
import uuid
from typing import List

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
)

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user

from app.models.daily_report import DailyReport
from app.models.purchase import Purchase
from app.models.store import Store

from app.schemas.purchase import (
    PurchaseResponse,
    PurchaseUpdate,
    PaginatedOwnerPurchaseResponse,
)

from app.utils.audit import create_audit_log


router = APIRouter(
    prefix="/purchases",
    tags=["Purchases"],
)


IST = ZoneInfo("Asia/Kolkata")


def ist_today():
    return datetime.now(IST).date()


def business_date_start(report_date: date):
    """
    Convert a business date into the beginning
    of that date in Indian Standard Time.
    """

    return datetime.combine(
        report_date,
        datetime.min.time(),
    ).replace(
        tzinfo=IST
    )


# ----------------------------------------------------
# Recalculate Daily Report Purchase Total
# ----------------------------------------------------

def recalculate_report_purchase_total(
    db: Session,
    report: DailyReport,
):
    """
    Recalculate the total purchase amount directly
    from the purchases belonging to this report.

    This is intentionally calculated from the database
    instead of adding/subtracting a difference.

    That prevents totals from becoming incorrect if:
    - a purchase is edited multiple times
    - a purchase is deleted
    - duplicate purchases are removed
    - previous data was already inconsistent
    """

    total = (
        db.query(
            func.coalesce(
                func.sum(
                    Purchase.purchase_amount
                ),
                0,
            )
        )
        .filter(
            Purchase.daily_report_id
            == report.id
        )
        .scalar()
    )

    report.total_purchases = float(
        total or 0
    )

    return report.total_purchases


# ----------------------------------------------------
# Create Purchase
# ----------------------------------------------------

@router.post(
    "/",
    response_model=PurchaseResponse,
)
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
    purchase_date: datetime | None = Form(None),
    bill_image: UploadFile | None = File(None),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id
            == daily_report_id,
            DailyReport.store_id
            == current_user["store_id"],
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Daily report not found",
        )

    if report.is_locked:
        raise HTTPException(
            status_code=409,
            detail="Report is locked",
        )

    if purchase_amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Purchase amount must be greater than zero.",
        )

    if quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero.",
        )

    report_datetime = business_date_start(
        report.report_date
    )

    # ------------------------------------------------
    # Upload bill image
    # ------------------------------------------------

    image_path = None

    if bill_image:
        extension = os.path.splitext(
            bill_image.filename or ""
        )[1]

        filename = (
            f"{uuid.uuid4()}{extension}"
        )

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

        image_path = (
            f"/uploads/bills/{filename}"
        )

    # ------------------------------------------------
    # Create purchase
    # ------------------------------------------------

    purchase = Purchase(
        store_id=current_user["store_id"],
        daily_report_id=report.id,
        product_name=product_name.strip(),
        quantity=quantity,
        supplier_name=(
            supplier_name.strip()
            if supplier_name
            else None
        ),
        purchase_amount=purchase_amount,
        created_by=current_user["user_id"],
        bill_number=bill_number.strip(),
        received_by=received_by,
        entered_by=entered_by,
        purchase_date=(
            purchase_date
            if purchase_date is not None
            else report_datetime
        ),
        received_date=report_datetime,
        status="received",
        bill_image=image_path,
    )

    db.add(purchase)

    # Make the new purchase visible to the
    # aggregate query before recalculating.
    db.flush()

    # ------------------------------------------------
    # Recalculate report total
    # ------------------------------------------------

    recalculate_report_purchase_total(
        db,
        report,
    )

    db.commit()
    db.refresh(purchase)

    create_audit_log(
        db=db,
        user_id=current_user["user_id"],
        action="CREATE",
        table_name="purchases",
        record_id=purchase.id,
        description=(
            f"Created purchase bill "
            f"{purchase.bill_number} "
            f"for ₹{purchase.purchase_amount:,.2f}. "
            f"Daily report purchase total updated "
            f"to ₹{report.total_purchases:,.2f}."
        ),
    )

    return purchase


# ----------------------------------------------------
# Update Purchase
# ----------------------------------------------------

@router.put(
    "/{purchase_id}",
    response_model=PurchaseResponse,
)
def update_purchase(
    purchase_id: int,
    data: PurchaseUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    purchase = (
        db.query(Purchase)
        .filter(
            Purchase.id == purchase_id
        )
        .first()
    )

    if purchase is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase not found",
        )

    # ------------------------------------------------
    # Store isolation
    # ------------------------------------------------

    if (
        current_user["role"] != "owner"
        and purchase.store_id
        != current_user["store_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    # ------------------------------------------------
    # Get report
    # ------------------------------------------------

    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id
            == purchase.daily_report_id
        )
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Daily report not found",
        )

    # ------------------------------------------------
    # Determine what is being changed
    # ------------------------------------------------

    information_edit_requested = any(
        value is not None
        for value in [
            data.product_name,
            data.quantity,
            data.supplier_name,
            data.purchase_amount,
            data.bill_number,
            data.purchase_date,
        ]
    )

    workflow_update_requested = any(
        value is not None
        for value in [
            data.status,
            data.checked_by,
            data.entered_by,
            data.grn_number,
        ]
    )

    # ------------------------------------------------
    # Locked reports
    #
    # Workflow updates remain allowed because a
    # purchase may be completed days after the
    # daily report was locked.
    #
    # Actual purchase information edits remain
    # blocked because they would alter the historical
    # financial data of a locked report.
    # ------------------------------------------------

    if (
        report.is_locked
        and information_edit_requested
    ):
        raise HTTPException(
            status_code=409,
            detail=(
                "This purchase belongs to a locked "
                "daily report. Purchase information "
                "cannot be edited."
            ),
        )

    # ------------------------------------------------
    # Save old values for audit
    # ------------------------------------------------

    old_amount = float(
        purchase.purchase_amount or 0
    )

    old_supplier = purchase.supplier_name
    old_bill_number = purchase.bill_number
    old_product_name = purchase.product_name
    old_quantity = purchase.quantity
    old_status = purchase.status

    # ------------------------------------------------
    # Update purchase information
    # ------------------------------------------------

    if data.product_name is not None:
        product_name = (
            data.product_name.strip()
        )

        if not product_name:
            raise HTTPException(
                status_code=400,
                detail="Product name cannot be empty.",
            )

        purchase.product_name = product_name

    if data.quantity is not None:
        if data.quantity <= 0:
            raise HTTPException(
                status_code=400,
                detail="Quantity must be greater than zero.",
            )

        purchase.quantity = data.quantity

    if data.supplier_name is not None:
        supplier_name = (
            data.supplier_name.strip()
        )

        if not supplier_name:
            raise HTTPException(
                status_code=400,
                detail="Supplier name cannot be empty.",
            )

        purchase.supplier_name = supplier_name

    if data.purchase_amount is not None:
        if data.purchase_amount <= 0:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Purchase amount must be "
                    "greater than zero."
                ),
            )

        purchase.purchase_amount = (
            data.purchase_amount
        )

    if data.bill_number is not None:
        bill_number = (
            data.bill_number.strip()
        )

        if not bill_number:
            raise HTTPException(
                status_code=400,
                detail="Bill number cannot be empty.",
            )

        purchase.bill_number = bill_number

    if data.purchase_date is not None:
        purchase.purchase_date = (
            data.purchase_date
        )

    # ------------------------------------------------
    # Workflow fields
    # ------------------------------------------------

    if data.checked_by is not None:
        purchase.checked_by = data.checked_by

    if data.entered_by is not None:
        purchase.entered_by = data.entered_by

    if data.grn_number is not None:
        purchase.grn_number = (
            data.grn_number
        )

    # ------------------------------------------------
    # Status
    # ------------------------------------------------

    if data.status is not None:
        purchase.status = data.status

    # ------------------------------------------------
    # GRN required before completion
    # ------------------------------------------------

    if (
        purchase.status == "completed"
        and not purchase.grn_number
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "GRN Number is required "
                "before completing the purchase."
            ),
        )

    # ------------------------------------------------
    # Workflow timestamps
    # ------------------------------------------------

    if (
        old_status != "sent_for_entry"
        and purchase.status
        == "sent_for_entry"
    ):
        purchase.sent_for_entry_at = (
            datetime.now(IST)
        )

    if (
        old_status != "completed"
        and purchase.status
        == "completed"
    ):
        purchase.completed_at = (
            datetime.now(IST)
        )

    # ------------------------------------------------
    # Flush changes before recalculating
    # ------------------------------------------------

    db.flush()

    # ------------------------------------------------
    # Recalculate Daily Report total
    #
    # This remains safe because workflow-only
    # changes do not alter purchase_amount.
    # ------------------------------------------------

    new_total = (
        recalculate_report_purchase_total(
            db,
            report,
        )
    )

    db.commit()
    db.refresh(purchase)

    # ------------------------------------------------
    # Audit description
    # ------------------------------------------------

    new_amount = float(
        purchase.purchase_amount or 0
    )

    changes = []

    if old_amount != new_amount:
        changes.append(
            f"amount ₹{old_amount:,.2f} → "
            f"₹{new_amount:,.2f}"
        )

    if old_supplier != purchase.supplier_name:
        changes.append(
            f"supplier '{old_supplier}' → "
            f"'{purchase.supplier_name}'"
        )

    if old_bill_number != purchase.bill_number:
        changes.append(
            f"bill '{old_bill_number}' → "
            f"'{purchase.bill_number}'"
        )

    if old_product_name != purchase.product_name:
        changes.append(
            f"product '{old_product_name}' → "
            f"'{purchase.product_name}'"
        )

    if old_quantity != purchase.quantity:
        changes.append(
            f"quantity {old_quantity} → "
            f"{purchase.quantity}"
        )

    if old_status != purchase.status:
        changes.append(
            f"status '{old_status}' → "
            f"'{purchase.status}'"
        )

    if changes:
        description = (
            f"Updated purchase bill "
            f"{purchase.bill_number}: "
            + "; ".join(changes)
            + f". Daily report purchase total "
              f"is now ₹{new_total:,.2f}."
        )
    else:
        description = (
            f"Updated purchase bill "
            f"{purchase.bill_number}. "
            f"Daily report purchase total "
            f"is ₹{new_total:,.2f}."
        )

    create_audit_log(
        db=db,
        user_id=current_user["user_id"],
        action="UPDATE",
        table_name="purchases",
        record_id=purchase.id,
        description=description,
    )

    return purchase

# ----------------------------------------------------
# Delete Purchase
# ----------------------------------------------------

@router.delete("/{purchase_id}")
def delete_purchase(
    purchase_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    purchase = (
        db.query(Purchase)
        .filter(
            Purchase.id == purchase_id
        )
        .first()
    )

    if purchase is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase not found",
        )

    # ------------------------------------------------
    # Store isolation
    # ------------------------------------------------

    if (
        current_user["role"] != "owner"
        and purchase.store_id
        != current_user["store_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    # ------------------------------------------------
    # Get report
    # ------------------------------------------------

    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id
            == purchase.daily_report_id
        )
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Daily report not found",
        )

    # ------------------------------------------------
    # Locked reports cannot be changed
    # ------------------------------------------------

    if report.is_locked:
        raise HTTPException(
            status_code=409,
            detail=(
                "This purchase belongs to a locked "
                "daily report and cannot be deleted."
            ),
        )

    # ------------------------------------------------
    # Save information before deletion
    # ------------------------------------------------

    purchase_id_value = purchase.id
    bill_number = purchase.bill_number
    amount = float(
        purchase.purchase_amount or 0
    )
    store_id = purchase.store_id

    # ------------------------------------------------
    # Delete purchase
    # ------------------------------------------------

    db.delete(purchase)

    # Make deletion visible to the aggregate query.
    db.flush()

    # ------------------------------------------------
    # Recalculate report total
    # ------------------------------------------------

    new_total = (
        recalculate_report_purchase_total(
            db,
            report,
        )
    )

    db.commit()

    # ------------------------------------------------
    # Audit
    # ------------------------------------------------

    create_audit_log(
        db=db,
        user_id=current_user["user_id"],
        action="DELETE",
        table_name="purchases",
        record_id=purchase_id_value,
        description=(
            f"Deleted purchase bill "
            f"{bill_number} "
            f"worth ₹{amount:,.2f} "
            f"from store {store_id}. "
            f"Daily report purchase total "
            f"is now ₹{new_total:,.2f}."
        ),
    )

    return {
        "message": "Purchase deleted successfully",
        "purchase_id": purchase_id_value,
        "deleted_amount": amount,
        "daily_report_total_purchases": new_total,
    }


# ----------------------------------------------------
# Get All Purchases
# ----------------------------------------------------

@router.get(
    "/",
    response_model=List[PurchaseResponse],
)
def get_all_purchases(
    current_user: dict = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    query = db.query(Purchase)

    if current_user["role"] != "owner":
        query = query.filter(
            Purchase.store_id
            == current_user["store_id"]
        )

    return (
        query
        .order_by(
            Purchase.purchase_date.desc(),
            Purchase.id.desc(),
        )
        .all()
    )


# ----------------------------------------------------
# Owner Purchases
# ----------------------------------------------------

@router.get(
    "/owner",
    response_model=PaginatedOwnerPurchaseResponse,
)
def get_owner_purchases(
    page: int = Query(1, ge=1),
    page_size: int = Query(
        10,
        ge=1,
        le=100,
    ),

    store_id: int | None = Query(None),
    status: str | None = Query(None),
    supplier: str | None = Query(None),
    bill_number: str | None = Query(None),
    date: date | None = Query(None),

    db: Session = Depends(get_db),
    current_user: dict = Depends(
        get_current_user
    ),
):
    if current_user["role"] != "owner":
        raise HTTPException(
            status_code=403,
            detail=(
                "Only owners can access "
                "this endpoint."
            ),
        )

    query = (
        db.query(
            Purchase,
            Store.name,
        )
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
            Purchase.supplier_name.ilike(
                f"%{supplier}%"
            )
        )

    if bill_number:
        query = query.filter(
            Purchase.bill_number.ilike(
                f"%{bill_number}%"
            )
        )

    if date:
        start = business_date_start(date)
        end = start + timedelta(days=1)

        query = query.filter(
            Purchase.received_date >= start,
            Purchase.received_date < end,
        )

    summary_rows = query.all()

    total_purchase_value = sum(
        float(p.purchase_amount or 0)
        for p, _ in summary_rows
    )

    bills_received = len(summary_rows)

    completed = sum(
        1
        for p, _ in summary_rows
        if p.status == "completed"
    )

    total = len(summary_rows)

    purchases = (
        query
        .order_by(
            Purchase.purchase_date.desc(),
            Purchase.id.desc(),
        )
        .offset(
            (page - 1) * page_size
        )
        .limit(page_size)
        .all()
    )

    return {
        "items": [
            {
                "id": purchase.id,
                "purchase_date": purchase.purchase_date,
                "received_date": purchase.received_date,
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
        "summary": {
            "total_purchase_value":
                total_purchase_value,
            "bills_received":
                bills_received,
            "completed":
                completed,
        },
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
    current_user=Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    if (
        current_user["role"] != "owner"
        and store_id
        != current_user["store_id"]
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
    current_user: dict = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    start = business_date_start(
        ist_today()
    )

    end = start + timedelta(days=1)

    query = (
        db.query(Purchase)
        .filter(
            Purchase.received_date >= start,
            Purchase.received_date < end,
        )
    )

    if current_user["role"] != "owner":
        query = query.filter(
            Purchase.store_id
            == current_user["store_id"]
        )

    return (
        query
        .order_by(
            Purchase.purchase_date.desc()
        )
        .all()
    )