from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.daily_report import DailyReport
from app.services.export_service import generate_excel_report

router = APIRouter(prefix="/export", tags=["Export"])


@router.get("/{period}")
def export_reports(period: str, db: Session = Depends(get_db)):
    reports = db.query(DailyReport).all()

    file = generate_excel_report(reports)

    return StreamingResponse(
        file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f"attachment; filename=pharmacore_{period}.xlsx"
        }
    )