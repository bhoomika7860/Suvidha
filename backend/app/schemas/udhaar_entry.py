from pydantic import BaseModel
from typing import Optional
from datetime import date


class UdhaarCreate(BaseModel):
    daily_report_id: int
    bill_number: str
    customer_name: str
    customer_phone: Optional[str] = None
    amount: float

class UdhaarEntryCreate(BaseModel):
    bill_number: str
    amount: float


class BulkUdhaarCreate(BaseModel):
    daily_report_id: int
    entries: list[UdhaarEntryCreate]

class UdhaarRepayment(BaseModel):
    amount: float


class UdhaarResponse(BaseModel):
    id: int
    store_id: int
    daily_report_id: int
    customer_name: str
    customer_phone: Optional[str]
    amount: float
    paid_amount: float
    date_given: date
    status: str
    bill_number: str

    class Config:
        from_attributes = True