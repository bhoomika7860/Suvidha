from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    DateTime,
)

from sqlalchemy.sql import func

from app.database import Base


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
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

    product_name = Column(
        String,
        nullable=False,
    )

    quantity = Column(
        Integer,
        nullable=False,
    )

    supplier_name = Column(
        String,
        nullable=True,
    )

    purchase_amount = Column(
        Float,
        nullable=False,
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    purchase_date = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    received_date = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    purchase_order_id = Column(
        Integer,
        ForeignKey("purchase_orders.id"),
        nullable=True,
    )

    status = Column(
        String,
        nullable=False,
        default="received",
    )

    bill_number = Column(
        String,
        nullable=False,
    )

    received_by = Column(
        String,
        nullable=True,
    )

    checked_by = Column(
        String,
        nullable=True,
    )

    entered_by = Column(
        String,
        nullable=True,
    )

    grn_number = Column(
        String,
        nullable=True,
    )

    bill_image = Column(
        String,
        nullable=True,
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )