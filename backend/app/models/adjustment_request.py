from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.database import Base
from datetime import datetime


class AdjustmentRequest(Base):
    __tablename__ = "adjustment_requests"

    id = Column(Integer, primary_key=True, index=True)

    daily_report_id = Column(Integer, ForeignKey("daily_reports.id"))
    requested_by = Column(Integer, ForeignKey("users.id"))

    field_name = Column(String, nullable=False)
    old_value = Column(String, nullable=False)
    new_value = Column(String, nullable=False)

    reason = Column(String, nullable=False)

    status = Column(String, default="pending")

    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)