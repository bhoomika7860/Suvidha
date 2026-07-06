from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    role = Column(String, nullable=False, default="staff")

    store_id = Column(Integer, ForeignKey("stores.id"))

    is_active = Column(Boolean, default=True)

    # Reports submitted by this user
    submitted_reports = relationship(
        "DailyReport",
        foreign_keys="DailyReport.submitted_by",
        back_populates="submitted_by_user"
    )

    # Adjustment requests created by this user
    requested_adjustments = relationship(
        "AdjustmentRequest",
        foreign_keys="AdjustmentRequest.requested_by",
        back_populates="requested_by_user"
    )

    # Adjustment requests reviewed by this user
    reviewed_adjustments = relationship(
        "AdjustmentRequest",
        foreign_keys="AdjustmentRequest.reviewed_by",
        back_populates="reviewed_by_user"
    )