from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.dependencies.auth import get_current_user

from app.models.udhaar_entry import UdhaarEntry
from app.models.daily_report import DailyReport

from app.schemas.udhaar_entry import (
    BulkUdhaarCreate,
    UdhaarRepayment,
)

from app.utils.audit import create_audit_log


router = APIRouter(
    prefix="/udhaar",
    tags=["Udhaar"],
)


# ============================================================
# HELPER
# Recalculate Udhaar value stored on a Daily Report
# ============================================================

def recalculate_report_udhaar_sales(
    db: Session,
    report_id: int,
):
    total = (
        db.query(
            func.coalesce(
                func.sum(
                    UdhaarEntry.amount
                    - UdhaarEntry.paid_amount
                ),
                0,
            )
        )
        .filter(
            UdhaarEntry.daily_report_id == report_id,
            UdhaarEntry.status != "settled",
        )
        .scalar()
    )

    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id == report_id
        )
        .first()
    )

    if report:
        report.udhaar_sales = float(total or 0)


# ============================================================
# CREATE UDHAAR
# ============================================================

@router.post("/")
def create_udhaar(
    data: BulkUdhaarCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
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

    # Store isolation
    if (
        current_user["role"] != "owner"
        and report.store_id != current_user["store_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    # Locked report cannot be modified
    if report.is_locked:
        raise HTTPException(
            status_code=409,
            detail="Cannot add udhaar to locked report",
        )

    created_entries = []

    for item in data.entries:

        # --------------------------------------------------
        # Validate amount
        # --------------------------------------------------

        if item.amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Udhaar amount must be greater than 0.",
            )

        udhaar = UdhaarEntry(
            store_id=report.store_id,
            daily_report_id=report.id,
            bill_number=item.bill_number,
            customer_name="",
            customer_phone=None,
            amount=item.amount,
            paid_amount=0,
            created_by=current_user["user_id"],

            # IMPORTANT:
            # Udhaar belongs to the report date
            date_given=report.report_date,

            status="outstanding",
        )

        db.add(udhaar)
        created_entries.append(udhaar)

    # Save entries first
    db.commit()

    # Refresh entries
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

    # --------------------------------------------------
    # IMPORTANT:
    # Update Daily Report Udhaar value
    # --------------------------------------------------

    recalculate_report_udhaar_sales(
        db=db,
        report_id=report.id,
    )

    db.commit()

    return {
        "message": f"{len(created_entries)} entries created",
        "report_udhaar_sales": report.udhaar_sales,
    }


# ============================================================
# REPAY UDHAAR
# ============================================================

@router.post("/{udhaar_id}/repay")
def repay_udhaar(
    udhaar_id: int,
    data: UdhaarRepayment,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    udhaar = (
        db.query(UdhaarEntry)
        .filter(
            UdhaarEntry.id == udhaar_id
        )
        .first()
    )

    if not udhaar:
        raise HTTPException(
            status_code=404,
            detail="Udhaar not found",
        )

    # Store isolation
    if (
        current_user["role"] != "owner"
        and udhaar.store_id != current_user["store_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    # --------------------------------------------------
    # Prevent invalid repayment amounts
    # --------------------------------------------------

    if data.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Repayment amount must be greater than 0.",
        )

    remaining = (
        udhaar.amount
        - udhaar.paid_amount
    )

    if data.amount > remaining:
        raise HTTPException(
            status_code=400,
            detail="Repayment exceeds remaining amount.",
        )

    # --------------------------------------------------
    # Apply repayment
    # --------------------------------------------------

    udhaar.paid_amount += data.amount

    if udhaar.paid_amount == 0:
        udhaar.status = "outstanding"

    elif udhaar.paid_amount < udhaar.amount:
        udhaar.status = "partial"

    else:
        udhaar.paid_amount = udhaar.amount
        udhaar.status = "settled"

    # --------------------------------------------------
    # Recalculate the report this Udhaar belongs to
    # --------------------------------------------------

    recalculate_report_udhaar_sales(
        db=db,
        report_id=udhaar.daily_report_id,
    )

    db.commit()
    db.refresh(udhaar)

    return udhaar


# ============================================================
# GET UDHAAR
# ============================================================

@router.get("/")
def get_all_udhaar(
    report_id: int | None = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(UdhaarEntry)

    # --------------------------------------------------
    # Store isolation
    # --------------------------------------------------

    if current_user["role"] != "owner":
        query = query.filter(
            UdhaarEntry.store_id
            == current_user["store_id"]
        )

    # ==================================================
    # HISTORICAL / SELECTED REPORT
    # ==================================================

    if report_id is not None:

        selected_report = (
            db.query(DailyReport)
            .filter(
                DailyReport.id == report_id
            )
            .first()
        )

        if not selected_report:
            raise HTTPException(
                status_code=404,
                detail="Daily report not found",
            )

        selected_date = (
            selected_report.report_date
        )

        # --------------------------------------------------
        # IMPORTANT:
        #
        # We compare Udhaar against the DATE OF THE
        # DAILY REPORT IT BELONGS TO.
        #
        # This prevents future Udhaar from appearing
        # in historical reports.
        # --------------------------------------------------

        query = (
            query
            .join(
                DailyReport,
                UdhaarEntry.daily_report_id
                == DailyReport.id,
            )
            .filter(
                DailyReport.report_date
                <= selected_date
            )
            .filter(
                (
                    DailyReport.report_date
                    == selected_date
                )
                |
                (
                    (DailyReport.report_date < selected_date)
                    &
                    (
                        UdhaarEntry.status
                        != "settled"
                    )
                )
            )
        )

    # ==================================================
    # NORMAL UDHAAR PAGE
    # ==================================================

    else:

        # Today/current page:
        # show all currently pending Udhaar.
        query = query.filter(
            UdhaarEntry.status
            != "settled"
        )

    return (
        query
        .order_by(
            UdhaarEntry.id.asc()
        )
        .all()
    )


# ============================================================
# OUTSTANDING UDHAAR
# ============================================================

@router.get("/outstanding")
def get_outstanding_udhaar(
    report_id: int | None = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(
        func.coalesce(
            func.sum(
                UdhaarEntry.amount
                - UdhaarEntry.paid_amount
            ),
            0,
        )
    ).filter(
        UdhaarEntry.status
        != "settled"
    )

    # Store isolation
    if current_user["role"] != "owner":
        query = query.filter(
            UdhaarEntry.store_id
            == current_user["store_id"]
        )

    # Historical report filtering
    if report_id is not None:

        selected_report = (
            db.query(DailyReport)
            .filter(
                DailyReport.id == report_id
            )
            .first()
        )

        if not selected_report:
            raise HTTPException(
                status_code=404,
                detail="Daily report not found",
            )

        selected_date = (
            selected_report.report_date
        )

        query = (
            query
            .join(
                DailyReport,
                UdhaarEntry.daily_report_id
                == DailyReport.id,
            )
            .filter(
                DailyReport.report_date
                <= selected_date
            )
        )

    total = query.scalar()

    return {
        "outstanding": float(total or 0)
    }


# ============================================================
# GET SINGLE UDHAAR
# ============================================================

@router.get("/{udhaar_id}")
def get_single_udhaar(
    udhaar_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    udhaar = (
        db.query(UdhaarEntry)
        .filter(
            UdhaarEntry.id == udhaar_id
        )
        .first()
    )

    if not udhaar:
        raise HTTPException(
            status_code=404,
            detail="Udhaar not found",
        )

    if (
        current_user["role"] != "owner"
        and udhaar.store_id
        != current_user["store_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    return udhaar