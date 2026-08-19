from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user

from app.models.cash_denomination import CashDenomination
from app.models.daily_report import DailyReport

from app.schemas.cash_denomination import (
    CashDenominationCreate,
)


router = APIRouter(
    prefix="/cash-denominations",
    tags=["Cash Denominations"],
)


OPENING_CASH = 20000


@router.post("/")
def save_cash_denominations(
    data: CashDenominationCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id
            == data.daily_report_id
        )
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Daily report not found",
        )

    if (
        current_user["role"] != "owner"
        and report.store_id
        != current_user["store_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    if report.is_locked:
        raise HTTPException(
            status_code=409,
            detail="Report is locked",
        )

    cash = (
        data.note_500 * 500
        + data.note_200 * 200
        + data.note_100 * 100
        + data.note_50 * 50
        + data.note_20 * 20
        + data.note_10 * 10
        + data.coin_5 * 5
        + data.coin_2 * 2
        + data.coin_1
    )

    sales = cash - OPENING_CASH

    denomination = (
        db.query(CashDenomination)
        .filter(
            CashDenomination.daily_report_id
            == report.id
        )
        .first()
    )

    if denomination:

        denomination.note_500 = data.note_500
        denomination.note_200 = data.note_200
        denomination.note_100 = data.note_100
        denomination.note_50 = data.note_50
        denomination.note_20 = data.note_20
        denomination.note_10 = data.note_10

        denomination.coin_5 = data.coin_5
        denomination.coin_2 = data.coin_2
        denomination.coin_1 = data.coin_1

    else:

        denomination = CashDenomination(
            **data.model_dump()
        )

        db.add(denomination)

    report.cash_sales = sales

    db.commit()

    return {
        "cash_counted": cash,
        "cash_sales": sales,
    }


@router.get("/{report_id}")
def get_cash_denominations(
    report_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id == report_id
        )
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Daily report not found",
        )

    if (
        current_user["role"] != "owner"
        and report.store_id
        != current_user["store_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Not allowed",
        )

    denomination = (
        db.query(CashDenomination)
        .filter(
            CashDenomination.daily_report_id
            == report_id
        )
        .first()
    )

    if denomination is None:
        return None

    return denomination