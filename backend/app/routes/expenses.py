from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, Query
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
    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id == data.daily_report_id
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Daily report not found",
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
            detail="Report is locked",
        )

    expense = Expense(
        store_id=report.store_id,
        daily_report_id=report.id,
        expense_type=data.expense_type,
        amount=data.amount,
        remarks=data.remarks,
        created_by=current_user["user_id"],
    )

    db.add(expense)
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
    current_user=Depends(get_current_user),
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

    if (
        current_user["role"] != "owner"
        and expense.store_id != current_user["store_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id == expense.daily_report_id
        )
        .first()
    )

    if report and report.is_locked:
        raise HTTPException(
            status_code=409,
            detail="Report is locked",
        )

    expense.expense_type = data.expense_type
    expense.amount = data.amount
    expense.remarks = data.remarks

    db.commit()
    db.refresh(expense)

    return expense


# ----------------------------------------------------
# Get Expenses For Report
# ----------------------------------------------------

@router.get("/")
def get_expenses(
    report_id: int = Query(...),
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
        .filter(
            Expense.daily_report_id == report_id
        )
    )

    if current_user["role"] != "owner":
        query = query.filter(
            Expense.store_id == current_user["store_id"]
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
    current_user=Depends(get_current_user),
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

    if (
        current_user["role"] != "owner"
        and expense.store_id != current_user["store_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    return expense


# ----------------------------------------------------
# Delete Expense
# ----------------------------------------------------

@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    current_user=Depends(get_current_user),
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

    if (
        current_user["role"] != "owner"
        and expense.store_id != current_user["store_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id == expense.daily_report_id
        )
        .first()
    )

    if report and report.is_locked:
        raise HTTPException(
            status_code=409,
            detail="Report is locked",
        )

    db.delete(expense)
    db.commit()

    return {
        "message": "Expense deleted"
    }