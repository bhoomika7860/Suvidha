from pydantic import BaseModel

class StoreCreate(BaseModel):
    name: str
    code: str
    address: str
    manager_name: str


class StoreUpdate(BaseModel):
    name: str
    code: str
    address: str
    manager_name: str
    is_active: bool