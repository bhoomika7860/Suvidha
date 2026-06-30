from pydantic import BaseModel


class ExpenseCreate(BaseModel):
    daily_report_id: int
    title: str
    amount: float 