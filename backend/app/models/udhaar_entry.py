from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey
from app.database import Base
from datetime import date


class UdhaarEntry(Base):
    __tablename__ = "udhaar_entries"

    id = Column(Integer, primary_key=True, index=True)

    store_id = Column(Integer, ForeignKey("stores.id"))
    daily_report_id = Column(Integer, ForeignKey("daily_reports.id"))
    created_by = Column(Integer, ForeignKey("users.id"))

    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=True)

    amount = Column(Float, nullable=False)
    paid_amount = Column(Float, default=0)

    date_given = Column(Date, default=date.today)

    status = Column(String, default="outstanding")