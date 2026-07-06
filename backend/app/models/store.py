from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base
from sqlalchemy.orm import relationship


class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    address = Column(String)
    is_active = Column(Boolean, default=True)
    reports = relationship("DailyReport", back_populates="store")