from datetime import datetime

from pydantic import BaseModel


class SupplierCreate(BaseModel):
    name: str


class SupplierUpdate(BaseModel):
    name: str | None = None
    is_active: bool | None = None


class SupplierResponse(BaseModel):
    id: int
    name: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True