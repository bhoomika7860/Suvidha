from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False, unique=True)
    category = Column(String, nullable=True)
    brand = Column(String, nullable=True)

    is_active = Column(Boolean, default=True)