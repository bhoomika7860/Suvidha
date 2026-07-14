from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.database import Base


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)

    store_id = Column(
        Integer,
        ForeignKey("stores.id"),
        nullable=False,
    )

    supplier_name = Column(
        String,
        nullable=False,
    )

    expected_amount = Column(
        Float,
        default=0,
    )

    expected_date = Column(
        Date,
        nullable=True,
    )

    status = Column(
        String,
        default="Pending",
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    items = relationship(
        "PurchaseOrderItem",
        back_populates="purchase_order",
        cascade="all, delete-orphan",
    )