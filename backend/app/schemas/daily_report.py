from pydantic import BaseModel


class DailyReportCreate(BaseModel):
    store_id: int
    total_bills: int
    deliveries: int
    cash_sales: float
    upi_sales: float
    card_sales: float
    udhaar_sales: float
    system_sales: float = 0
    total_expenses: float
    total_purchases: float = 0

from pydantic import Field

class SalesUpdate(BaseModel):
    total_bills: int
    cash_sales: float
    upi_sales: float
    card_sales: float
    udhaar_sales: float = Field(default=0)
    system_sales: float = Field(default=0)

class DeliveryUpdate(BaseModel):
    deliveries: int