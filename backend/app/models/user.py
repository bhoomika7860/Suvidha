from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    store_id = Column(Integer, ForeignKey("stores.id"))
    is_active = Column(Boolean, default=True)