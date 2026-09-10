from collections import defaultdict
from datetime import date, timedelta
from io import BytesIO
from typing import Any, Dict, List, Optional, Tuple

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from datetime import datetime
from zoneinfo import ZoneInfo
from sqlalchemy import func
from sqlalchemy.orm import Session
from sqlalchemy import extract
from datetime import date, timedelta
from app.models.daily_report import DailyReport
from app.models.store import Store
from openpyxl import Workbook
from openpyxl.styles import Font

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
)

from app.database import get_db

from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_role

from app.models.daily_report import DailyReport
from app.models.expense import Expense
from app.models.purchase import Purchase
from app.models.store import Store
from app.models.udhaar_entry import UdhaarEntry


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)
def ist_today():
    return datetime.now(ZoneInfo("Asia/Kolkata")).date()


def _local_date(value):
    """Return the date represented by a DB date/datetime in India time."""
    if value is None:
        return None

    if isinstance(value, datetime):
        if value.tzinfo is not None:
            return value.astimezone(ZoneInfo("Asia/Kolkata")).date()
        # Existing SQLite rows may be naive. Preserve their stored calendar date.
        return value.date()

    if isinstance(value, date):
        return value

    return None


def _in_period(value, start_date, end_date):
    local_date = _local_date(value)

    if local_date is None:
        return False

    if start_date and local_date < start_date:
        return False

    if end_date and local_date > end_date:
        return False

    return True


def _get_expenses(
    db: Session,
    period=None,
    store_id="all",
):
    """Load real expense rows and apply the analytics period/store scope."""
    query = db.query(Expense)

    if store_id != "all":
        query = query.filter(Expense.store_id == int(store_id))

    start_date, end_date = _get_period_bounds(period)
    expenses = query.all()

    if start_date or end_date:
        expenses = [
            expense
            for expense in expenses
            if _in_period(expense.created_at, start_date, end_date)
        ]

    return expenses


def _get_purchases(
    db: Session,
    period=None,
    store_id="all",
):
    """Load real purchase rows and apply the analytics period/store scope."""
    query = db.query(Purchase)

    if store_id != "all":
        query = query.filter(Purchase.store_id == int(store_id))

    start_date, end_date = _get_period_bounds(period)
    purchases = query.all()

    if start_date or end_date:
        purchases = [
            purchase
            for purchase in purchases
            if _in_period(purchase.purchase_date, start_date, end_date)
        ]

    return purchases


def _purchase_status_bucket(status):
    """Normalize the three purchase states used by the Purchases module."""
    normalized = str(status or "").strip().lower()
    normalized = normalized.replace("-", "_").replace(" ", "_")

    if normalized == "received":
        return "received"

    if normalized in {"pending", "waiting_entry", "waiting_for_entry"}:
        return "pending"

    if normalized == "completed":
        return "completed"

    return "unclassified"


def _purchase_summary_by_store(
    db: Session,
    period=None,
    store_id="all",
):
    """Return purchase totals from Purchase rows, including every status."""
    purchases = _get_purchases(db, period, store_id)
    summary = {}

    for purchase in purchases:
        sid = purchase.store_id
        if sid not in summary:
            summary[sid] = {
                "received_purchases": 0.0,
                "pending_purchases": 0.0,
                "completed_purchases": 0.0,
                "unclassified_purchases": 0.0,
                "total_purchases": 0.0,
            }

        amount = _safe_number(purchase.purchase_amount)
        bucket = _purchase_status_bucket(
            getattr(purchase, "status", None)
        )

        summary[sid]["total_purchases"] += amount
        summary[sid][f"{bucket}_purchases"] += amount

    for values in summary.values():
        for key in values:
            values[key] = round(values[key], 2)

    return summary, purchases

def _safe_number(value):

    if value is None:
        return 0

    return float(value)



def _get_period_bounds(
    period,
    from_date=None,
    to_date=None,
):
    today = ist_today()

    if period == "today":
        return today, today

    elif period in ["7days", "last7"]:
        return today - timedelta(days=7), today

    elif period in ["30days", "last30"]:
        return today - timedelta(days=30), today

    elif period == "90days":
        return today - timedelta(days=90), today

    elif period in ["month", "thisMonth"]:
        return today.replace(day=1), today

    elif period == "last_month":
        first_this_month = today.replace(day=1)
        last_day_prev = first_this_month - timedelta(days=1)
        first_prev = last_day_prev.replace(day=1)
        return first_prev, last_day_prev

    elif period in ["year", "thisYear"]:
        return date(today.year, 1, 1), today

    elif period == "custom":
        start = (
            datetime.strptime(from_date, "%Y-%m-%d").date()
            if from_date else None
        )

        end = (
            datetime.strptime(to_date, "%Y-%m-%d").date()
            if to_date else None
        )

        return start, end

    return None, None


def _get_reports(
    db,
    period=None,
    store_id=None,
    from_date=None,
    to_date=None,
    submitted_only=False,
) -> List[DailyReport]:

    query = db.query(DailyReport)

    # Only include submitted reports when required
    if submitted_only:
        query = query.filter(
            DailyReport.is_submitted == True
        )

    start_date, end_date = _get_period_bounds(
        period,
        from_date,
        to_date,
    )

    if start_date:
        query = query.filter(
            DailyReport.report_date >= start_date
        )

    if end_date:
        query = query.filter(
            DailyReport.report_date <= end_date
        )

    if (
        store_id
        and str(store_id).lower() != "all"
    ):
        query = query.filter(
            DailyReport.store_id == int(store_id)
        )

    return query.all()

def _monthly_series(
    reports: List[DailyReport],
):

    monthly = defaultdict(float)

    for report in reports:

        if not report.report_date:
            continue

        month = report.report_date.strftime("%b")

        revenue = (
    _safe_number(report.cash_sales)
    + _safe_number(report.upi_sales)
    + _safe_number(report.card_sales)
    + _safe_number(report.udhaar_sales)
)

        monthly[month] += revenue

    return [
        {
            "month": month,
            "revenue": value,
        }
        for month, value in monthly.items()
    ]

def _get_outstanding_entries(
    db: Session,
    period=None,
    store_id="all",
):

    query = db.query(UdhaarEntry)

    if (
        store_id
        and str(store_id).lower() != "all"
    ):
        query = query.filter(
            UdhaarEntry.store_id == int(store_id)
        )

    return query.all()

def _today_report(db: Session, store_id: int):

    return (
        db.query(DailyReport)
        .filter(
            DailyReport.store_id == store_id,
            DailyReport.report_date == ist_today(),
        )
        .first()
    )


@router.get("/dashboard-summary")
def dashboard_summary(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(
        ["owner", "store_manager"],
        current_user["role"],
    )

    if current_user["role"] == "store_manager":
        store_id = str(current_user["store_id"])

    reports = _get_reports(
        db=db,
        period=period,
        store_id=store_id,
        submitted_only=current_user["role"] == "owner",
    )

    total_sales = sum(
        _safe_number(report.cash_sales)
        + _safe_number(report.upi_sales)
        + _safe_number(report.card_sales)
        + _safe_number(report.udhaar_sales)
        for report in reports
    )

    total_bills = sum(report.total_bills or 0 for report in reports)
    total_deliveries = sum(report.deliveries or 0 for report in reports)

    purchase_summary, purchase_rows = _purchase_summary_by_store(
        db,
        period,
        store_id,
    )
    total_purchases = sum(
        values["total_purchases"]
        for values in purchase_summary.values()
    )
    purchase_bills_completed = sum(
        1
        for purchase in purchase_rows
        if _purchase_status_bucket(
            getattr(purchase, "status", None)
        ) == "completed"
    )

    # Expenses are calculated from the Expense table itself, not the cached
    # daily_reports.total_expenses field. This keeps the KPI and breakdown
    # mathematically consistent.
    expense_rows = _get_expenses(db, period, store_id)
    total_expenses = sum(
        _safe_number(expense.amount)
        for expense in expense_rows
    )

    # Outstanding udhaar is a current balance, so it is intentionally not
    # restricted by the selected reporting period.
    udhaar_query = db.query(UdhaarEntry)
    if store_id != "all":
        udhaar_query = udhaar_query.filter(
            UdhaarEntry.store_id == int(store_id)
        )

    total_udhaar = 0.0
    recovered_udhaar = 0.0

    for entry in udhaar_query.all():
        amount = _safe_number(entry.amount)
        paid_amount = _safe_number(entry.paid_amount)
        total_udhaar += max(amount - paid_amount, 0)
        recovered_udhaar += paid_amount

    average_bill = total_sales / total_bills if total_bills else 0

    return {
        "total_sales": round(total_sales, 2),
        "purchase_bills_completed": purchase_bills_completed,
        "total_revenue": round(total_sales, 2),
        "total_purchases": round(total_purchases, 2),
        "total_deliveries": total_deliveries,
        "total_bills": total_bills,
        "average_bill_value": round(average_bill, 2),
        "average_bill": round(average_bill, 2),
        "total_expenses": round(total_expenses, 2),
        "total_udhaar": round(total_udhaar, 2),
        "outstanding_udhaar": round(total_udhaar, 2),
        "recovered_udhaar": round(recovered_udhaar, 2),
        "submitted_reports": len(reports),
        "sales_difference": round(
            total_sales
            - sum(
                _safe_number(report.system_sales)
                for report in reports
            ),
            2,
        ),
    }


@router.get("/store-summary")
def store_summary(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(
        ["owner", "store_manager"],
        current_user["role"],
    )

    if current_user["role"] == "store_manager":
        store_id = str(current_user["store_id"])

    reports = _get_reports(
        db=db,
        period=period,
        store_id=store_id,
        submitted_only=current_user["role"] == "owner",
    )

    purchase_summary, _ = _purchase_summary_by_store(
        db,
        period,
        store_id,
    )
    expense_rows = _get_expenses(db, period, store_id)

    stores_query = db.query(Store)
    if store_id != "all":
        stores_query = stores_query.filter(Store.id == int(store_id))

    stores = {}
    for store in stores_query.order_by(Store.id).all():
        stores[store.id] = {
            "store_id": store.id,
            "store_name": store.name,
            "total_sales": 0.0,
            "total_bills": 0,
            "total_expenses": 0.0,
            "total_purchases": 0.0,
            "received_purchases": 0.0,
            "pending_purchases": 0.0,
            "completed_purchases": 0.0,
            "unclassified_purchases": 0.0,
        }

    for report in reports:
        sid = report.store_id

        if sid not in stores:
            store = db.query(Store).filter(Store.id == sid).first()
            stores[sid] = {
                "store_id": sid,
                "store_name": store.name if store else f"Store {sid}",
                "total_sales": 0.0,
                "total_bills": 0,
                "total_expenses": 0.0,
                "total_purchases": 0.0,
                "received_purchases": 0.0,
                "pending_purchases": 0.0,
                "completed_purchases": 0.0,
                "unclassified_purchases": 0.0,
            }

        stores[sid]["total_sales"] += (
            _safe_number(report.cash_sales)
            + _safe_number(report.upi_sales)
            + _safe_number(report.card_sales)
            + _safe_number(report.udhaar_sales)
        )
        stores[sid]["total_bills"] += report.total_bills or 0

    for expense in expense_rows:
        if expense.store_id in stores:
            stores[expense.store_id]["total_expenses"] += _safe_number(
                expense.amount
            )

    for sid, values in purchase_summary.items():
        if sid not in stores:
            store = db.query(Store).filter(Store.id == sid).first()
            stores[sid] = {
                "store_id": sid,
                "store_name": store.name if store else f"Store {sid}",
                "total_sales": 0.0,
                "total_bills": 0,
                "total_expenses": 0.0,
                "total_purchases": 0.0,
                "received_purchases": 0.0,
                "pending_purchases": 0.0,
                "completed_purchases": 0.0,
                "unclassified_purchases": 0.0,
            }

        stores[sid].update(values)

    for values in stores.values():
        values["total_sales"] = round(values["total_sales"], 2)
        values["total_expenses"] = round(values["total_expenses"], 2)
        values["total_purchases"] = round(values["total_purchases"], 2)
        values["received_purchases"] = round(values["received_purchases"], 2)
        values["pending_purchases"] = round(values["pending_purchases"], 2)
        values["completed_purchases"] = round(values["completed_purchases"], 2)
        values["unclassified_purchases"] = round(values["unclassified_purchases"], 2)

    return list(stores.values())


@router.get("/purchase-summary")
def purchase_summary(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Purchase analytics from real Purchase rows, split by every status."""
    require_role(
        ["owner", "store_manager"],
        current_user["role"],
    )

    if current_user["role"] == "store_manager":
        store_id = str(current_user["store_id"])

    summary, _ = _purchase_summary_by_store(
        db,
        period,
        store_id,
    )

    stores_query = db.query(Store)
    if store_id != "all":
        stores_query = stores_query.filter(Store.id == int(store_id))

    return [
        {
            "store_id": store.id,
            "store_name": store.name,
            "received": round(summary.get(store.id, {}).get("received_purchases", 0), 2),
            "pending": round(summary.get(store.id, {}).get("pending_purchases", 0), 2),
            "completed": round(summary.get(store.id, {}).get("completed_purchases", 0), 2),
            "unclassified": round(summary.get(store.id, {}).get("unclassified_purchases", 0), 2),
            "total": round(summary.get(store.id, {}).get("total_purchases", 0), 2),
        }
        for store in stores_query.order_by(Store.id).all()
    ]


@router.get("/payment-breakdown")
def payment_breakdown(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    require_role(
        ["owner", "store_manager"],
        current_user["role"],
    )

    if current_user["role"] == "store_manager":
        store_id = str(current_user["store_id"])

    reports = _get_reports(
    db=db,
    period=period,
    store_id=store_id,
    submitted_only=current_user["role"] == "owner",
)
    cash = 0
    upi = 0
    card = 0
    udhaar = 0

    for report in reports:

        cash += _safe_number(report.cash_sales)
        upi += _safe_number(report.upi_sales)
        card += _safe_number(report.card_sales)
        udhaar += _safe_number(report.udhaar_sales)

    return [
        {
            "name": "Cash",
            "value": round(cash, 2),
        },
        {
            "name": "UPI",
            "value": round(upi, 2),
        },
        {
            "name": "Card",
            "value": round(card, 2),
        },
        {
            "name": "Udhaar",
            "value": round(udhaar, 2),
        },
    ]

@router.get("/expense-distribution")
def expense_distribution(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(
        ["owner", "store_manager"],
        current_user["role"],
    )

    if current_user["role"] == "store_manager":
        store_id = str(current_user["store_id"])

    expenses = _get_expenses(db, period, store_id)
    grouped = defaultdict(float)

    for expense in expenses:
        grouped[expense.expense_type] += _safe_number(expense.amount)

    return [
        {
            "name": name,
            "amount": round(amount, 2),
        }
        for name, amount in grouped.items()
    ]


@router.get("/sales-trend")
def sales_trend(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    require_role(
        ["owner", "store_manager"],
        current_user["role"],
    )

    if current_user["role"] == "store_manager":
        store_id = str(current_user["store_id"])

    reports = _get_reports(
    db=db,
    period=period,
    store_id=store_id,
    submitted_only=current_user["role"] == "owner",
)

    return _monthly_series(reports)
@router.get("/outstanding-udhaar")
def outstanding_udhaar(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(
        ["owner", "store_manager"],
        current_user["role"],
    )

    query = db.query(UdhaarEntry)

    if current_user["role"] == "store_manager":
        query = query.filter(
            UdhaarEntry.store_id == current_user["store_id"]
        )
    elif store_id != "all":
        query = query.filter(
            UdhaarEntry.store_id == int(store_id)
        )

    grouped = {}

    for entry in query.all():
        store = (
            db.query(Store)
            .filter(Store.id == entry.store_id)
            .first()
        )

        name = store.name if store else f"Store {entry.store_id}"

        if name not in grouped:
            grouped[name] = {
                "total_credit": 0.0,
                "recovered": 0.0,
                "pending": 0.0,
            }

        amount = _safe_number(entry.amount)
        paid_amount = _safe_number(entry.paid_amount)
        outstanding = max(amount - paid_amount, 0)

        grouped[name]["total_credit"] += amount
        grouped[name]["recovered"] += paid_amount
        grouped[name]["pending"] += outstanding

    return [
        {
            "store_name": name,
            "total_credit": round(values["total_credit"], 2),
            "pending": round(values["pending"], 2),
            "recovered": round(values["recovered"], 2),
            "outstanding": round(values["pending"], 2),
            "recovery_rate": round(
                min(
                    values["recovered"] / values["total_credit"] * 100,
                    100,
                )
                if values["total_credit"] > 0
                else 0,
                2,
            ),
        }
        for name, values in grouped.items()
    ]


@router.get("/performance")
def performance(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    require_role(
        ["owner", "store_manager"],
        current_user["role"],
    )

    if current_user["role"] == "store_manager":
        store_id = str(current_user["store_id"])

    reports = _get_reports(
    db=db,
    period=period,
    store_id=store_id,
    submitted_only=current_user["role"] == "owner",
)

    revenue = sum(

        _safe_number(report.cash_sales)

        + _safe_number(report.upi_sales)

        + _safe_number(report.card_sales)

        + _safe_number(report.udhaar_sales)

        for report in reports

    )

    expenses = sum(
        _safe_number(expense.amount)
        for expense in _get_expenses(db, period, store_id)
    )

    profit = revenue - expenses

    margin = (
        (profit / revenue) * 100
        if revenue
        else 0
    )

    return {

        "revenue": round(revenue, 2),

        "expenses": round(expenses, 2),

        "profit": round(profit, 2),

        "profit_margin": round(
            margin,
            1,
        ),

    }

@router.get("/manager-hero")
def manager_hero(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(
        ["store_manager"],
        current_user["role"],
    )

    today = ist_today()

    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.store_id == current_user["store_id"],
            DailyReport.report_date == today,
        )
        .first()
    )

    if report is None:
        report = DailyReport(
            store_id=current_user["store_id"],
            submitted_by=current_user["user_id"],
            report_date=today,
        )

        db.add(report)
        db.commit()
        db.refresh(report)

    purchases_count = (
        db.query(Purchase)
        .filter(
            Purchase.store_id == current_user["store_id"],
            func.date(
    func.timezone("Asia/Kolkata", Purchase.purchase_date)
) == report.report_date,
        )
        .count()
    )

    

    return {
        "user": {
            "full_name": current_user["full_name"],
            "role": current_user["role"],
            "store_id": current_user["store_id"],
        },
        "report": {
            "status": "Locked" if report.is_locked else "In Progress",

            "sales_completed": (
    report.total_bills > 0
    or report.cash_sales > 0
    or report.upi_sales > 0
    or report.card_sales > 0
),

"expenses_completed": (
    db.query(Expense)
    .filter(
        Expense.store_id == report.store_id,
        func.date(
            func.timezone("Asia/Kolkata", Expense.created_at)
        ) == report.report_date,
    )
    .count()
) > 0,

"purchases_completed": purchases_count > 0,

"deliveries_completed": report.deliveries > 0,

"udhaar_completed": (
    db.query(UdhaarEntry)
    .filter(
        UdhaarEntry.store_id == report.store_id,
        UdhaarEntry.daily_report_id == report.id,
        UdhaarEntry.status != "settled",
    )
    .count()
) > 0,
            

            "notes_completed": bool(report.notes),
        },
    }

@router.get("/manager-dashboard")
def manager_dashboard(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(
        ["store_manager"],
        current_user["role"],
    )

    store_id = current_user["store_id"]
    today = ist_today()

    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.store_id == store_id,
            DailyReport.report_date == today,
        )
        .first()
    )

    purchases = (
        db.query(Purchase)
        .filter(
            Purchase.store_id == store_id,
            func.date(
    func.timezone("Asia/Kolkata", Purchase.purchase_date)
) == today,
        )
        .order_by(Purchase.purchase_date.desc())
        .all()
    )

    expenses = (
    db.query(Expense)
    .filter(
        Expense.store_id == store_id,
        func.date(
    func.timezone("Asia/Kolkata", Expense.created_at)
) == today,
    )
    .order_by(Expense.created_at.desc())
    .all()
)
    
    payment_breakdown = {
        "cash": report.cash_sales if report else 0,
        "upi": report.upi_sales if report else 0,
        "card": report.card_sales if report else 0,
        "udhaar": (
    db.query(func.coalesce(func.sum(UdhaarEntry.amount), 0))
    .filter(
        UdhaarEntry.store_id == store_id,
        UdhaarEntry.daily_report_id == report.id,
        UdhaarEntry.status != "settled",
    )
    .scalar()
) if report else 0,
    }

    progress = {
        "sales_completed":
            (
                payment_breakdown["cash"]
                + payment_breakdown["upi"]
                + payment_breakdown["card"]
                + payment_breakdown["udhaar"]
            ) > 0,

        "expenses_completed": len(expenses) > 0,

        "purchases_completed": len(purchases) > 0,

        "deliveries_completed":
            report.deliveries > 0 if report else False,


        "report_submitted":
            report.is_locked if report else False,
    }

    return {

        "progress": progress,

        "payment_breakdown": payment_breakdown,

        "purchases": [
            {
                "product_name": p.product_name,
                "supplier_name": p.supplier_name,
                "quantity": p.quantity,
                "amount": p.purchase_amount,
            }
            for p in purchases
        ],

        "expenses": [
            {
                "expense_type": e.expense_type,
                "amount": e.amount,
            }
            for e in expenses
        ],

        
    }
@router.get("/delivery-performance")
def delivery_performance(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(
        ["owner", "store_manager"],
        current_user["role"],
    )

    query = db.query(DailyReport)

    if current_user["role"] == "store_manager":
        query = query.filter(
            DailyReport.store_id == current_user["store_id"]
        )
    elif store_id != "all":
        query = query.filter(
            DailyReport.store_id == int(store_id)
        )

    start_date, end_date = _get_period_bounds(period)

    if start_date:
        query = query.filter(
            DailyReport.report_date >= start_date
        )

    if end_date:
        query = query.filter(
            DailyReport.report_date <= end_date
        )

    reports = query.all()

    stores = {}

    for report in reports:
        store = db.query(Store).filter(
            Store.id == report.store_id
        ).first()

        if not store:
            continue

        if store.name not in stores:
            stores[store.name] = 0

        stores[store.name] += report.deliveries or 0

    return sorted(
        [
            {
                "store": name,
                "deliveries": deliveries,
            }
            for name, deliveries in stores.items()
        ],
        key=lambda x: x["deliveries"],
        reverse=True,
    )

@router.get("/overview")
def overview(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    require_role(
        ["owner", "store_manager"],
        current_user["role"],
    )

    if current_user["role"] == "store_manager":
        store_id = str(current_user["store_id"])

    reports = _get_reports(
    db=db,
    period=period,
    store_id=store_id,
    submitted_only=current_user["role"] == "owner",
)

    sales = sum(
    _safe_number(report.cash_sales)
    + _safe_number(report.upi_sales)
    + _safe_number(report.card_sales)
    + _safe_number(report.udhaar_sales)
    for report in reports
)
    expenses = sum(
        _safe_number(expense.amount)
        for expense in _get_expenses(db, period, store_id)
    )

    purchase_summary_data, _ = _purchase_summary_by_store(
        db,
        period,
        store_id,
    )
    purchases = sum(
        values["total_purchases"]
        for values in purchase_summary_data.values()
    )

    bills = sum(
        report.total_bills or 0
        for report in reports
    )

    deliveries = sum(
        report.deliveries or 0
        for report in reports
    )

    return {

        "sales": round(sales, 2),

        "expenses": round(expenses, 2),

        "purchases": round(purchases, 2),

        "bills": bills,

        "deliveries": deliveries,

    }

@router.get("/export/excel")
def export_excel(
    period: str = "today",
    store_id: str = "all",
    from_date: str | None = None,
    to_date: str | None = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    require_role(
        ["owner", "store_manager"],
        current_user["role"],
    )

    if current_user["role"] == "store_manager":
        store_id = str(current_user["store_id"])

    reports = _get_reports(
    db=db,
    period=period,
    store_id=store_id,
    from_date=from_date,
    to_date=to_date,
    submitted_only=current_user["role"] == "owner",
)

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Analytics"

    headers = [
        "Store",
        "Date",
        "Bills",
        "Sales",
        "Expenses",
        "Purchases",
    ]

    for column, header in enumerate(headers, start=1):
        cell = sheet.cell(row=1, column=column)
        cell.value = header
        cell.font = Font(bold=True)

    row = 2

    for report in reports:

        store = (
            db.query(Store)
            .filter(Store.id == report.store_id)
            .first()
        )

        report_purchases = [
            purchase
            for purchase in db.query(Purchase)
            .filter(Purchase.store_id == report.store_id)
            .all()
            if _local_date(purchase.purchase_date) == report.report_date
        ]
        purchases = sum(
            _safe_number(purchase.purchase_amount)
            for purchase in report_purchases
        )

        sales = (
            _safe_number(report.cash_sales)
            + _safe_number(report.upi_sales)
            + _safe_number(report.card_sales)
            + _safe_number(report.udhaar_sales)
        )

        sheet.cell(row=row, column=1).value = (
            store.name if store else ""
        )

        sheet.cell(row=row, column=2).value = str(
            report.report_date
        )

        sheet.cell(row=row, column=3).value = (
            report.total_bills
        )

        sheet.cell(row=row, column=4).value = sales

        report_expenses = [
            expense
            for expense in db.query(Expense)
            .filter(Expense.store_id == report.store_id)
            .all()
            if _local_date(expense.created_at) == report.report_date
        ]
        sheet.cell(row=row, column=5).value = sum(
            _safe_number(expense.amount)
            for expense in report_expenses
        )

        sheet.cell(row=row, column=6).value = purchases

        row += 1

    stream = BytesIO()

    workbook.save(stream)

    stream.seek(0)

    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition":
            "attachment; filename=analytics.xlsx"
        },
    )


@router.get("/export/pdf")
def export_pdf(
    period: str = "today",
    store_id: str = "all",
    from_date: str | None = None,
to_date: str | None = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    require_role(
        ["owner", "store_manager"],
        current_user["role"],
    )

    if current_user["role"] == "store_manager":
        store_id = str(current_user["store_id"])

    reports = _get_reports(
    db=db,
    period=period,
    store_id=store_id,
    from_date=from_date,
    to_date=to_date,
    submitted_only=current_user["role"] == "owner",
)
    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
    )

    table_data = [[
        "Store",
        "Date",
        "Bills",
        "Sales",
        "Expenses",
        "Purchases",
    ]]

    for report in reports:

        store = (
            db.query(Store)
            .filter(Store.id == report.store_id)
            .first()
        )

        report_purchases = [
            purchase
            for purchase in db.query(Purchase)
            .filter(Purchase.store_id == report.store_id)
            .all()
            if _local_date(purchase.purchase_date) == report.report_date
        ]
        purchases = sum(
            _safe_number(purchase.purchase_amount)
            for purchase in report_purchases
        )

        sales = (
            _safe_number(report.cash_sales)
            + _safe_number(report.upi_sales)
            + _safe_number(report.card_sales)
            + _safe_number(report.udhaar_sales)
        )

        table_data.append([
            store.name if store else "",
            str(report.report_date),
            report.total_bills,
            round(sales, 2),
            round(
                _safe_number(
                    report.total_expenses
                ),
                2,
            ),
            round(purchases, 2),
        ])

    table = Table(table_data)

    table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#2563EB"),
            ),
            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white,
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey,
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold",
            ),
            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, 0),
                10,
            ),
        ])
    )

    document.build([table])

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=analytics.pdf"
        },
    )
