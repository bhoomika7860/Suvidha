from pydantic import BaseModel


class DeliveryCreate(BaseModel):
    daily_report_id: int
    customer_name: str
    status: str