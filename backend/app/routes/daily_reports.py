from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.udhaar_entry import UdhaarEntry
from app.database import get_db
from app.models.daily_report import DailyReport
from app.schemas.daily_report import DailyReportCreate
from app.dependencies.auth import get_current_user
from app.utils.audit import create_audit_log
from sqlalchemy.orm import joinedload
from datetime import datetime, timedelta
from sqlalchemy import or_, and_
from app.models.expense import Expense
from app.models.delivery_assignment import DeliveryAssignment
from app.models.user import User
from app.models.adjustment_request import AdjustmentRequest
from sqlalchemy.orm import joinedload


from app.models.user import User

from app.models.store import Store

from app.schemas.daily_report import SalesUpdate
from app.models.purchase import Purchase
from sqlalchemy import func
from datetime import date
from app.schemas.daily_report import DeliveryUpdate
from datetime import datetime
from zoneinfo import ZoneInfo
router = APIRouter(
    prefix="/daily-reports",
    tags=["Daily Reports"]
)
def ist_today():
    return datetime.now(ZoneInfo("Asia/Kolkata")).date()

def get_purchase_total_for_report(
    db: Session,
    report_id: int,
) -> float:

    purchases = (
        db.query(Purchase)
        .filter(
            Purchase.daily_report_id == report_id,
        )
        .all()
    )

    return sum(
        float(
            purchase.purchase_amount or 0
        )
        for purchase in purchases
    )

def get_udhaar_for_report_date(
    db: Session,
    store_id: int,
    report_date: date,
):
    """
    Returns Udhaar that should be visible for a selected report date.

    Rules:

    1. All Udhaar created on the selected date.
    2. Only unsettled Udhaar from dates before the selected date.
    3. Never include Udhaar from future dates.
    """

    return (
        db.query(UdhaarEntry)
        .join(
            DailyReport,
            UdhaarEntry.daily_report_id == DailyReport.id,
        )
        .filter(
            UdhaarEntry.store_id == store_id,
            DailyReport.report_date <= report_date,
            (
                (DailyReport.report_date == report_date)
                |
                (
                    (DailyReport.report_date < report_date)
                    &
                    (UdhaarEntry.status != "settled")
                )
            ),
        )
        .all()
    )

# Create daily report
@router.post("/")
def create_daily_report(
    data: DailyReportCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = DailyReport(
    store_id=data.store_id,
    submitted_by=current_user["user_id"],
    total_bills=data.total_bills,
    deliveries=data.deliveries,
    cash_sales=data.cash_sales,
    upi_sales=data.upi_sales,
    card_sales=data.card_sales,
    udhaar_sales=data.udhaar_sales,
    system_sales=data.system_sales,
    total_expenses=data.total_expenses,
    total_purchases=data.total_purchases,
)

    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "message": "Daily report submitted",
        "report_id": report.id
    }


# ----------------------------------------------------
# Lock Report
# ----------------------------------------------------

@router.put("/{report_id}/lock")
def lock_daily_report(
    report_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id == report_id
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
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
            detail="Report already locked",
        )

    report.is_submitted = True
    report.is_locked = True

    db.commit()

    create_audit_log(
        db=db,
        user_id=current_user["user_id"],
        action="LOCK",
        table_name="daily_reports",
        record_id=report.id,
        description="Locked daily report",
    )

    return {
        "message": "Daily report locked"
    }


# Update report
@router.put("/{report_id}")
def update_daily_report(
    report_id: int,
    data: DailyReportCreate,
    db: Session = Depends(get_db)
):
    report = db.query(DailyReport).filter(
        DailyReport.id == report_id
    ).first()

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    if report.is_locked:
        raise HTTPException(
            status_code=409,
            detail="Locked reports cannot be edited"
        )

    report.total_bills = data.total_bills
    report.deliveries = data.deliveries
    report.cash_sales = data.cash_sales
    report.upi_sales = data.upi_sales
    report.card_sales = data.card_sales
    report.udhaar_sales = data.udhaar_sales
    report.system_sales = data.system_sales
    report.total_expenses = data.total_expenses

    db.commit()
    db.refresh(report)

    return report

@router.get("/today")
def get_today_report(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user["role"] not in [
        "store_manager",
        "staff",
        "delivery",
    ]:
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.store_id == current_user["store_id"],
            DailyReport.report_date == ist_today(),
        )
        .first()
    )

    if report is None:

        report = DailyReport(
            store_id=current_user["store_id"],
            submitted_by=current_user["user_id"],
            report_date=ist_today(),
        )

        db.add(report)
        db.commit()
        db.refresh(report)

       

    expenses_total = (
        db.query(func.coalesce(func.sum(Expense.amount), 0))
        .filter(
            Expense.daily_report_id == report.id,
        )
        .scalar()
    )

    # ----------------------------------
# Udhaar visible for today's report
# ----------------------------------

    report_udhaar_entries = get_udhaar_for_report_date(
    db=db,
    store_id=report.store_id,
    report_date=report.report_date,
)

    udhaar_total = sum(
    float(entry.amount or 0) - float(entry.paid_amount or 0)
    for entry in report_udhaar_entries
    if entry.status != "settled"
)

    get_purchase_total_for_report(
        db=db,
        report_id=report.id,
)

    purchase_total = get_purchase_total_for_report(
    db=db,
    report_id=report.id,
)

    return {
        "id": report.id,
        "store_id": report.store_id,
        "report_date": report.report_date,

        "total_bills": report.total_bills,
        "deliveries": report.deliveries,

        "cash_sales": report.cash_sales,
        "upi_sales": report.upi_sales,
        "card_sales": report.card_sales,

        "udhaar_sales": udhaar_total,
        "system_sales": report.system_sales,
        "total_expenses": expenses_total,
        "total_purchases": purchase_total,

        "notes": report.notes,
        "is_locked": report.is_locked,
    }

# ----------------------------------------------------
# Get / Create Report By Date
# ----------------------------------------------------
@router.get("/date/{report_date}")
def get_report_by_date(
    report_date: date,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # --------------------------------------------------
    # Find report for this store + selected date
    # --------------------------------------------------

    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.store_id == current_user["store_id"],
            DailyReport.report_date == report_date,
        )
        .first()
    )

    # --------------------------------------------------
    # Create report if it does not exist
    # --------------------------------------------------

    if report is None:
        report = DailyReport(
            store_id=current_user["store_id"],
            submitted_by=current_user["user_id"],
            report_date=report_date,
        )

        db.add(report)
        db.commit()
        db.refresh(report)

   

    # --------------------------------------------------
    # Expenses for THIS report
    # --------------------------------------------------

    expenses = (
        db.query(
            Expense,
            User.full_name.label("created_by_name"),
        )
        .join(
            User,
            Expense.created_by == User.id,
        )
        .filter(
            Expense.daily_report_id == report.id,
        )
        .order_by(
            Expense.created_at.desc()
        )
        .all()
    )

    total_expenses = sum(
        float(expense.amount or 0)
        for expense, _ in expenses
    )

    # --------------------------------------------------
# Udhaar visible for THIS report date
# --------------------------------------------------
    report_udhaar_entries = (
        db.query(UdhaarEntry)
        .filter(
        UdhaarEntry.daily_report_id == report.id
    )
    .all()
)
    if report.is_locked:

        udhaar_total = float(
        report.udhaar_sales or 0
    )

    else:

        report_udhaar_entries = get_udhaar_for_report_date(
        db=db,
        store_id=report.store_id,
        report_date=report.report_date,
    )

        udhaar_total = sum(
        float(entry.amount or 0)
        - float(entry.paid_amount or 0)
        for entry in report_udhaar_entries
        if entry.status != "settled"
    )

    udhaar_total = float(
        udhaar_total or 0
)

    udhaar_total = float(
        udhaar_total or 0
    )

    # --------------------------------------------------
    # Purchases for THIS report
    # --------------------------------------------------

    purchase_total = get_purchase_total_for_report(
    db=db,
    store_id=report.store_id,
    report_date=report.report_date,
)

    # --------------------------------------------------
    # Total Sales
    #
    # Cash + UPI + Card + Udhaar + Expenses
    # --------------------------------------------------

    total_sales = (
        float(report.cash_sales or 0)
        + float(report.upi_sales or 0)
        + float(report.card_sales or 0)
        + udhaar_total
        + total_expenses
    )

    # --------------------------------------------------
    # Expense rows
    # --------------------------------------------------

    expense_items = [
        {
            "id": expense.id,
            "store_id": expense.store_id,
            "daily_report_id": expense.daily_report_id,
            "expense_type": expense.expense_type,
            "amount": expense.amount,
            "remarks": expense.remarks,
            "created_by": expense.created_by,
            "created_by_name": created_by_name,
            "created_at": expense.created_at,
        }
        for expense, created_by_name in expenses
    ]

    # --------------------------------------------------
    # Response
    # --------------------------------------------------

    return {
        "exists": True,

        "id": report.id,
        "store_id": report.store_id,
        "report_date": report.report_date,

        "total_bills": report.total_bills,
        "deliveries": report.deliveries,

        "cash_sales": report.cash_sales,
        "upi_sales": report.upi_sales,
        "card_sales": report.card_sales,

        "udhaar_sales": udhaar_total,
        "system_sales": report.system_sales,

        "total_expenses": total_expenses,
        "total_purchases": purchase_total,

        "total_sales": total_sales,

        "expenses": expense_items,

        "notes": report.notes,
        "is_locked": report.is_locked,
        "is_submitted": report.is_submitted,
    }
@router.put("/{report_id}/sales")
def update_sales(
    report_id: int,
    data: SalesUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(DailyReport)
        .filter(DailyReport.id == report_id)
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    if report.is_locked:
        raise HTTPException(
            status_code=409,
            detail="Report is locked",
        )

    report.total_bills = data.total_bills
    report.cash_sales = data.cash_sales
    report.upi_sales = data.upi_sales
    report.card_sales = data.card_sales
    report.system_sales = data.system_sales
    

    db.commit()
    db.refresh(report)

    return report

@router.put("/{report_id}/notes")
def update_notes(
    report_id: int,
    data: dict,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(DailyReport)
        .filter(DailyReport.id == report_id)
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    if report.is_locked:
        raise HTTPException(
            status_code=409,
            detail="Report is locked",
        )

    report.notes = data.get("notes", "")

    db.commit()
    db.refresh(report)

    return report

@router.put("/{report_id}/deliveries")
def update_deliveries(
    report_id: int,
    data: DeliveryUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(DailyReport)
        .filter(DailyReport.id == report_id)
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    if report.is_locked:
        raise HTTPException(
            status_code=409,
            detail="Report is locked",
        )

    report.deliveries = data.deliveries

    db.commit()
    db.refresh(report)

    return report

@router.post("/{report_id}/submit")
def submit_report(
    report_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(DailyReport)
        .filter(DailyReport.id == report_id)
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    if report.is_locked:
        raise HTTPException(
            status_code=409,
            detail="Report already submitted",
        )

    report.total_purchases = get_purchase_total_for_report(
    db=db,
    report_id=report.id,
)

    report.is_submitted = True
    report.is_locked = True

    db.commit()

    create_audit_log(
        db=db,
        user_id=current_user["user_id"],
        action="SUBMIT",
        table_name="daily_reports",
        record_id=report.id,
        description="Submitted daily report",
    )

    return {
        "message": "Daily report submitted successfully"
    }



@router.get("/{report_id}/purchases")
def get_report_purchases(
    report_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return purchases visible for a specific business-date report.

    Rules:

    1. Purchases directly belonging to this report are ALWAYS visible.
       The daily_report_id is the source of truth for these purchases.

    2. Older purchases that are still pending are carried forward.

    3. Future purchases are never carried forward.

    4. Older completed purchases are not carried forward.

    5. We NEVER modify daily_report_id while displaying carried-forward
       purchases.

    6. Store managers can only see purchases belonging to their own store.
    """

    # --------------------------------------------------
    # Get selected report
    # --------------------------------------------------

    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id == report_id
        )
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    # --------------------------------------------------
    # Store isolation
    # --------------------------------------------------

    if (
        current_user["role"] != "owner"
        and report.store_id != current_user["store_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    # --------------------------------------------------
    # Business-date boundaries
    # --------------------------------------------------

    selected_date_start = datetime.combine(
        report.report_date,
        datetime.min.time(),
    ).replace(
        tzinfo=ZoneInfo("Asia/Kolkata")
    )

    next_date_start = (
        selected_date_start + timedelta(days=1)
    )

    # --------------------------------------------------
    # Purchase visibility
    #
    # A purchase is visible when:
    #
    # A. It belongs directly to this report
    #
    # OR
    #
    # B. It was received before this business date
    #    and is still pending.
    #
    # IMPORTANT:
    #
    # Direct report purchases are NOT filtered by
    # received_date.
    #
    # This protects historical purchases that were
    # created before the business-date system was fixed.
    # --------------------------------------------------

    purchases = (
    db.query(Purchase)
    .filter(
        Purchase.store_id == report.store_id,
        Purchase.daily_report_id == report.id,
    )
    .order_by(
        Purchase.purchase_date.desc(),
        Purchase.id.desc(),
    )
    .all()
)

    # --------------------------------------------------
    # Return response
    # --------------------------------------------------

    return [
        {
            "id": purchase.id,

            "product_name": purchase.product_name,

            "supplier_name": purchase.supplier_name,

            "quantity": purchase.quantity,

            "purchase_amount": purchase.purchase_amount,

            "bill_number": purchase.bill_number,

            "received_by": purchase.received_by,

            "checked_by": purchase.checked_by,

            "entered_by": purchase.entered_by,

            "status": purchase.status,

            "purchase_date": purchase.purchase_date,

            "received_date": purchase.received_date,

            "sent_for_entry_at": purchase.sent_for_entry_at,

            "completed_at": purchase.completed_at,

            "bill_image": purchase.bill_image,
        }
        for purchase in purchases
    ]

@router.get("/{report_id}/expenses")
def get_report_expenses(
    report_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id == report_id
        )
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
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

    expenses = (
        db.query(
            Expense,
            User.full_name.label("created_by_name"),
        )
        .join(
            User,
            Expense.created_by == User.id,
        )
        .filter(
            Expense.daily_report_id == report.id,
        )
        .order_by(
            Expense.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": expense.id,
            "expense_type": expense.expense_type,
            "amount": expense.amount,
            "remarks": expense.remarks,
            "created_by_name": created_by_name,
        }
        for expense, created_by_name in expenses
    ]

# Get all reports
from sqlalchemy import func
from datetime import date

from sqlalchemy.orm import joinedload

@router.get("/")
def get_all_reports(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        db.query(DailyReport)
        .options(joinedload(DailyReport.store))
    )

    if current_user["role"] != "owner":
        query = query.filter(
            DailyReport.store_id == current_user["store_id"]
        )

    if current_user["role"] == "owner":
        query = query.filter(
            DailyReport.is_submitted == True
        )

    reports = (
        query.order_by(DailyReport.report_date.desc())
        .all()
    )

    return [
        {
            "id": report.id,
            "store_id": report.store_id,
            "store_name": report.store.name,
            "report_date": report.report_date,

            "total_bills": report.total_bills,
            "deliveries": report.deliveries,

            "cash_sales": report.cash_sales,
            "upi_sales": report.upi_sales,
            "card_sales": report.card_sales,
            "udhaar_sales": report.udhaar_sales,
            "system_sales": report.system_sales,

            "total_expenses": report.total_expenses,
            "total_purchases": report.total_purchases,

            "is_locked": report.is_locked,
        }
        for report in reports
    ]
@router.get("/today/all")
def get_today_reports(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    print(">>> GET TODAY REPORT CALLED <<<")

    if current_user["role"] != "owner":
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    reports = (
        db.query(DailyReport)
        .options(joinedload(DailyReport.store))
        .filter(
            DailyReport.is_submitted == True,
            DailyReport.report_date == ist_today(),
        )
        .order_by(DailyReport.store_id)
        .all()
    )

    response = []

    for report in reports:

        # --------------------------------------------------
        # Expenses for this report
        # --------------------------------------------------

        expenses_total = (
            db.query(
                func.coalesce(
                    func.sum(Expense.amount),
                    0,
                )
            )
            .filter(
                Expense.daily_report_id == report.id,
            )
            .scalar()
        )

        expenses_total = float(
            expenses_total or 0
        )

        # --------------------------------------------------
        # Udhaar for this report
        # --------------------------------------------------

        report_udhaar_entries = (
            get_udhaar_for_report_date(
                db=db,
                store_id=report.store_id,
                report_date=report.report_date,
            )
        )

        udhaar_total = sum(
            float(entry.amount or 0)
            - float(entry.paid_amount or 0)
            for entry in report_udhaar_entries
            if entry.status != "settled"
        )

        udhaar_total = float(
            udhaar_total or 0
        )

        # --------------------------------------------------
        # Today's received/completed purchases
        # --------------------------------------------------

        purchase_total = get_purchase_total_for_report(
        db=db,
        store_id=report.store_id,
        report_date=report.report_date,
)
        # --------------------------------------------------
        # Response
        # --------------------------------------------------

        response.append(
            {
                "id": report.id,

                "store_id": report.store_id,

                "store_name": report.store.name,

                "report_date": report.report_date,

                "total_bills": report.total_bills,

                "deliveries": report.deliveries,

                "cash_sales": report.cash_sales,

                "upi_sales": report.upi_sales,

                "card_sales": report.card_sales,

                "udhaar_sales": udhaar_total,

                "system_sales": report.system_sales,

                "total_expenses": expenses_total,

                "total_purchases": purchase_total,

                "is_locked": report.is_locked,

                "is_submitted": report.is_submitted,
            }
        )

    return response


# Get reports by store
@router.get("/store/{store_id}")
def get_store_reports(
    store_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user["role"] != "owner":
        if store_id != current_user["store_id"]:
            raise HTTPException(
                status_code=403,
                detail="Not allowed",
            )

    reports = (
        db.query(DailyReport)
        .filter(
            DailyReport.store_id == store_id
        )
        .order_by(
            DailyReport.report_date.desc()
        )
        .all()
    )

    return reports


from calendar import monthrange


@router.get("/calendar/{year}/{month}")
def get_calendar_status(
    year: int,
    month: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    first_day = date(year, month, 1)

    last_day = date(
        year,
        month,
        monthrange(year, month)[1],
    )

    reports = (
        db.query(DailyReport)
        .filter(
            DailyReport.store_id == current_user["store_id"],
            DailyReport.report_date >= first_day,
            DailyReport.report_date <= last_day,
        )
        .all()
    )

    response = []

    for report in reports:
        response.append(
            {
                "date": report.report_date,
                "is_locked": report.is_locked,
                "is_submitted": report.is_submitted,
                "report_id": report.id,
            }
        )

    return response


@router.get("/history")
def get_report_history(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        db.query(DailyReport)
        .options(
            joinedload(DailyReport.store)
        )
        .filter(
            DailyReport.is_submitted == True,
            DailyReport.is_locked == True,
        )
    )

    # Store managers can ONLY see their own store.
    if current_user["role"] != "owner":
        query = query.filter(
            DailyReport.store_id == current_user["store_id"]
        )

    reports = (
        query
        .order_by(
            DailyReport.report_date.desc(),
            DailyReport.id.desc(),
        )
        .all()
    )

    return [
        {
            "id": report.id,
            "store_id": report.store_id,
            "store_name": report.store.name,
            "report_date": report.report_date,

            "total_bills": report.total_bills,
            "deliveries": report.deliveries,

            "cash_sales": report.cash_sales,
            "upi_sales": report.upi_sales,
            "card_sales": report.card_sales,
            "udhaar_sales": report.udhaar_sales,
            "system_sales": report.system_sales,

            "total_expenses": report.total_expenses,
            "total_purchases": report.total_purchases,

            "is_submitted": report.is_submitted,
            "is_locked": report.is_locked,
        }
        for report in reports
    ]

@router.get("/{report_id}")
def get_report(
    report_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    report_query = (
    db.query(DailyReport)
    .options(
        joinedload(DailyReport.store),
        joinedload(DailyReport.submitted_by_user),
        joinedload(DailyReport.adjustment_requests),
    )
    .filter(
        DailyReport.id == report_id
    )
)

    if current_user["role"] != "owner":
        report_query = report_query.filter(
        DailyReport.store_id == current_user["store_id"]
    )

    report = report_query.first()

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )
    expenses = (
    db.query(Expense)
    .filter(
        Expense.daily_report_id == report.id,
    )
    .all()
)

    # --------------------------------------------------
# Udhaar visible for THIS report date
# --------------------------------------------------

    if report.is_locked:
        udhaar_total = float(
        report.udhaar_sales or 0
    )

    else:
        report_udhaar_entries = get_udhaar_for_report_date(
        db=db,
        store_id=report.store_id,
        report_date=report.report_date,
    )

    udhaar_total = sum(
        float(entry.amount or 0)
        - float(entry.paid_amount or 0)
        for entry in report_udhaar_entries
        if entry.status != "settled"
    )

    udhaar_total = float(
        udhaar_total or 0
    )
    
        # --------------------------------------------------
    # Purchases visible for this business date
    # --------------------------------------------------

    purchases = (
    db.query(Purchase)
    .filter(
        Purchase.store_id == report.store_id,
        Purchase.daily_report_id == report.id,
    )
    .order_by(
        Purchase.purchase_date.desc(),
        Purchase.id.desc(),
    )
    .all()
)

    

    delivery_assignments = (
    db.query(
        DeliveryAssignment,
        User.full_name.label("delivery_boy_name"),
    )
    .join(
        User,
        DeliveryAssignment.delivery_boy_id == User.id,
    )
    .filter(
        DeliveryAssignment.daily_report_id == report.id,
    )
    .all()
)
    return {
        "id": report.id,

        "store": {
            "id": report.store.id,
            "name": report.store.name,
            "code": report.store.code,
        },

        "submitted_by": {
            "id": report.submitted_by_user.id,
            "name": report.submitted_by_user.full_name,
        },

        "report_date": report.report_date,

        "status": "LOCKED" if report.is_locked else "OPEN",

        "summary": {
            "sales": (
    float(report.cash_sales or 0)
    + float(report.upi_sales or 0)
    + float(report.card_sales or 0)
    + float(udhaar_total or 0)
    + sum(
        float(expense.amount or 0)
        for expense in expenses
    )
),
            "bills": report.total_bills,
            "deliveries": report.deliveries,
            "purchases": sum(
    float(purchase.purchase_amount or 0)
    for purchase in purchases
),
            "expenses": sum(
    expense.amount
    for expense in expenses
),
        },


       "completed_purchases": [
    {
        "id": purchase.id,
        "supplier_name": purchase.supplier_name,
        "bill_number": purchase.bill_number,
        "purchase_amount": purchase.purchase_amount,
        "received_by": purchase.received_by,
        "checked_by": purchase.checked_by,
        "entered_by": purchase.entered_by,
        "status": purchase.status,
    }
    for purchase in purchases
],

        "payments": {
            "cash": report.cash_sales,
            "upi": report.upi_sales,
            "card": report.card_sales,
            "udhaar": udhaar_total,
            "system_sales": report.system_sales,
        },

       "expenses": [
    {
        "id": expense.id,
        "expense_type": expense.expense_type,
        "amount": expense.amount,
        "remarks": expense.remarks,
    }
    for expense in expenses
],

        "delivery_assignments": [
    {
        "id": assignment.id,
        "delivery_boy_name": delivery_boy_name,
        "deliveries_completed": assignment.deliveries_completed,
    }
    for assignment, delivery_boy_name in delivery_assignments
],

        

        "adjustments": [
            {
                "id": adjustment.id,
                "field_name": adjustment.field_name,
                "old_value": adjustment.old_value,
                "new_value": adjustment.new_value,
                "reason": adjustment.reason,
                "status": adjustment.status,
            }
            for adjustment in report.adjustment_requests
        ],

        "notes": report.notes,
    }

