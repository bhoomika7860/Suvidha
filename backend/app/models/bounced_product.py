from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class BouncedProduct(Base):
    __tablename__ = "bounced_products"

    id = Column(Integer, primary_key=True, index=True)

    daily_report_id = Column(
        Integer,
        ForeignKey("daily_reports.id")
    )

    product_name = Column(String, nullable=False)

    quantity = Column(Integer, nullable=False)

    daily_report = relationship(
        "DailyReport",
        back_populates="bounced_products"
    )