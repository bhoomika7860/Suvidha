from pydantic import BaseModel


class AdjustmentCreate(BaseModel):
    daily_report_id: int
    field_name: str
    new_value: str
    reason: str


class AdjustmentReview(BaseModel):
    action: str


class AdjustmentResponse(BaseModel):
    id: int
    daily_report_id: int
    field_name: str
    old_value: str
    new_value: str
    reason: str
    status: str

    class Config:
        from_attributes = True