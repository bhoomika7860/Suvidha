from pydantic import BaseModel


class DeliveryAssignmentBase(BaseModel):
    delivery_boy_id: int
    deliveries_completed: int


class DeliveryAssignmentCreate(
    DeliveryAssignmentBase
):
    daily_report_id: int


class DeliveryAssignmentResponse(
    DeliveryAssignmentBase
):
    id: int

    class Config:
        from_attributes = True