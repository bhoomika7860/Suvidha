from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
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

    # Relationships

    daily_report = relationship(
        "DailyReport",
        back_populates="adjustment_requests"
    )

    requested_by_user = relationship(
        "User",
        foreign_keys=[requested_by],
        back_populates="requested_adjustments"
    )

    reviewed_by_user = relationship(
        "User",
        foreign_keys=[reviewed_by],
        back_populates="reviewed_adjustments"
    )   