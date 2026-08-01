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


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)

    store_id = Column(
        Integer,
        ForeignKey("stores.id"),
        nullable=False,
    )

    expense_type = Column(
        String,
        nullable=False,
    )

    daily_report_id = Column(
    Integer,
    ForeignKey("daily_reports.id"),
    nullable=False,
)

    amount = Column(
        Float,
        nullable=False,
    )

    remarks = Column(
        String,
        nullable=True,
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )