print("PAYMENT MACHINE ENTRY MODEL LOADED")
from sqlalchemy import (
    Column,
    Integer,
    Float,
    ForeignKey,
)

from app.database import Base


class PaymentMachineEntry(Base):
    __tablename__ = "payment_machine_entries"

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

    machine_id = Column(
        Integer,
        ForeignKey("payment_machines.id"),
        nullable=False,
    )

    amount = Column(
        Float,
        default=0,
    )