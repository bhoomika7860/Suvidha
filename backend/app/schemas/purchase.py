from pydantic import BaseModel
from datetime import datetime


class PurchaseBase(BaseModel):
    store_id: int
    product_name: str
    quantity: int

    supplier_name: str | None = None

    purchase_amount: float

    created_by: int

    bill_number: str

    bill_image: str | None = None

    received_by: str | None = None
    checked_by: str | None = None
    entered_by: str | None = None

    status: str = "received"

    purchase_order_id: int | None = None


class PurchaseCreate(PurchaseBase):
    pass


class PurchaseUpdate(BaseModel):
    status: str

    checked_by: str | None = None

    entered_by: str | None = None


class PurchaseResponse(PurchaseBase):
    id: int

    purchase_date: datetime

    class Config:
        from_attributes = True