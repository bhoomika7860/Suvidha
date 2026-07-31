from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import datetime
from zoneinfo import ZoneInfo
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.daily_report import DailyReport
from app.models.expense import Expense
from app.models.user import User
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseResponse,
)

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"],
)

def ist_today():
    return datetime.now(ZoneInfo("Asia/Kolkata")).date()

# -----------------------------
# Create Expense
# -----------------------------
@router.post("/", response_model=ExpenseResponse)
def create_expense(
    data: ExpenseCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    expense = Expense(
    store_id=current_user["store_id"],
    expense_type=data.expense_type,
    amount=data.amount,
    remarks=data.remarks,
    created_by=current_user["user_id"],
)

    db.add(expense)
    db.commit()
    db.refresh(expense)

    print("Expense created:")
    print("ID:", expense.id)
    print("Store:", expense.store_id)
    print("Created At:", expense.created_at)

    # Update today's daily report total
    today = datetime.now(ZoneInfo("Asia/Kolkata")).date()
    print("Expense Store:", expense.store_id)
    print("Looking for report date:", today)
    report = (
    db.query(DailyReport)
    .filter(
        DailyReport.store_id == expense.store_id,
        DailyReport.report_date == today,
    )
    .first()
)
    print("Found report:", report)
    if report:
            report.total_expenses += expense.amount
            db.commit()
            db.refresh(report)
    else:
        print("Daily report not found for", today)

    

    return expense


# -----------------------------
# Get Today's Expenses
# -----------------------------
@router.get("/")
def get_expenses(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        db.query(
            Expense,
            User.full_name.label("created_by_name"),
        )
        .join(
            User,
            Expense.created_by == User.id,
        )
    )

    if current_user["role"] != "owner":
        query = query.filter(
            Expense.store_id == current_user["store_id"]
        )

    query = query.filter(
    func.date(
    func.timezone("Asia/Kolkata", Expense.created_at)
) == ist_today()
)

    expenses = (
        query.order_by(
            Expense.created_at.desc()
        )
        .all()
    )

    print("Expenses returned:", len(expenses))

    return [
        {
            "id": expense.id,
            "store_id": expense.store_id,
            "expense_type": expense.expense_type,
            "amount": expense.amount,
            "remarks": expense.remarks,
            "created_by": expense.created_by,
            "created_by_name": created_by_name,
            "created_at": expense.created_at,
        }
        for expense, created_by_name in expenses
    ]


# -----------------------------
# Get Single Expense
# -----------------------------
@router.get(
    "/{expense_id}",
    response_model=ExpenseResponse,
)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
):
    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id
        )
        .first()
    )

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    return expense


# -----------------------------
# Delete Expense
# -----------------------------
@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
):
    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id
        )
        .first()
    )

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    db.delete(expense)
    db.commit()

    return {
        "message": "Expense deleted"
    }