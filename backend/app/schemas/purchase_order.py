from datetime import date
from pydantic import BaseModel


class PurchaseOrderItemCreate(BaseModel):
    medicine_name: str
    quantity: int


class PurchaseOrderItemResponse(
    PurchaseOrderItemCreate
):
    id: int

    class Config:
        from_attributes = True


class PurchaseOrderCreate(BaseModel):
    store_id: int
    supplier_name: str
    expected_amount: float
    expected_date: date
    created_by: int
    items: list[PurchaseOrderItemCreate] = []


class PurchaseOrderResponse(BaseModel):
    id: int
    store_id: int
    supplier_name: str
    expected_amount: float
    expected_date: date | None
    status: str
    created_by: int
    items: list[PurchaseOrderItemResponse]

    class Config:
        from_attributes = True