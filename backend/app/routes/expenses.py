from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.user import User
from app.database import get_db
from app.models.expense import Expense
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseResponse,
)
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"],
)


# -----------------------------
# Create Expense
# -----------------------------
@router.post("/", response_model=ExpenseResponse)
def create_expense(
    data: ExpenseCreate,
    db: Session = Depends(get_db),
):
    print(data.model_dump())

    expense = Expense(
        store_id=data.store_id,
        expense_type=data.expense_type,
        amount=data.amount,
        remarks=data.remarks,
        created_by=data.created_by,
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)

    return expense
# -----------------------------
# Get All Expenses
# -----------------------------
@router.get("/")
def get_all_expenses(
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
            Expense.store_id ==
            current_user["store_id"]
        )

    expenses = query.all()

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