from pydantic import BaseModel


class BouncedProductCreate(BaseModel):
    daily_report_id: int
    product_name: str
    quantity: int