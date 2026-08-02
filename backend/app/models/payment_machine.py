from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
)

from sqlalchemy.sql import func
from sqlalchemy.sql.sqltypes import DateTime

from app.database import Base


class PaymentMachine(Base):
    __tablename__ = "payment_machines"

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

    machine_name = Column(
        String,
        nullable=False,
    )

    is_active = Column(
        Boolean,
        default=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )