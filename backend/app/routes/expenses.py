from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

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
    return datetime.now(
        ZoneInfo("Asia/Kolkata")
    ).date()


# ----------------------------------------------------
# Create Expense
# ----------------------------------------------------

@router.post("/", response_model=ExpenseResponse)
def create_expense(
    data: ExpenseCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    today = ist_today()

    report = (
    db.query(DailyReport)
    .filter(
        DailyReport.store_id == current_user["store_id"],
        DailyReport.report_date == today,
    )
    .first()
)

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Daily report not found",
        )

    expense = Expense(
        store_id=current_user["store_id"],
        daily_report_id=report.id,
        expense_type=data.expense_type,
        amount=data.amount,
        remarks=data.remarks,
        created_by=current_user["user_id"],
    )

    db.add(expense)

    report.total_expenses += expense.amount

    db.commit()

    db.refresh(expense)

    return expense


# ----------------------------------------------------
# Update Expense
# ----------------------------------------------------

@router.put("/{expense_id}")
def update_expense(
    expense_id: int,
    data: ExpenseCreate,
    db: Session = Depends(get_db),
):
    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id
        )
        .first()
    )

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    difference = data.amount - expense.amount

    expense.expense_type = data.expense_type
    expense.amount = data.amount
    expense.remarks = data.remarks

    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id == expense.daily_report_id
        )
        .first()
    )

    if report:
        report.total_expenses += difference

    db.commit()

    db.refresh(expense)

    return expense


# ----------------------------------------------------
# Get Today's Expenses
# ----------------------------------------------------

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
            func.timezone(
                "Asia/Kolkata",
                Expense.created_at,
            )
        )
        == ist_today()
    )

    expenses = (
        query.order_by(
            Expense.created_at.desc()
        )
        .all()
    )

    return [
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


# ----------------------------------------------------
# Get Single Expense
# ----------------------------------------------------

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

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    return expense


# ----------------------------------------------------
# Delete Expense
# ----------------------------------------------------

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

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id == expense.daily_report_id
        )
        .first()
    )

    if report:
        report.total_expenses -= expense.amount

        if report.total_expenses < 0:
            report.total_expenses = 0

    db.delete(expense)

    db.commit()

    return {
        "message": "Expense deleted"
    }