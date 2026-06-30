from pydantic import BaseModel
from datetime import datetime


class AuditLogResponse(BaseModel):
    id: int
    user_id: int
    action: str
    table_name: str
    record_id: int
    description: str
    created_at: datetime

    class Config:
        from_attributes = True