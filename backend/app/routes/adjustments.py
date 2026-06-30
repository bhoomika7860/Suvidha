from app.utils.audit import create_audit_log
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.adjustment_request import AdjustmentRequest
from app.models.daily_report import DailyReport
from app.schemas.adjustment_request import (
    AdjustmentCreate,
    AdjustmentReview
)

router = APIRouter(
    prefix="/adjustments",
    tags=["Adjustments"]
)


# Create adjustment request
@router.post("/")
def create_adjustment(
    data: AdjustmentCreate,
    db: Session = Depends(get_db)
):
    report = db.query(DailyReport).filter(
        DailyReport.id == data.daily_report_id
    ).first()

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Daily report not found"
        )

    # Only locked reports can have adjustment requests
    if not report.is_locked:
        raise HTTPException(
            status_code=400,
            detail="Report must be locked before requesting adjustment"
        )

    # Check if field exists
    if not hasattr(report, data.field_name):
        raise HTTPException(
            status_code=400,
            detail="Invalid field name"
        )

    old_value = str(getattr(report, data.field_name))

    adjustment = AdjustmentRequest(
        daily_report_id=data.daily_report_id,
        requested_by=report.submitted_by,
        field_name=data.field_name,
        old_value=old_value,
        new_value=data.new_value,
        reason=data.reason
    )

    db.add(adjustment)
    db.commit()
    db.refresh(adjustment)

    return adjustment


# Get all adjustment requests
@router.get("/")
def get_adjustments(
    db: Session = Depends(get_db)
):
    adjustments = db.query(AdjustmentRequest).all()
    return adjustments


# Approve adjustment request
@router.post("/{adjustment_id}/approve")
def approve_adjustment(
    adjustment_id: int,
    db: Session = Depends(get_db)
):
    adjustment = db.query(AdjustmentRequest).filter(
        AdjustmentRequest.id == adjustment_id
    ).first()

    if not adjustment:
        raise HTTPException(
            status_code=404,
            detail="Adjustment request not found"
        )

    if adjustment.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="This adjustment has already been reviewed"
        )

    report = db.query(DailyReport).filter(
        DailyReport.id == adjustment.daily_report_id
    ).first()

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Daily report not found"
        )

    # Apply new value
    setattr(
        report,
        adjustment.field_name,
        adjustment.new_value
    )

    adjustment.status = "approved"

    db.commit()
    create_audit_log(
    db=db,
    user_id=adjustment.requested_by,
    action="APPROVE",
    table_name="adjustment_requests",
    record_id=adjustment.id,
    description="Approved adjustment request"
)

    return {
    "message": "Adjustment approved"
}
    db.refresh(adjustment)

    

# Reject adjustment request
@router.post("/{adjustment_id}/reject")
def reject_adjustment(
    adjustment_id: int,
    db: Session = Depends(get_db)
):
    adjustment = db.query(AdjustmentRequest).filter(
        AdjustmentRequest.id == adjustment_id
    ).first()

    if not adjustment:
        raise HTTPException(
            status_code=404,
            detail="Adjustment request not found"
        )

    if adjustment.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="This adjustment has already been reviewed"
        )

    adjustment.status = "rejected"

    db.commit()

    return {
        "message": "Adjustment rejected"
    }