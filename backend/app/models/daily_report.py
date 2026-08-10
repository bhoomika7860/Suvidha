from datetime import date
from zoneinfo import ZoneInfo

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    Float,
    ForeignKey,
    Integer,
    Text,
)
from sqlalchemy.orm import relationship
from app.database import Base


class DailyReport(Base):
    __tablename__ = "daily_reports"

    id = Column(Integer, primary_key=True, index=True)

    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    submitted_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    report_date = Column(Date, default=date.today)

    total_bills = Column(Integer, default=0)
    deliveries = Column(Integer, default=0)
    completed_deliveries = Column(Integer, default=0)
    cash_sales = Column(Float, default=0)
    upi_sales = Column(Float, default=0)
    card_sales = Column(Float, default=0)
    udhaar_sales = Column(Float, default=0)
    system_sales = Column(Float, default=0)
    total_expenses = Column(Float, default=0)
    total_purchases = Column(Float, default=0)

    notes = Column(Text, nullable=True)

    # Workflow
    is_submitted = Column(Boolean, default=False)
    is_locked = Column(Boolean, default=False)

    # Relationships
    store = relationship(
        "Store",
        back_populates="reports",
    )

    submitted_by_user = relationship(
        "User",
        foreign_keys=[submitted_by],
        back_populates="submitted_reports",
    )

    
    adjustment_requests = relationship(
        "AdjustmentRequest",
        back_populates="daily_report",
        cascade="all, delete-orphan",
    )

    delivery_assignments = relationship(
    "DeliveryAssignment",
    back_populates="daily_report",
    cascade="all, delete-orphan",
)