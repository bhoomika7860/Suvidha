from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import extract

from app.database import get_db
from app.models.daily_report import DailyReport
from app.services.export_service import (
    generate_excel_report,
    generate_pdf_report,
)

router = APIRouter(
    prefix="/export",
    tags=["Export"],
)


def apply_filters(
    query,
    period,
    store_id,
    from_date,
    to_date,
):
    today = date.today()

    # ---------- Store ----------
    if store_id != "all":
        query = query.filter(
            DailyReport.store_id == int(store_id)
        )

    # ---------- Period ----------
    if period == "today":
        query = query.filter(
            DailyReport.report_date == today
        )

    elif period == "last7":
        query = query.filter(
            DailyReport.report_date >= today - timedelta(days=6)
        )

    elif period == "last30":
        query = query.filter(
            DailyReport.report_date >= today - timedelta(days=29)
        )

    elif period == "thisMonth":
        query = query.filter(
            extract("month", DailyReport.report_date) == today.month,
            extract("year", DailyReport.report_date) == today.year,
        )

    elif period == "thisYear":
        query = query.filter(
            extract("year", DailyReport.report_date) == today.year,
        )

    elif period == "custom":

        if from_date:
            query = query.filter(
                DailyReport.report_date >= datetime.strptime(
                    from_date,
                    "%Y-%m-%d",
                ).date()
            )

        if to_date:
            query = query.filter(
                DailyReport.report_date <= datetime.strptime(
                    to_date,
                    "%Y-%m-%d",
                ).date()
            )

    return query


@router.get("/daily-reports/excel")
def export_excel(
    period: str = "today",
    store_id: str = "all",
    from_date: str | None = None,
    to_date: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(DailyReport)

    query = apply_filters(
        query,
        period,
        store_id,
        from_date,
        to_date,
    )

    reports = query.all()

    file = generate_excel_report(reports)

    return StreamingResponse(
        file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition":
            "attachment; filename=daily_reports.xlsx"
        },
    )


@router.get("/daily-reports/pdf")
def export_pdf(
    period: str = "today",
    store_id: str = "all",
    from_date: str | None = None,
    to_date: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(DailyReport)

    query = apply_filters(
        query,
        period,
        store_id,
        from_date,
        to_date,
    )

    reports = query.all()

    file = generate_pdf_report(reports)

    return StreamingResponse(
        file,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=daily_reports.pdf"
        },
    )