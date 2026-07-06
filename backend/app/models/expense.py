from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)

    daily_report_id = Column(
        Integer,
        ForeignKey("daily_reports.id")
    )

    title = Column(String, nullable=False)

    amount = Column(Float, nullable=False)

    daily_report = relationship(
        "DailyReport",
        back_populates="expenses"
    )