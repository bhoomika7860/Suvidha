from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True, index=True)
    daily_report_id = Column(Integer, ForeignKey("daily_reports.id"))
    customer_name = Column(String, nullable=False)
    status = Column(String, default="completed")    