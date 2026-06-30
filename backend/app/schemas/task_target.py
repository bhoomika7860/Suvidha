from pydantic import BaseModel


class TaskTargetCreate(BaseModel):
    store_id: int
    assigned_to: int
    task_title: str
    target_quantity: int


class TaskTargetComplete(BaseModel):
    completed_quantity: int