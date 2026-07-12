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


def _forecast(reports):

    history = _monthly_series(reports)

    if not history:
        return {
            "projected_revenue": 0,
            "projected_bills": 0,
            "projected_expenses": 0,
            "series": [],
        }

    avg_revenue = (
        sum(i["revenue"] for i in history)
        / len(history)
    )

    growth = 8

    projected_revenue = avg_revenue * (
        1 + growth / 100
    )

    projected_bills = int(projected_revenue / 600)

    projected_expenses = projected_revenue * 0.11

    series = history.copy()

    for i in range(1, 7):

        series.append(
            {
                "month": f"F{i}",
                "actual": None,
                "forecast": round(
                    projected_revenue
                    * (1 + (growth * i / 100)),
                    2,
                ),
            }
        )

    return {
        "projected_revenue": round(
            projected_revenue,
            2,
        ),
        "projected_bills": projected_bills,
        "projected_expenses": round(
            projected_expenses,
            2,
        ),
        "series": series,
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
        db,
        period,
        store_id,
    )

    store_totals = defaultdict(
        lambda: {
            "revenue": 0,
            "bills": 0,
            "expenses": 0,
            "history": [],
        }
    )

    for report in reports:

        revenue = (
            _safe_number(report.cash_sales)
            + _safe_number(report.upi_sales)
            + _safe_number(report.card_sales)
            + _safe_number(report.udhaar_sales)
        )

        store_totals[report.store_id]["revenue"] += revenue
        store_totals[report.store_id]["bills"] += report.total_bills or 0
        store_totals[report.store_id]["expenses"] += (
            report.total_expenses or 0
        )

        store_totals[report.store_id]["history"].append(
            revenue
        )

    rows = []

    for sid, values in store_totals.items():

        store = (
            db.query(Store)
            .filter(Store.id == sid)
            .first()
        )

        purchase_total = (
            db.query(
                func.sum(Purchase.purchase_amount)
            )
            .filter(Purchase.store_id == sid)
            .scalar()
            or 0
        )

        growth = 0

        history = values["history"]

        if len(history) >= 2 and history[0]:

            growth = (
                (history[-1] - history[0])
                / history[0]
            ) * 100

        rows.append(
            {
                "store_id": sid,
                "store_name": (
                    store.name
                    if store
                    else f"Store {sid}"
                ),
                "total_sales": round(
                    values["revenue"],
                    2,
                ),
                "total_purchases": round(
                    purchase_total,
                    2,
                ),
                "total_bills": values["bills"],
                "total_expenses": round(
                    values["expenses"],
                    2,
                ),
                "growth_rate": round(
                    growth,
                    1,
                ),
            }
        )

    return rows

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
        db,
        period,
        store_id,
    )

    return {
        "cash": round(
            sum(
                _safe_number(r.cash_sales)
                for r in reports
            ),
            2,
        ),
        "upi": round(
            sum(
                _safe_number(r.upi_sales)
                for r in reports
            ),
            2,
        ),
        "card": round(
            sum(
                _safe_number(r.card_sales)
                for r in reports
            ),
            2,
        ),
        "udhaar": round(
            sum(
                _safe_number(r.udhaar_sales)
                for r in reports
            ),
            2,
        ),
    }


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

    reports = _get_reports(
        db,
        period,
        store_id,
    )

    return [
        {
            "name": "Expenses",
            "value": round(
                sum(
                    _safe_number(
                        r.total_expenses
                    )
                    for r in reports
                ),
                2,
            ),
        },
        {
            "name": "Purchases",
            "value": round(
                sum(
                    _safe_number(
                        r.total_purchases
                    )
                    for r in reports
                ),
                2,
            ),
        },
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
        db,
        period,
        store_id,
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

    if current_user["role"] == "store_manager":
        store_id = str(current_user["store_id"])

    entries = _get_outstanding_entries(
        db,
        period,
        store_id,
    )

    total = sum(
        max(
            _safe_number(i.amount)
            - _safe_number(i.paid_amount),
            0,
        )
        for i in entries
    )

    return {
        "outstanding": round(
            total,
            2,
        ),
        "count": len(entries),
    }



@router.get("/top-bounced-products")
def top_bounced_products(
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

    query = db.query(BouncedProduct)

    if store_id != "all":
        query = query.filter(
            BouncedProduct.store_id == int(store_id)
        )

    products = query.all()

    counts = defaultdict(int)

    for product in products:
        counts[product.product_name] += 1

    result = []

    for name, count in sorted(
        counts.items(),
        key=lambda x: x[1],
        reverse=True,
    )[:10]:

        result.append(
            {
                "product": name,
                "count": count,
            }
        )

    return result


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
        db,
        period,
        store_id,
    )

    revenue = sum(
        _safe_number(r.cash_sales)
        + _safe_number(r.upi_sales)
        + _safe_number(r.card_sales)
        + _safe_number(r.udhaar_sales)
        for r in reports
    )

    purchases = sum(
        _safe_number(r.total_purchases)
        for r in reports
    )

    expenses = sum(
        _safe_number(r.total_expenses)
        for r in reports
    )

    return {
        "sales": revenue,
        "expenses": expenses,
        "purchases": purchases,
        "net": revenue - expenses - purchases,
    }

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
        db,
        period,
        store_id,
    )

    return {
        "reports": len(reports),
        "forecast": _forecast(reports),
        "sales_trend": _monthly_series(reports),
    }


@router.get("/export/excel")
def export_excel(
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
        db,
        period,
        store_id,
    )

    wb = Workbook()

    ws = wb.active
    ws.title = "Analytics"

    ws.append(
        [
            "Store",
            "Date",
            "Sales",
            "Purchases",
            "Expenses",
            "Bills",
        ]
    )

    for report in reports:

        store = (
            db.query(Store)
            .filter(Store.id == report.store_id)
            .first()
        )

        ws.append(
            [
                store.name if store else "",
                str(report.report_date),
                report.cash_sales
                + report.upi_sales
                + report.card_sales
                + report.udhaar_sales,
                report.total_purchases,
                report.total_expenses,
                report.total_bills,
            ]
        )

    stream = BytesIO()

    wb.save(stream)

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
        db,
        period,
        store_id,
    )

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
    )

    table_data = [
        [
            "Store",
            "Date",
            "Sales",
            "Purchases",
            "Expenses",
            "Bills",
        ]
    ]

    for report in reports:

        store = (
            db.query(Store)
            .filter(Store.id == report.store_id)
            .first()
        )

        table_data.append(
            [
                store.name if store else "",
                str(report.report_date),
                report.cash_sales
                + report.upi_sales
                + report.card_sales
                + report.udhaar_sales,
                report.total_purchases,
                report.total_expenses,
                report.total_bills,
            ]
        )

    table = Table(table_data)

    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
            ]
        )
    )

    doc.build([table])

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=analytics.pdf"
        },
    )
