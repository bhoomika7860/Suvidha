from pydantic import BaseModel


class DeliveryCreate(BaseModel):
    daily_report_id: int
    customer_name: str
    status: str


class DeliveryResponse(BaseModel):
    id: int

    daily_report_id: int

    customer_name: str

    status: str

    bill_number: str | None = None

    payment: str | None = None

    payment_method: str | None = None

    notes: str | None = None

    bill_image: str | None = None

    class Config:
        from_attributes = True