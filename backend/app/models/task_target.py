from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from app.database import Base
from datetime import date


class TaskTarget(Base):
    __tablename__ = "task_targets"

    id = Column(Integer, primary_key=True, index=True)

    store_id = Column(Integer, ForeignKey("stores.id"))
    assigned_to = Column(Integer, ForeignKey("users.id"))

    task_title = Column(String, nullable=False)

    target_quantity = Column(Integer, nullable=False)
    completed_quantity = Column(Integer, default=0)

    completion_percentage = Column(Float, default=0)

    task_date = Column(Date, default=date.today)

    status = Column(String, default="pending")