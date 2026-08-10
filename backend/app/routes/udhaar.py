from app.utils.audit import create_audit_log
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.udhaar_entry import UdhaarEntry
from app.dependencies.auth import get_current_user
from app.models.daily_report import DailyReport
from sqlalchemy import func
from app.schemas.udhaar_entry import (
    BulkUdhaarCreate,
    UdhaarCreate,
    UdhaarRepayment,
)

router = APIRouter(
    prefix="/udhaar",
    tags=["Udhaar"]
)


@router.post("/")
def create_udhaar(
    data: BulkUdhaarCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    print("===== ROUTE HIT =====")
    print("Received:", data.dict())   # use model_dump() if you're on Pydantic v2
    report = (
    db.query(DailyReport)
    .filter(
        DailyReport.id == data.daily_report_id
    )
    .first()
)

    if not report:
        raise HTTPException(
        status_code=404,
        detail="Daily report not found",
    )

    if (
        current_user["role"] != "owner"
        and report.store_id != current_user["store_id"]
):
        raise HTTPException(
        status_code=403,
        detail="Not allowed",
    )

    if report.is_locked:
        raise HTTPException(
        status_code=409,
        detail="Cannot add udhaar to locked report",
    )

    created_entries = []

    for item in data.entries:

        udhaar = UdhaarEntry(
    store_id=report.store_id,
    daily_report_id=data.daily_report_id,
    bill_number=item.bill_number,
    customer_name="",
    customer_phone=None,
    amount=item.amount,
    created_by=current_user["user_id"],
    date_given=report.report_date,
)

        db.add(udhaar)
        created_entries.append(udhaar)

    db.commit()

    for udhaar in created_entries:

        db.refresh(udhaar)

        create_audit_log(
        db=db,
        user_id=udhaar.created_by,
        action="CREATE",
        table_name="udhaar_entries",
        record_id=udhaar.id,
        description="Created udhaar entry",
    )

    return {
    "message": f"{len(created_entries)} entries created"
}
    

@router.post("/{udhaar_id}/repay")
def repay_udhaar(
    udhaar_id: int,
    data: UdhaarRepayment,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    udhaar = db.query(UdhaarEntry).filter(
        UdhaarEntry.id == udhaar_id
    ).first()

    if not udhaar:
        raise HTTPException(
            status_code=404,
            detail="Udhaar not found"
        )

    if (
    current_user["role"] != "owner"
    and udhaar.store_id != current_user["store_id"]
):
        raise HTTPException(
        status_code=403,
        detail="Not allowed",
    )
    remaining = udhaar.amount - udhaar.paid_amount

    if data.amount > remaining:
        raise HTTPException(
        status_code=400,
        detail="Repayment exceeds remaining amount."
    )
    udhaar.paid_amount += data.amount

    if udhaar.paid_amount == 0:
        udhaar.status = "outstanding"

    elif udhaar.paid_amount < udhaar.amount:
        udhaar.status = "partial"

    elif udhaar.paid_amount >= udhaar.amount:
        udhaar.status = "settled"

    report = (
    db.query(DailyReport)
    .filter(
        DailyReport.id == udhaar.daily_report_id
    )
    .first()
)

    if report:
        report.udhaar_sales = (
        db.query(
            func.coalesce(
                func.sum(
                    UdhaarEntry.amount -
                    UdhaarEntry.paid_amount
                ),
                0,
            )
        )
        .filter(
            UdhaarEntry.daily_report_id == report.id,
            UdhaarEntry.status != "settled",
        )
        .scalar()
    )
    db.commit()
    db.refresh(udhaar)

    return udhaar

@router.get("/")
def get_all_udhaar(
    report_id: int | None = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(UdhaarEntry).filter(
        UdhaarEntry.status != "settled"
    )

    # --------------------------------------------------
    # Store isolation
    # --------------------------------------------------

    if current_user["role"] != "owner":
        query = query.filter(
            UdhaarEntry.store_id == current_user["store_id"]
        )

    # --------------------------------------------------
    # Filter by daily report
    # --------------------------------------------------

    if report_id is not None:
        query = query.filter(
            UdhaarEntry.daily_report_id == report_id
        )

    return query.order_by(
        UdhaarEntry.id.desc()
    ).all()

@router.get("/outstanding")
def get_outstanding_udhaar(
    report_id: int | None = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(
        func.coalesce(
            func.sum(
                UdhaarEntry.amount -
                UdhaarEntry.paid_amount
            ),
            0,
        )
    ).filter(
        UdhaarEntry.status != "settled"
    )

    # Store isolation
    if current_user["role"] != "owner":
        query = query.filter(
            UdhaarEntry.store_id == current_user["store_id"]
        )

    # Historical report filtering
    if report_id is not None:
        query = query.filter(
            UdhaarEntry.daily_report_id == report_id
        )

    total = query.scalar()

    return {
        "outstanding": total
    }

@router.get("/{udhaar_id}")
def get_single_udhaar(
    udhaar_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    udhaar = db.query(UdhaarEntry).filter(
        UdhaarEntry.id == udhaar_id
    ).first()

    if not udhaar:
        raise HTTPException(
            status_code=404,
            detail="Udhaar not found"
        )

    if (
    current_user["role"] != "owner"
    and udhaar.store_id != current_user["store_id"]
):
        raise HTTPException(
        status_code=403,
        detail="Not allowed",
    )

    return udhaar