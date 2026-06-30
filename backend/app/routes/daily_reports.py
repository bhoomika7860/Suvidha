from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.daily_report import DailyReport
from app.schemas.daily_report import DailyReportCreate
from app.dependencies.auth import get_current_user
from app.utils.audit import create_audit_log

router = APIRouter(
    prefix="/daily-reports",
    tags=["Daily Reports"]
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
        total_expenses=data.total_expenses
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "message": "Daily report submitted",
        "report_id": report.id
    }


# Lock report
@router.put("/{report_id}/lock")
def lock_daily_report(
    report_id: int,
    current_user: dict = Depends(get_current_user),
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

    report.is_locked = True
    db.commit()

    create_audit_log(
        db=db,
        user_id=current_user["user_id"],
        action="LOCK",
        table_name="daily_reports",
        record_id=report.id,
        description="Locked daily report"
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
    report.total_expenses = data.total_expenses

    db.commit()
    db.refresh(report)

    return report


# Get all reports
@router.get("/")
def get_all_reports(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] == "owner":
        return db.query(DailyReport).all()

    return db.query(DailyReport).filter(
        DailyReport.store_id == current_user["store_id"]
    ).all()

# Get reports by store
@router.get("/{store_id}")
def get_store_reports(
    store_id: int,
    db: Session = Depends(get_db)
):
    reports = db.query(DailyReport).filter(
        DailyReport.store_id == store_id
    ).all()

    return reports