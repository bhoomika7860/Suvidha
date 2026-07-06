from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)

    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)

    product_name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)

    supplier_name = Column(String, nullable=True)

    purchase_amount = Column(Float, nullable=False)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    purchase_date = Column(DateTime(timezone=True), server_default=func.now())