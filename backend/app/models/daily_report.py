from sqlalchemy import Column, Integer, Float, Date, Boolean, ForeignKey
from app.database import Base
from datetime import date


class DailyReport(Base):
    __tablename__ = "daily_reports"

    id = Column(Integer, primary_key=True, index=True)

    store_id = Column(Integer, ForeignKey("stores.id"))
    submitted_by = Column(Integer, ForeignKey("users.id"))

    report_date = Column(Date, default=date.today)

    total_bills = Column(Integer, default=0)
    deliveries = Column(Integer, default=0)

    cash_sales = Column(Float, default=0)
    upi_sales = Column(Float, default=0)
    card_sales = Column(Float, default=0)
    udhaar_sales = Column(Float, default=0)

    total_expenses = Column(Float, default=0)

    is_locked = Column(Boolean, default=False)
    