from fastapi import APIRouter, Depends
from app.database import SessionLocal
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate
from app.models.daily_report import DailyReport
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("/")
def create_expense(data: ExpenseCreate):
    db = SessionLocal()

    expense = Expense(
        daily_report_id=data.daily_report_id,
        title=data.title,
        amount=data.amount
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)
    db.close()

    return expense


@router.get("/")
def get_all_expenses(
    current_user: dict = Depends(get_current_user)
):
    db = SessionLocal()

    if current_user["role"] == "owner":
        expenses = db.query(Expense).all()
        db.close()
        return expenses

    expenses = db.query(Expense).join(
        DailyReport,
        Expense.daily_report_id == DailyReport.id
    ).filter(
        DailyReport.store_id == current_user["store_id"]
    ).all()

    db.close()
    return expenses


@router.get("/{expense_id}")
def get_expense(expense_id: int):
    db = SessionLocal()

    expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    db.close()

    if not expense:
        return {"message": "Expense not found"}

    return expense


@router.delete("/{expense_id}")
def delete_expense(expense_id: int):
    db = SessionLocal()

    expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    if not expense:
        db.close()
        return {"message": "Expense not found"}

    db.delete(expense)
    db.commit()
    db.close()

    return {"message": "Expense deleted"}