from datetime import date

from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    Date,
    ForeignKey,
)

from app.database import Base


class UdhaarEntry(Base):
    __tablename__ = "udhaar_entries"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    bill_number = Column(
        String,
        nullable=False,
    )

    store_id = Column(
        Integer,
        ForeignKey("stores.id"),
        nullable=False,
    )

    daily_report_id = Column(
        Integer,
        ForeignKey("daily_reports.id"),
        nullable=False,
        index=True,
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    customer_name = Column(
        String,
        nullable=False,
    )

    customer_phone = Column(
        String,
        nullable=True,
    )

    amount = Column(
        Float,
        nullable=False,
    )

    paid_amount = Column(
        Float,
        default=0,
        nullable=False,
    )

    date_given = Column(
        Date,
        default=date.today,
        nullable=False,
    )

    status = Column(
        String,
        default="outstanding",
        nullable=False,
    )