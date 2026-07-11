from pydantic import BaseModel
from typing import Literal

class UserCreate(BaseModel):
    full_name: str
    username: str
    password: str
    role: Literal["owner", "store_manager", "staff", "delivery"]
    store_id: int


class UserUpdate(BaseModel):
    full_name: str
    username: str
    role: Literal["owner", "store_manager", "staff", "delivery"]
    store_id: int
    is_active: bool