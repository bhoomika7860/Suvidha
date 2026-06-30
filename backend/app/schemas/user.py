from pydantic import BaseModel


class UserCreate(BaseModel):
    full_name: str
    username: str
    password: str
    role: str
    store_id: int


class UserUpdate(BaseModel):
    full_name: str
    username: str
    role: str
    store_id: int
    is_active: bool