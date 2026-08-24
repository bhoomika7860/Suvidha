from datetime import datetime

from pydantic import BaseModel


class PurchaseBase(BaseModel):
    store_id: int
    daily_report_id: int

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
    grn_number: str | None = None

    status: str = "received"

    purchase_order_id: int | None = None

    purchase_date: datetime | None = None


class PurchaseCreate(
    PurchaseBase
):
    pass


class PurchaseUpdate(BaseModel):
    """
    Used for both workflow updates and
    purchase information edits.

    Every field is optional so the frontend
    can update only the fields that changed.
    """

    status: str | None = None

    product_name: str | None = None
    quantity: int | None = None
    supplier_name: str | None = None
    purchase_amount: float | None = None
    bill_number: str | None = None
    purchase_date: datetime | None = None

    checked_by: str | None = None
    entered_by: str | None = None
    grn_number: str | None = None


class PurchaseResponse(
    PurchaseBase
):
    id: int

    purchase_date: datetime
    received_date: datetime

    class Config:
        from_attributes = True


class OwnerPurchaseResponse(
    BaseModel
):
    id: int

    purchase_date: datetime
    received_date: datetime

    store_id: int
    store_name: str

    product_name: str
    quantity: int

    supplier_name: str | None = None
    purchase_amount: float

    bill_number: str
    status: str

    received_by: str | None = None
    checked_by: str | None = None
    entered_by: str | None = None

    purchase_order_id: int | None = None
    bill_image: str | None = None

    class Config:
        from_attributes = True


class PurchaseSummary(BaseModel):
    total_purchase_value: float
    bills_received: int
    completed: int


class PaginatedOwnerPurchaseResponse(
    BaseModel
):
    items: list[OwnerPurchaseResponse]

    summary: PurchaseSummary

    total: int
    page: int
    page_size: int