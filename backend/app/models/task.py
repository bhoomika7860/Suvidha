from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    Boolean,
    ForeignKey,
)
from datetime import date

from app.database import Base


class Task(Base):
    __tablename__ = "task_targets"

    id = Column(Integer, primary_key=True, index=True)

    # Relationships
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Task Details
    task_title = Column(String, nullable=False)
    task_type = Column(String, default="normal")
    role = Column(String, nullable=False)

    # Progress
    target_quantity = Column(Integer, default=0)
    completed_quantity = Column(Integer, default=0)
    completion_percentage = Column(Float, default=0)

    # Photo Proof
    requires_photo = Column(Boolean, default=False)
    photo_url = Column(String, nullable=True)

    # Dates
    task_date = Column(Date, default=date.today)
    due_date = Column(Date)

    # Status
    status = Column(String, default="pending")