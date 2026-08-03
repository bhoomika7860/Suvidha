from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.dependencies.auth import get_current_user

from app.models.payment_machine import PaymentMachine
from app.models.payment_machine_entry import PaymentMachineEntry
from app.models.daily_report import DailyReport

from app.schemas.payment_machine_entry import (
    PaymentMachineEntryCreate,
)

router = APIRouter(
    prefix="/payment-machine-entries",
    tags=["Payment Machine Entries"],
)


@router.post("/")
def save_entries(
    data: PaymentMachineEntryCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(DailyReport)
        .filter(
            DailyReport.id == data.daily_report_id
        )
        .first()
    )

    if not report:
        return {"message": "Report not found"}

    db.query(PaymentMachineEntry).filter(
        PaymentMachineEntry.daily_report_id
        == data.daily_report_id
    ).delete()

    total = 0

    for item in data.entries:

        entry = PaymentMachineEntry(
            daily_report_id=data.daily_report_id,
            machine_id=item.machine_id,
            amount=item.amount,
        )

        db.add(entry)

        total += item.amount

    report.upi_sales = total

    db.commit()

    return {
        "message": "Saved successfully"
    }


@router.get("/{report_id}")
def get_entries(
    report_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    machines = (
        db.query(
            PaymentMachine.id,
            PaymentMachine.machine_name,
            func.coalesce(
                PaymentMachineEntry.amount,
                0,
            ).label("amount"),
        )
        .outerjoin(
            PaymentMachineEntry,
            (
                PaymentMachine.id
                == PaymentMachineEntry.machine_id
            )
            &
            (
                PaymentMachineEntry.daily_report_id
                == report_id
            ),
        )
        .filter(
            PaymentMachine.store_id
            == current_user["store_id"],
            PaymentMachine.is_active == True,
        )
        .order_by(
            PaymentMachine.machine_name
        )
        .all()
    )

    return [
        {
            "machine_id": machine.id,
            "machine_name": machine.machine_name,
            "amount": machine.amount,
        }
        for machine in machines
    ]