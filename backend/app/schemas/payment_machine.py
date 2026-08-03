from pydantic import BaseModel


class PaymentMachineCreate(BaseModel):
    machine_name: str


class PaymentMachineResponse(BaseModel):
    id: int
    store_id: int
    machine_name: str

    class Config:
        from_attributes = True


class PaymentMachineEntrySave(BaseModel):
    daily_report_id: int
    machine_id: int
    amount: float


class PaymentMachineEntryResponse(BaseModel):
    machine_id: int
    machine_name: str
    amount: float