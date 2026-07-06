from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.daily_report import DailyReport
from app.schemas.daily_report import DailyReportCreate
from app.dependencies.auth import get_current_user
from app.utils.audit import create_audit_log
from sqlalchemy.orm import joinedload

from app.models.expense import Expense
from app.models.bounced_product import BouncedProduct
from app.models.adjustment_request import AdjustmentRequest
from sqlalchemy.orm import joinedload


from app.models.user import User

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
        total_expenses=data.total_expenses,
        total_purchases=data.total_purchases
        
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
from sqlalchemy import func
from datetime import date

from sqlalchemy.orm import joinedload

@router.get("/")
def get_all_reports(db: Session = Depends(get_db)):
    today = date.today()

    reports = (
        db.query(DailyReport)
        .options(joinedload(DailyReport.store))
        .filter(func.date(DailyReport.report_date) == today)
        .all()
    )

    return [
        {
            "id": report.id,
            "store_id": report.store_id,
            "store_name": report.store.name,      # <-- this is the important part
            "report_date": report.report_date,

            "total_bills": report.total_bills,
            "deliveries": report.deliveries,

            "cash_sales": report.cash_sales,
            "upi_sales": report.upi_sales,
            "card_sales": report.card_sales,
            "udhaar_sales": report.udhaar_sales,

            "total_expenses": report.total_expenses,
            "total_purchases": report.total_purchases,

            "is_locked": report.is_locked,
        }
        for report in reports
    ]
# Get reports by store
@router.get("/store/{store_id}")
def get_store_reports(
    store_id: int,
    db: Session = Depends(get_db)
):
    reports = db.query(DailyReport).filter(
        DailyReport.store_id == store_id
    ).all()

    return reports

@router.get("/{report_id}")
def get_report(
    report_id: int,
    db: Session = Depends(get_db)
):

    report = (
        db.query(DailyReport)
        .options(
            joinedload(DailyReport.store),
            joinedload(DailyReport.submitted_by_user),
            joinedload(DailyReport.expenses),
            joinedload(DailyReport.bounced_products),
            joinedload(DailyReport.adjustment_requests)
        )
        .filter(DailyReport.id == report_id)
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
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
                report.cash_sales
                + report.upi_sales
                + report.card_sales
                + report.udhaar_sales
            ),
            "bills": report.total_bills,
            "deliveries": report.deliveries,
            "purchases": report.total_purchases,
            "expenses": report.total_expenses,
        },

        "payments": {
            "cash": report.cash_sales,
            "upi": report.upi_sales,
            "card": report.card_sales,
            "udhaar": report.udhaar_sales,
        },

        "expenses": [
            {
                "id": expense.id,
                "title": expense.title,
                "amount": expense.amount,
            }
            for expense in report.expenses
        ],

        "bounced_products": [
            {
                "id": product.id,
                "product_name": product.product_name,
                "quantity": product.quantity,
            }
            for product in report.bounced_products
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

    