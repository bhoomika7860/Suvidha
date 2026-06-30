from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database import Base
from datetime import datetime


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String, nullable=False)

    table_name = Column(String, nullable=False)
    record_id = Column(Integer, nullable=False)

    description = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)