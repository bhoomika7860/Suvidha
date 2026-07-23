from pydantic import BaseModel

class StoreCreate(BaseModel):
    name: str
    code: str
    address: str
    manager_id: str


class StoreUpdate(BaseModel):
    name: str
    code: str
    address: str
    is_active: bool
    