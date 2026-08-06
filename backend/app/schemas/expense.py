from pydantic import BaseModel
from datetime import datetime


class ExpenseCreate(BaseModel):
    daily_report_id: int
    expense_type: str
    amount: float
    remarks: str | None = None


class ExpenseResponse(BaseModel):
    id: int
    store_id: int
    daily_report_id: int
    expense_type: str
    amount: float
    remarks: str | None
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True