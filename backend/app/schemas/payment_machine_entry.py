from pydantic import BaseModel


class MachineEntry(BaseModel):
    machine_id: int
    amount: float


class PaymentMachineEntryCreate(BaseModel):
    daily_report_id: int
    entries: list[MachineEntry]


class PaymentMachineEntryResponse(BaseModel):
    machine_id: int
    machine_name: str
    amount: float