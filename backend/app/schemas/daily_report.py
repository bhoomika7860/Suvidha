from pydantic import BaseModel


class DailyReportCreate(BaseModel):
    store_id: int
    total_bills: int
    deliveries: int
    cash_sales: float
    upi_sales: float
    card_sales: float
    udhaar_sales: float
    total_expenses: float
    total_purchases: float = 0