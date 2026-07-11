from collections import defaultdict
from datetime import date, timedelta
from typing import Any, Dict, List, Optional, Tuple

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_role
from app.models.bounced_product import BouncedProduct
from app.models.daily_report import DailyReport
from app.models.expense import Expense
from app.models.store import Store
from app.models.udhaar_entry import UdhaarEntry

from openpyxl import Workbook
from openpyxl.styles import Font
from fastapi.responses import StreamingResponse
from io import BytesIO

from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph
from app.models.purchase import Purchase

router = APIRouter(prefix="/analytics", tags=["Analytics"])


def _safe_number(value: Any) -> float:
    return float(value or 0)


def _safe_percent(numerator: float, denominator: float) -> float:
    if not denominator:
        return 0.0
    return round((numerator / denominator) * 100, 1)


def _get_period_bounds(period: Optional[str]) -> Tuple[Optional[date], Optional[date]]:
    today = date.today()

    if period == "today":
        return today, today
    if period == "7days":
        return today - timedelta(days=6), today
    if period == "30days":
        return today - timedelta(days=29), today
    if period == "90days":
        return today - timedelta(days=89), today
    if period == "month":
        return date(today.year, today.month, 1), today
    if period == "last_month":
        if today.month == 1:
            start = date(today.year - 1, 12, 1)
            end = date(today.year, 1, 1) - timedelta(days=1)
        else:
            start = date(today.year, today.month - 1, 1)
            end = date(today.year, today.month, 1) - timedelta(days=1)
        return start, end
    if period == "year":
        return date(today.year, 1, 1), today

    return None, None


def _get_reports(db: Session, period: Optional[str] = None, store_id: Optional[str] = None) -> List[DailyReport]:
    query = db.query(DailyReport).filter(DailyReport.report_date.isnot(None))
    start_date, end_date = _get_period_bounds(period)
    if start_date:
        query = query.filter(DailyReport.report_date >= start_date)
    if end_date:
        query = query.filter(DailyReport.report_date <= end_date)
    if store_id and str(store_id).lower() != "all":
        query = query.filter(DailyReport.store_id == int(store_id))
    return query.all()


def _get_outstanding_entries(db: Session, period: Optional[str] = None, store_id: Optional[str] = None):
    query = db.query(UdhaarEntry).filter(UdhaarEntry.status != "settled")
    start_date, end_date = _get_period_bounds(period)
    if start_date:
        query = query.filter(UdhaarEntry.date_given >= start_date)
    if end_date:
        query = query.filter(UdhaarEntry.date_given <= end_date)
    if store_id and str(store_id).lower() != "all":
        query = query.filter(UdhaarEntry.store_id == int(store_id))
    return query.all()


def _monthly_series(reports: List[DailyReport]) -> List[Dict[str, Any]]:
    monthly_totals: Dict[str, Dict[str, float]] = defaultdict(lambda: {"revenue": 0.0, "bills": 0})

    for report in reports:
        if not report.report_date:
            continue
        month = report.report_date.strftime("%Y-%m")
        monthly_totals[month]["revenue"] += _safe_number(report.cash_sales + report.upi_sales + report.card_sales + report.udhaar_sales)
        monthly_totals[month]["bills"] += _safe_number(report.total_bills)

    ordered = sorted(monthly_totals.items())
    if len(ordered) > 6:
        ordered = ordered[-6:]

    return [
        {
            "date": month,
            "revenue": round(values["revenue"], 2),
            "bills": int(values["bills"]),
        }
        for month, values in ordered
    ]


def _forecast_series(reports: List[DailyReport]) -> Dict[str, Any]:
    monthly_totals = defaultdict(float)
    for report in reports:
        if not report.report_date:
            continue
        month = report.report_date.strftime("%Y-%m")
        monthly_totals[month] += _safe_number(report.cash_sales + report.upi_sales + report.card_sales + report.udhaar_sales)

    ordered_months = sorted(monthly_totals.items())
    if len(ordered_months) < 2:
        return {
            "projected_revenue": 0.0,
            "projected_bills": 0,
            "projected_expenses": 0.0,
            "series": [],
        }

    actuals = [value for _, value in ordered_months]
    growth = (actuals[-1] - actuals[0]) / actuals[0] if actuals[0] else 0.0
    projected_revenue = actuals[-1] * (1 + growth) if actuals[-1] else 0.0
    projected_bills = int(round((sum(report.total_bills for report in reports) / max(len(ordered_months), 1)) * 1.08))
    projected_expenses = sum(_safe_number(report.total_expenses) for report in reports) * 1.08

    series = []
    for month, value in ordered_months:
        series.append({"month": month, "actual": round(value, 2), "forecast": None})

    for index in range(1, 7):
        month_label = f"F{index}"
        forecast_value = projected_revenue * (1 + (growth * index / 6))
        series.append({"month": month_label, "actual": None, "forecast": round(forecast_value, 2)})

    return {
        "projected_revenue": round(projected_revenue, 2),
        "projected_bills": projected_bills,
        "projected_expenses": round(projected_expenses, 2),
        "series": series,
    }


@router.get("/dashboard-summary")
def dashboard_summary(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(["owner"], current_user["role"])

    reports = _get_reports(db, period, store_id)
    revenue = sum(_safe_number(report.cash_sales + report.upi_sales + report.card_sales + report.udhaar_sales) for report in reports)
    total_bills = sum(int(report.total_bills or 0) for report in reports)
    total_expenses = sum(_safe_number(report.total_expenses) for report in reports)
    average_bill_value = revenue / total_bills if total_bills else 0.0
    outstanding_entries = _get_outstanding_entries(db, period, store_id)
    outstanding_total = sum(max(_safe_number(entry.amount) - _safe_number(entry.paid_amount), 0.0) for entry in outstanding_entries)
    recovered_total = sum(_safe_number(entry.paid_amount) for entry in outstanding_entries)
    growth_rate = 0.0
    monthly_series = _monthly_series(reports)
    if len(monthly_series) >= 2:
        previous = monthly_series[-2]["revenue"]
        current = monthly_series[-1]["revenue"]
        growth_rate = ((current - previous) / previous * 100) if previous else 0.0

    return {
        "total_sales": round(revenue, 2),
        "total_revenue": round(revenue, 2),
        "total_purchases": sum(_safe_number(report.total_purchases) for report in reports),
        "total_bills": total_bills,
        "average_bill_value": round(average_bill_value, 2),
        "average_bill": round(average_bill_value, 2),
        "total_expenses": round(total_expenses, 2),
        "total_udhaar": round(outstanding_total, 2),
        "outstanding_udhaar": round(outstanding_total, 2),
        "growth_rate": round(growth_rate, 1),
        "submitted_reports": len(reports),
    }


@router.get("/store-summary")
def store_summary(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(["owner"], current_user["role"])

    reports = _get_reports(db, period, store_id)
    store_totals: Dict[int, Dict[str, Any]] = defaultdict(lambda: {"revenue": 0.0, "bills": 0, "expenses": 0.0, "history": []})

    for report in reports:
        store_id_value = report.store_id
        if not store_id_value:
            continue
        revenue = _safe_number(report.cash_sales + report.upi_sales + report.card_sales + report.udhaar_sales)
        store_totals[store_id_value]["revenue"] += revenue
        store_totals[store_id_value]["bills"] += int(report.total_bills or 0)
        store_totals[store_id_value]["expenses"] += _safe_number(report.total_expenses)
        store_totals[store_id_value]["history"].append(revenue)

    rows = []

    for store_id_value, values in sorted(store_totals.items()):
        store = (
            db.query(Store)
            .filter(Store.id == store_id_value)
            .first()
        )

        history = sorted(values["history"])

        growth_rate = 0.0
        if len(history) >= 2 and history[0]:
            growth_rate = (
                (history[-1] - history[0]) / history[0]
            ) * 100

        purchase_total = (
            db.query(func.sum(Purchase.purchase_amount))
            .filter(Purchase.store_id == store_id_value)
            .scalar()
            or 0
        )

        rows.append(
            {
                "store_id": store_id_value,
                "store_name": store.name if store else f"Store {store_id_value}",
                "total_sales": round(values["revenue"], 2),
                "total_purchases": round(purchase_total, 2),
                "total_bills": values["bills"],
                "total_expenses": round(values["expenses"], 2),
                "growth_rate": round(growth_rate, 1),
            }
        )



    return rows


@router.get("/outstanding-udhaar")
def outstanding_udhaar(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(["owner"], current_user["role"])

    entries = _get_outstanding_entries(db, period, store_id)
    store_map: Dict[int, Dict[str, Any]] = defaultdict(lambda: {"outstanding": 0.0, "recovered": 0.0, "pending": 0.0})

    for entry in entries:
        if not entry.store_id:
            continue
        outstanding = max(_safe_number(entry.amount) - _safe_number(entry.paid_amount), 0.0)
        store_map[entry.store_id]["outstanding"] += outstanding
        store_map[entry.store_id]["recovered"] += _safe_number(entry.paid_amount)
        store_map[entry.store_id]["pending"] += outstanding

    results = []
    for store_id, values in sorted(store_map.items()):
        store = db.query(Store).filter(Store.id == store_id).first()
        total_outstanding = values["outstanding"]
        recovered = values["recovered"]
        recovery_rate = _safe_percent(recovered, total_outstanding + recovered) if (total_outstanding + recovered) else 0.0
        results.append(
            {
                "store_name": store.name if store else f"Store {store_id}",
                "outstanding": round(total_outstanding, 2),
                "recovered": round(recovered, 2),
                "pending": round(values["pending"], 2),
                "recovery_rate": recovery_rate,
            }
        )

    return results


@router.get("/top-bounced-products")
def top_bounced_products(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(["owner"], current_user["role"])

    query = (
        db.query(BouncedProduct.product_name, func.sum(BouncedProduct.quantity).label("total_bounced"), DailyReport.store_id)
        .join(DailyReport, BouncedProduct.daily_report_id == DailyReport.id)
    )

    start_date, end_date = _get_period_bounds(period)
    if start_date:
        query = query.filter(DailyReport.report_date >= start_date)
    if end_date:
        query = query.filter(DailyReport.report_date <= end_date)
    if store_id and str(store_id).lower() != "all":
        query = query.filter(DailyReport.store_id == int(store_id))

    result = (
        query.group_by(BouncedProduct.product_name, DailyReport.store_id)
        .order_by(func.sum(BouncedProduct.quantity).desc())
        .all()
    )

    rows = []
    for row in result:
        store = db.query(Store).filter(Store.id == row.store_id).first()
        request_count = int(row.total_bounced or 0)
        if request_count >= 150:
            risk = "Critical"
        elif request_count >= 100:
            risk = "High"
        elif request_count >= 75:
            risk = "Medium"
        else:
            risk = "Low"
        rows.append(
            {
                "medicine": row.product_name,
                "requests": request_count,
                "store": store.name if store else "Multiple",
                "risk": risk,
            }
        )

    return rows


@router.get("/expense-breakdown")
def expense_breakdown(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(["owner"], current_user["role"])

    query = db.query(Expense.title, func.sum(Expense.amount).label("total_amount")).join(DailyReport, Expense.daily_report_id == DailyReport.id)
    start_date, end_date = _get_period_bounds(period)
    if start_date:
        query = query.filter(DailyReport.report_date >= start_date)
    if end_date:
        query = query.filter(DailyReport.report_date <= end_date)
    if store_id and str(store_id).lower() != "all":
        query = query.filter(DailyReport.store_id == int(store_id))

    rows = query.group_by(Expense.title).all()
    return [{"name": row.title, "amount": round(row.total_amount or 0, 2)} for row in rows]


@router.get("/overview")
def analytics_overview(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(["owner"], current_user["role"])

    reports = _get_reports(db, period, store_id)
    revenue = sum(_safe_number(report.cash_sales + report.upi_sales + report.card_sales + report.udhaar_sales) for report in reports)
    total_bills = sum(int(report.total_bills or 0) for report in reports)
    total_expenses = sum(_safe_number(report.total_expenses) for report in reports)
    average_bill_value = revenue / total_bills if total_bills else 0.0

    outstanding_entries = _get_outstanding_entries(db, period, store_id)
    outstanding_total = sum(max(_safe_number(entry.amount) - _safe_number(entry.paid_amount), 0.0) for entry in outstanding_entries)
    recovered_total = sum(_safe_number(entry.paid_amount) for entry in outstanding_entries)
    recovery_rate = _safe_percent(recovered_total, outstanding_total + recovered_total) if (outstanding_total + recovered_total) else 0.0

    monthly_series = _monthly_series(reports)
    if len(monthly_series) >= 2:
        previous = monthly_series[-2]["revenue"]
        current = monthly_series[-1]["revenue"]
        growth_rate = ((current - previous) / previous * 100) if previous else 0.0
    else:
        growth_rate = 0.0

    store_totals: Dict[int, Dict[str, Any]] = defaultdict(lambda: {"revenue": 0.0, "bills": 0, "growth": 0.0})
    store_history: Dict[int, List[float]] = defaultdict(list)
    for report in reports:
        if not report.store_id:
            continue
        revenue = _safe_number(report.cash_sales + report.upi_sales + report.card_sales + report.udhaar_sales)
        store_totals[report.store_id]["revenue"] += revenue
        store_totals[report.store_id]["bills"] += int(report.total_bills or 0)
        store_history[report.store_id].append(revenue)

    store_comparison = []
    for store_id, values in sorted(store_totals.items(), key=lambda item: item[1]["revenue"], reverse=True)[:5]:
        store = db.query(Store).filter(Store.id == store_id).first()
        history = sorted(store_history.get(store_id, []))
        growth = 0.0
        if len(history) >= 2:
            growth = ((history[-1] - history[0]) / history[0] * 100) if history[0] else 0.0
        store_totals[store_id]["growth"] = growth
        store_comparison.append(
            {
                "store_name": store.name if store else f"Store {store_id}",
                "revenue": round(values["revenue"], 2),
                "bills": values["bills"],
                "growth": round(growth, 1),
            }
        )

    payment_breakdown = [
        {"name": "Cash", "value": round(sum(_safe_number(report.cash_sales) for report in reports), 2)},
        {"name": "UPI", "value": round(sum(_safe_number(report.upi_sales) for report in reports), 2)},
        {"name": "Card", "value": round(sum(_safe_number(report.card_sales) for report in reports), 2)},
        {"name": "Udhaar", "value": round(sum(_safe_number(report.udhaar_sales) for report in reports), 2)},
    ]

    expense_distribution = [
        {"name": row.title, "amount": round(row.total_amount or 0, 2)}
        for row in db.query(Expense.title, func.sum(Expense.amount).label("total_amount")).join(DailyReport, Expense.daily_report_id == DailyReport.id).group_by(Expense.title).all()
    ]

    top_stores = [
        {
            "rank": index + 1,
            "store": row["store_name"],
            "revenue": round(row["revenue"], 2),
            "bills": row["bills"],
            "growth": round(row["growth"], 1),
        }
        for index, row in enumerate(store_comparison)
    ]

    bounced_rows = (
        db.query(
            BouncedProduct.product_name,
            func.sum(BouncedProduct.quantity).label("requests"),
            DailyReport.store_id,
        )
        .join(DailyReport, BouncedProduct.daily_report_id == DailyReport.id)
        .group_by(BouncedProduct.product_name, DailyReport.store_id)
        .order_by(func.sum(BouncedProduct.quantity).desc())
        .all()
    )

    top_bounced_medicines = []
    for row in bounced_rows[:6]:
        store = db.query(Store).filter(Store.id == row.store_id).first()
        request_count = int(row.requests or 0)
        if request_count >= 150:
            risk = "Critical"
        elif request_count >= 100:
            risk = "High"
        elif request_count >= 75:
            risk = "Medium"
        else:
            risk = "Low"
        top_bounced_medicines.append(
            {
                "medicine": row.product_name,
                "requests": request_count,
                "store": store.name if store else "Multiple",
                "risk": risk,
            }
        )

    insights = [
        {
            "text": f"Revenue reached {fmt_currency(revenue)} across {len(store_comparison)} stores with an average bill value of {fmt_currency(average_bill_value)}.",
        },
        {
            "text": f"Recovery on outstanding udhaar is {recovery_rate:.1f}% and pending balances remain concentrated in the highest-volume stores.",
        },
        {
            "text": f"{len(top_bounced_medicines)} high-priority stock-out items need attention, with the highest demand concentrated in the busiest stores.",
        },
        {
            "text": f"Operational spend totals {fmt_currency(total_expenses)} and should be checked against the recent sales trend for margin stability.",
        },
    ]

    forecast = _forecast_series(reports)

    outstanding_rows = []
    for entry in outstanding_entries:
        if not entry.store_id:
            continue
        store = db.query(Store).filter(Store.id == entry.store_id).first()
        store_name = store.name if store else f"Store {entry.store_id}"
        existing = next((row for row in outstanding_rows if row["store_name"] == store_name), None)
        if existing is None:
            outstanding_rows.append({
                "store_name": store_name,
                "outstanding": max(_safe_number(entry.amount) - _safe_number(entry.paid_amount), 0.0),
                "recovered": _safe_number(entry.paid_amount),
                "pending": max(_safe_number(entry.amount) - _safe_number(entry.paid_amount), 0.0),
            })
        else:
            existing["outstanding"] += max(_safe_number(entry.amount) - _safe_number(entry.paid_amount), 0.0)
            existing["recovered"] += _safe_number(entry.paid_amount)
            existing["pending"] += max(_safe_number(entry.amount) - _safe_number(entry.paid_amount), 0.0)

    outstanding_payload = []
    for row in outstanding_rows:
        total = row["outstanding"] + row["recovered"]
        outstanding_payload.append({
            "store_name": row["store_name"],
            "outstanding": round(row["outstanding"], 2),
            "recovered": round(row["recovered"], 2),
            "pending": round(row["pending"], 2),
            "recovery_rate": round(_safe_percent(row["recovered"], total), 1),
        })

    return {
        "kpis": {
            "total_revenue": round(revenue, 2),
            "total_sales": round(revenue, 2),
            "total_bills": total_bills,
            "average_bill_value": round(average_bill_value, 2),
            "average_bill": round(average_bill_value, 2),
            "total_expenses": round(total_expenses, 2),
            "outstanding_udhaar": round(outstanding_total, 2),
            "total_udhaar": round(outstanding_total, 2),
            "growth_rate": round(growth_rate, 1),
        },
        "store_comparison": store_comparison,
        "outstanding_udhaar": outstanding_payload,
        "payment_breakdown": payment_breakdown,
        "expense_distribution": expense_distribution,
        "sales_trend": monthly_series,
        "top_stores": top_stores,
        "top_bounced_medicines": top_bounced_medicines,
        "insights": insights,
        "forecast": forecast,
    }


def fmt_currency(value: float) -> str:
    return f"₹{value:,.0f}"

@router.get("/payment-breakdown")
def payment_breakdown(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(["owner"], current_user["role"])

    reports = _get_reports(db, period, store_id)

    return [
        {
            "name": "Cash",
            "value": sum(_safe_number(r.cash_sales) for r in reports),
        },
        {
            "name": "UPI",
            "value": sum(_safe_number(r.upi_sales) for r in reports),
        },
        {
            "name": "Card",
            "value": sum(_safe_number(r.card_sales) for r in reports),
        },
        {
            "name": "Udhaar",
            "value": sum(_safe_number(r.udhaar_sales) for r in reports),
        },
    ]


@router.get("/expense-distribution")
def expense_distribution(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(["owner"], current_user["role"])

    query = db.query(Expense.title, func.sum(Expense.amount).label("amount")).join(DailyReport, Expense.daily_report_id == DailyReport.id)
    start_date, end_date = _get_period_bounds(period)
    if start_date:
        query = query.filter(DailyReport.report_date >= start_date)
    if end_date:
        query = query.filter(DailyReport.report_date <= end_date)
    if store_id and str(store_id).lower() != "all":
        query = query.filter(DailyReport.store_id == int(store_id))

    rows = query.group_by(Expense.title).all()

    return [
        {
            "name": row.title,
            "amount": float(row.amount or 0),
        }
        for row in rows
    ]


@router.get("/sales-trend")
def sales_trend(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(["owner"], current_user["role"])

    reports = _get_reports(db, period, store_id)

    return _monthly_series(reports)


@router.get("/business-insights")
def business_insights(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    require_role(["owner"], current_user["role"])

    overview = analytics_overview(period, store_id, current_user, db)

    return overview["insights"]


@router.get("/performance")
def performance(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    require_role(["owner"], current_user["role"])

    overview = analytics_overview(period, store_id, current_user, db)

    top_store = overview["top_stores"][0] if overview["top_stores"] else None
@router.get("/export/excel")
def export_analytics_excel(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(["owner"], current_user["role"])

    overview = analytics_overview(period, store_id, current_user, db)

    workbook = Workbook()

    # ================= Dashboard Summary =================

    dashboard_sheet = workbook.active
    dashboard_sheet.title = "Dashboard Summary"

    dashboard_sheet.append(["Metric", "Value"])

    for cell in dashboard_sheet[1]:
        cell.font = Font(bold=True)

    for key, value in overview["kpis"].items():
        dashboard_sheet.append([
            key.replace("_", " ").title(),
            value
        ])

    # ================= Store Performance =================

    store_sheet = workbook.create_sheet("Store Performance")

    store_sheet.append([
        "Store",
        "Revenue",
        "Bills",
        "Growth (%)"
    ])

    for cell in store_sheet[1]:
        cell.font = Font(bold=True)

    for store in overview["store_comparison"]:
        store_sheet.append([
            store["store_name"],
            store["revenue"],
            store["bills"],
            store["growth"]
        ])

    # ================= Payment Breakdown =================

    payment_sheet = workbook.create_sheet("Payment Breakdown")

    payment_sheet.append([
        "Payment Method",
        "Amount"
    ])

    for cell in payment_sheet[1]:
        cell.font = Font(bold=True)

    for payment in overview["payment_breakdown"]:
        payment_sheet.append([
            payment["method"],
            payment["amount"]
        ])

    # ================= Expense Distribution =================

    expense_sheet = workbook.create_sheet("Expense Distribution")

    expense_sheet.append([
        "Category",
        "Amount"
    ])

    for cell in expense_sheet[1]:
        cell.font = Font(bold=True)

    for expense in overview["expense_distribution"]:
        expense_sheet.append([
            expense["category"],
            expense["amount"]
        ])

    # ================= Sales Trend =================

    trend_sheet = workbook.create_sheet("Sales Trend")

    trend_sheet.append([
        "Date",
        "Sales"
    ])

    for cell in trend_sheet[1]:
        cell.font = Font(bold=True)

    for item in overview["sales_trend"]:
        trend_sheet.append([
            item["date"],
            item["sales"]
        ])

    # ================= Outstanding Udhaar =================

    udhaar_sheet = workbook.create_sheet("Outstanding Udhaar")

    udhaar_sheet.append([
        "Customer",
        "Store",
        "Amount"
    ])

    for cell in udhaar_sheet[1]:
        cell.font = Font(bold=True)

    for item in overview["outstanding_udhaar"]:
        udhaar_sheet.append([
            item["customer_name"],
            item["store_name"],
            item["amount"]
        ])

    # ================= Top Bounced Products =================

    bounced_sheet = workbook.create_sheet("Top Bounced Products")

    bounced_sheet.append([
        "Medicine",
        "Times Bounced"
    ])

    for cell in bounced_sheet[1]:
        cell.font = Font(bold=True)

    for item in overview["top_bounced_products"]:
        bounced_sheet.append([
            item["product_name"],
            item["count"]
        ])

    # ================= Business Insights =================

    insight_sheet = workbook.create_sheet("Business Insights")

    insight_sheet.append(["Insight"])

    insight_sheet["A1"].font = Font(bold=True)

    for insight in overview["business_insights"]:
        insight_sheet.append([insight])

    # ================= Return Workbook =================

    output = BytesIO()

    workbook.save(output)

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition":
            'attachment; filename="PharmaCore360_Analytics.xlsx"'
        },
    )


    for column, header in enumerate(headers, start=1):
        cell = store_sheet.cell(row=1, column=column)
        cell.value = header
        cell.font = Font(bold=True)

    row = 2
    



@router.get("/export/pdf")
def export_analytics_pdf(
    period: str = "today",
    store_id: str = "all",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_role(["owner"], current_user["role"])

    overview = analytics_overview(period, store_id, current_user, db)

    buffer = BytesIO()

    doc = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()

    elements = []

    elements.append(
        Paragraph("<b>PharmaCore360 Analytics Report</b>", styles["Heading1"])
    )

    data = [["Metric", "Value"]]

    for key, value in overview["kpis"].items():
        data.append([
            key.replace("_", " ").title(),
            str(value)
        ])

    table = Table(data)

    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#2563EB")),
            ("TEXTCOLOR", (0,0), (-1,0), colors.white),
            ("GRID",(0,0),(-1,-1),1,colors.grey),
            ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
            ("BOTTOMPADDING",(0,0),(-1,0),10),
        ])
    )

    elements.append(table)

    doc.build(elements)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            'attachment; filename="PharmaCore360_Analytics.pdf"'
        },
    )

    return [
        {
            "title": "Most Profitable Store",
            "value": top_store["store"] if top_store else "-",
        },
        {
            "title": "Highest Revenue",
            "value": f'₹{top_store["revenue"]:,.0f}' if top_store else "₹0",
        },
        {
            "title": "Highest Growth",
            "value": f'{top_store["growth"]:.1f}%' if top_store else "0%",
        },
        {
            "title": "Outstanding Credit",
            "value": f'₹{overview["kpis"]["outstanding_udhaar"]:,.0f}',
        },
    ]