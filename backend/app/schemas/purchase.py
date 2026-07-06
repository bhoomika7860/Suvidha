from pydantic import BaseModel
from datetime import datetime


class PurchaseBase(BaseModel):
    store_id: int
    product_name: str
    quantity: int
    supplier_name: str | None = None
    purchase_amount: float
    created_by: int


class PurchaseCreate(PurchaseBase):
    pass


class PurchaseResponse(PurchaseBase):
    id: int
    purchase_date: datetime

    class Config:
        from_attributes = True