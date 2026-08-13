from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

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


# ----------------------------------------------------
# Recalculate Udhaar Sales
# ----------------------------------------------------

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
            UdhaarEntry.daily_report_id
            == report_id,

            UdhaarEntry.status
            != "settled",
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
        report.udhaar_sales = float(
            total or 0
        )


# ----------------------------------------------------
# Create Udhaar
# ----------------------------------------------------

@router.post("/")
def create_udhaar(
    data: BulkUdhaarCreate,
    current_user=Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id
            == data.daily_report_id
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
        and report.store_id
        != current_user["store_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    if report.is_locked:
        raise HTTPException(
            status_code=409,
            detail=(
                "Cannot add udhaar "
                "to locked report"
            ),
        )

    created_entries = []

    for item in data.entries:

        if item.amount <= 0:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Udhaar amount must "
                    "be greater than 0."
                ),
            )

        udhaar = UdhaarEntry(
            store_id=report.store_id,

            daily_report_id=report.id,

            bill_number=item.bill_number,

            customer_name="",

            customer_phone=None,

            amount=item.amount,

            paid_amount=0,

            created_by=
                current_user["user_id"],

            # IMPORTANT:
            # Use the report date,
            # NOT date.today().
            date_given=
                report.report_date,

            status="outstanding",
        )

        db.add(udhaar)

        created_entries.append(
            udhaar
        )

    db.commit()

    for udhaar in created_entries:

        db.refresh(udhaar)

        create_audit_log(
            db=db,
            user_id=
                udhaar.created_by,
            action="CREATE",
            table_name=
                "udhaar_entries",
            record_id=
                udhaar.id,
            description=
                "Created udhaar entry",
        )

    recalculate_report_udhaar_sales(
        db=db,
        report_id=report.id,
    )

    db.commit()

    return {
        "message":
            f"{len(created_entries)} "
            "entries created",

        "report_udhaar_sales":
            report.udhaar_sales,
    }


# ----------------------------------------------------
# Repay Udhaar
# ----------------------------------------------------

@router.post("/{udhaar_id}/repay")
def repay_udhaar(
    udhaar_id: int,
    data: UdhaarRepayment,
    current_user=Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    udhaar = (
        db.query(UdhaarEntry)
        .filter(
            UdhaarEntry.id
            == udhaar_id
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

    if data.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail=(
                "Repayment amount must "
                "be greater than 0."
            ),
        )

    remaining = (
        udhaar.amount
        - udhaar.paid_amount
    )

    if data.amount > remaining:
        raise HTTPException(
            status_code=400,
            detail=(
                "Repayment exceeds "
                "remaining amount."
            ),
        )

    udhaar.paid_amount += data.amount

    if udhaar.paid_amount <= 0:

        udhaar.status = "outstanding"

    elif (
        udhaar.paid_amount
        < udhaar.amount
    ):

        udhaar.status = "partial"

    else:

        udhaar.paid_amount = (
            udhaar.amount
        )

        udhaar.status = "settled"

    # Keep the original report's
    # Udhaar sales calculation intact.
    recalculate_report_udhaar_sales(
        db=db,
        report_id=
            udhaar.daily_report_id,
    )

    db.commit()

    db.refresh(udhaar)

    return udhaar


# ----------------------------------------------------
# Get Udhaar
# ----------------------------------------------------

@router.get("/")
def get_all_udhaar(
    report_id: int | None = None,
    current_user: dict =
        Depends(get_current_user),
    db: Session =
        Depends(get_db),
):
    query = db.query(
        UdhaarEntry
    )

    # ------------------------------------------------
    # Store isolation
    # ------------------------------------------------

    if current_user["role"] != "owner":
        query = query.filter(
            UdhaarEntry.store_id
            == current_user["store_id"]
        )

    # ------------------------------------------------
    # Selected business date
    # ------------------------------------------------

    if report_id is not None:

        selected_report = (
            db.query(DailyReport)
            .filter(
                DailyReport.id
                == report_id
            )
            .first()
        )

        if not selected_report:
            raise HTTPException(
                status_code=404,
                detail=(
                    "Daily report "
                    "not found"
                ),
            )

        if (
            current_user["role"]
            != "owner"
            and selected_report.store_id
            != current_user["store_id"]
        ):
            raise HTTPException(
                status_code=403,
                detail="Not allowed",
            )

        selected_date = (
            selected_report.report_date
        )

        # ------------------------------------------------
        # IMPORTANT BUSINESS RULE
        #
        # Same date:
        #     Show all entries created on that date.
        #
        # Older dates:
        #     Show only unsettled entries.
        #
        # Future dates:
        #     NEVER show.
        # ------------------------------------------------

        query = (
            query
            .join(
                DailyReport,
                UdhaarEntry.daily_report_id
                == DailyReport.id,
            )
            .filter(
                DailyReport.store_id
                == selected_report.store_id,

                DailyReport.report_date
                <= selected_date,

                (
                    (
                        DailyReport.report_date
                        == selected_date
                    )
                    |
                    (
                        (
                            DailyReport.report_date
                            < selected_date
                        )
                        &
                        (
                            UdhaarEntry.status
                            != "settled"
                        )
                    )
                ),
            )
        )

    else:

        # Normal Udhaar page:
        # show current outstanding entries.
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


# ----------------------------------------------------
# Outstanding Udhaar
# ----------------------------------------------------

@router.get("/outstanding")
def get_outstanding_udhaar(
    report_id: int | None = None,
    current_user: dict =
        Depends(get_current_user),
    db: Session =
        Depends(get_db),
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

    if current_user["role"] != "owner":
        query = query.filter(
            UdhaarEntry.store_id
            == current_user["store_id"]
        )

    if report_id is not None:

        selected_report = (
            db.query(DailyReport)
            .filter(
                DailyReport.id
                == report_id
            )
            .first()
        )

        if not selected_report:
            raise HTTPException(
                status_code=404,
                detail=(
                    "Daily report "
                    "not found"
                ),
            )

        if (
            current_user["role"]
            != "owner"
            and selected_report.store_id
            != current_user["store_id"]
        ):
            raise HTTPException(
                status_code=403,
                detail="Not allowed",
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
                DailyReport.store_id
                == selected_report.store_id,

                DailyReport.report_date
                <= selected_date,

                UdhaarEntry.status
                != "settled",
            )
        )

    total = query.scalar()

    return {
        "outstanding":
            float(total or 0)
    }


# ----------------------------------------------------
# Get Single Udhaar
# ----------------------------------------------------

@router.get("/{udhaar_id}")
def get_single_udhaar(
    udhaar_id: int,
    current_user=Depends(
        get_current_user
    ),
    db: Session =
        Depends(get_db),
):
    udhaar = (
        db.query(UdhaarEntry)
        .filter(
            UdhaarEntry.id
            == udhaar_id
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