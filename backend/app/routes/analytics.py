from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.daily_report import DailyReport
from app.models.udhaar_entry import UdhaarEntry
from app.models.bounced_product import BouncedProduct
from app.models.expense import Expense
from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_role

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# 1. Daily Summary
@router.get("/daily-summary")
def daily_summary(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    require_role(["owner"], current_user["role"])

    reports = db.query(DailyReport).all()

    total_sales = sum(
        r.cash_sales + r.upi_sales + r.card_sales
        for r in reports
    )

    total_bills = sum(r.total_bills for r in reports)
    total_expenses = sum(r.total_expenses for r in reports)
    total_deliveries = sum(r.deliveries for r in reports)
    total_udhaar = sum(r.udhaar_sales for r in reports)

    return {
        "total_sales": total_sales,
        "total_bills": total_bills,
        "total_expenses": total_expenses,
        "total_deliveries": total_deliveries,
        "total_udhaar": total_udhaar
    }


# 2. Store-wise Summary
@router.get("/store-summary")
def store_summary(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    require_role(["owner"], current_user["role"])

    summary = db.query(
        DailyReport.store_id,
        func.sum(
            DailyReport.cash_sales +
            DailyReport.upi_sales +
            DailyReport.card_sales
        ).label("total_sales")
    ).group_by(
        DailyReport.store_id
    ).all()

    return [
        {
            "store_id": row.store_id,
            "total_sales": row.total_sales
        }
        for row in summary
    ]


# 3. Outstanding Udhaar
@router.get("/outstanding-udhaar")
def outstanding_udhaar(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    require_role(["owner"], current_user["role"])

    return db.query(UdhaarEntry).filter(
        UdhaarEntry.status != "settled"
    ).all()


# 4. Top Bounced Products
@router.get("/top-bounced-products")
def top_bounced_products(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    require_role(["owner"], current_user["role"])

    result = db.query(
        BouncedProduct.product_name,
        func.sum(BouncedProduct.quantity).label("total_bounced")
    ).group_by(
        BouncedProduct.product_name
    ).order_by(
        func.sum(BouncedProduct.quantity).desc()
    ).all()

    return [
        {
            "product_name": row.product_name,
            "total_bounced": row.total_bounced
        }
        for row in result
    ]


# 5. Expense Breakdown
@router.get("/expense-breakdown")
def expense_breakdown(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    require_role(["owner"], current_user["role"])

    result = db.query(
        DailyReport.store_id,
        func.sum(Expense.amount).label("total_expense")
    ).join(
        DailyReport,
        Expense.daily_report_id == DailyReport.id
    ).group_by(
        DailyReport.store_id
    ).all()

    return [
        {
            "store_id": row.store_id,
            "total_expense": row.total_expense
        }
        for row in result
    ]