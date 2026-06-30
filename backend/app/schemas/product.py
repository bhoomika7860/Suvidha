from pydantic import BaseModel
from typing import Optional


class ProductCreate(BaseModel):
    name: str
    category: Optional[str] = None
    brand: Optional[str] = None


class ProductUpdate(BaseModel):
    name: str
    category: Optional[str] = None
    brand: Optional[str] = None
    is_active: bool


class ProductResponse(BaseModel):
    id: int
    name: str
    category: Optional[str]
    brand: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True