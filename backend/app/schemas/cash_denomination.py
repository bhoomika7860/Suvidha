from pydantic import BaseModel


class CashDenominationCreate(BaseModel):
    daily_report_id: int

    note_500: int = 0
    note_200: int = 0
    note_100: int = 0
    note_50: int = 0
    note_20: int = 0
    note_10: int = 0

    coin_5: int = 0
    coin_2: int = 0
    coin_1: int = 0


class CashDenominationResponse(CashDenominationCreate):
    id: int

    class Config:
        from_attributes = True