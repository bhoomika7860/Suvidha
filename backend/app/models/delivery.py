from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
)
from app.database import Base


class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    daily_report_id = Column(
        Integer,
        ForeignKey("daily_reports.id"),
        nullable=False,
    )

    # NEW: User who completed the delivery
    completed_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )

    customer_name = Column(
        String,
        nullable=False,
    )

    status = Column(
        String,
        default="completed",
    )

    bill_number = Column(
        String,
        nullable=True,
    )

    payment = Column(
        String,
        nullable=True,
    )

    payment_method = Column(
        String,
        nullable=True,
    )

    notes = Column(
        String,
        nullable=True,
    )

    bill_image = Column(
        String,
        nullable=True,
    )