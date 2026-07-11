from datetime import date
from pydantic import BaseModel


class TaskCreate(BaseModel):
    store_id: int
    assigned_to: int

    task_title: str
    task_type: str
    role: str

    target_quantity: int = 0

    requires_photo: bool = False

    due_date: date


class TaskComplete(BaseModel):
    completed_quantity: int

    photo_url: str | None = None