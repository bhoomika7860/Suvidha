from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class DeliveryAssignment(Base):
    __tablename__ = "delivery_assignments"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    daily_report_id = Column(
        Integer,
        ForeignKey("daily_reports.id"),
        nullable=False,
    )

    delivery_boy_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    deliveries_completed = Column(
        Integer,
        default=0,
        nullable=False,
    )

    daily_report = relationship(
        "DailyReport",
        back_populates="delivery_assignments",
    )

    delivery_boy = relationship(
        "User",
    )