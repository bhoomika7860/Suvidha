from app.utils.audit import create_audit_log
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.udhaar_entry import UdhaarEntry
from app.dependencies.auth import get_current_user
from app.models.daily_report import DailyReport
from app.schemas.udhaar_entry import (
    UdhaarCreate,
    UdhaarRepayment
)

router = APIRouter(
    prefix="/udhaar",
    tags=["Udhaar"]
)


@router.post("/")
def create_udhaar(
    data: UdhaarCreate,
    db: Session = Depends(get_db)
):
    report = db.query(DailyReport).filter(
        DailyReport.id == data.daily_report_id
    ).first()

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Daily report not found"
        )

    if report.is_locked:
        raise HTTPException(
            status_code=409,
            detail="Cannot add udhaar to locked report"
        )

    udhaar = UdhaarEntry(
        store_id=report.store_id,
        daily_report_id=data.daily_report_id,
        customer_name=data.customer_name,
        customer_phone=data.customer_phone,
        amount=data.amount,
        created_by=report.submitted_by
    )

    db.add(udhaar)
    db.commit()
    db.refresh(udhaar)
    create_audit_log(
        db=db,
        user_id=udhaar.created_by,
        action="CREATE",
        table_name="udhaar_entries",
        record_id=udhaar.id,
        description="Created udhaar entry"
    )

    return udhaar
    

@router.post("/{udhaar_id}/repay")
def repay_udhaar(
    udhaar_id: int,
    data: UdhaarRepayment,
    db: Session = Depends(get_db)
):
    udhaar = db.query(UdhaarEntry).filter(
        UdhaarEntry.id == udhaar_id
    ).first()

    if not udhaar:
        raise HTTPException(
            status_code=404,
            detail="Udhaar not found"
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

    db.commit()
    db.refresh(udhaar)

    return udhaar


@router.get("/")
def get_all_udhaar(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(UdhaarEntry).filter(
        UdhaarEntry.status != "settled"
    )

    if current_user["role"] == "owner":
        return query.all()

    return query.filter(
        UdhaarEntry.store_id == current_user["store_id"]
    ).all()


@router.get("/{udhaar_id}")
def get_single_udhaar(
    udhaar_id: int,
    db: Session = Depends(get_db)
):
    udhaar = db.query(UdhaarEntry).filter(
        UdhaarEntry.id == udhaar_id
    ).first()

    if not udhaar:
        raise HTTPException(
            status_code=404,
            detail="Udhaar not found"
        )

    return udhaar