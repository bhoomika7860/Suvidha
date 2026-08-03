from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user

from app.models.payment_machine import PaymentMachine
from app.models.payment_machine_entry import PaymentMachineEntry

from app.schemas.payment_machine import (
    PaymentMachineCreate,
    PaymentMachineResponse,
)

router = APIRouter(
    prefix="/payment-machines",
    tags=["Payment Machines"],
)

@router.post("/", response_model=PaymentMachineResponse)
def add_machine(
    data: PaymentMachineCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    machine = PaymentMachine(
        store_id=current_user["store_id"],
        machine_name=data.machine_name,
    )

    db.add(machine)
    db.commit()
    db.refresh(machine)

    return machine

@router.get("/", response_model=list[PaymentMachineResponse])
def get_machines(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(PaymentMachine)
        .filter(
            PaymentMachine.store_id == current_user["store_id"],
            PaymentMachine.is_active == True,
        )
        .order_by(PaymentMachine.machine_name)
        .all()
    )

@router.delete("/{machine_id}")
def delete_machine(
    machine_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    machine = (
        db.query(PaymentMachine)
        .filter(
            PaymentMachine.id == machine_id,
            PaymentMachine.store_id == current_user["store_id"],
        )
        .first()
    )

    if not machine:
        raise HTTPException(
            status_code=404,
            detail="Machine not found",
        )

    machine.is_active = False

    db.commit()

    return {
        "message": "Machine deleted"
    }