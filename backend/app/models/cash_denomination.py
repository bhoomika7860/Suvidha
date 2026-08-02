from sqlalchemy import Column, Integer, ForeignKey
from app.database import Base


class CashDenomination(Base):
    __tablename__ = "cash_denominations"

    id = Column(Integer, primary_key=True, index=True)

    daily_report_id = Column(
        Integer,
        ForeignKey("daily_reports.id"),
        nullable=False,
    )

    note_500 = Column(Integer, default=0)
    note_200 = Column(Integer, default=0)
    note_100 = Column(Integer, default=0)
    note_50 = Column(Integer, default=0)
    note_20 = Column(Integer, default=0)
    note_10 = Column(Integer, default=0)
    coin_5 = Column(Integer, default=0)
    coin_2 = Column(Integer, default=0)
    coin_1 = Column(Integer, default=0)