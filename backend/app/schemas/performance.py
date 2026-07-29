from pydantic import BaseModel


class EmployeeInfo(BaseModel):
    id: int
    full_name: str
    username: str
    role: str
    store_id: int | None
    is_active: bool


class PerformanceInfo(BaseModel):
    completed_tasks: int
    assigned_tasks: int
    pending_tasks: int
    completion_rate: int
    overall_score: int


class StatisticsInfo(BaseModel):
    daily_reports: int
    deliveries: int
    purchases: int
    expenses: int


class EmployeePerformanceResponse(BaseModel):
    employee: EmployeeInfo
    performance: PerformanceInfo
    statistics: StatisticsInfo