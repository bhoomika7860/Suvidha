from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.audit_log import AuditLog

router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"]
)


@router.get("/")
def get_audit_logs(
    db: Session = Depends(get_db)
):
    return db.query(AuditLog).all()


@router.get("/{log_id}")
def get_single_audit_log(
    log_id: int,
    db: Session = Depends(get_db)
):
    return db.query(AuditLog).filter(
        AuditLog.id == log_id
    ).first()