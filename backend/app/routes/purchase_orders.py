from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.purchase_order import PurchaseOrder
from app.models.purchase_order_item import PurchaseOrderItem
from app.schemas.purchase_order import (
    PurchaseOrderCreate,
)

router = APIRouter(
    prefix="/purchase-orders",
    tags=["Purchase Orders"],
)


# -----------------------------
# Create Purchase Order
# -----------------------------

@router.post("/")
def create_purchase_order(
    data: PurchaseOrderCreate,
    db: Session = Depends(get_db),
):
    order = PurchaseOrder(
        store_id=data.store_id,
        supplier_name=data.supplier_name,
        expected_amount=data.expected_amount,
        expected_date=data.expected_date,
        created_by=data.created_by,
        status="Pending",
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    for item in data.items or []:

        db.add(
            PurchaseOrderItem(
                purchase_order_id=order.id,
                medicine_name=item.medicine_name,
                quantity=item.quantity,
            )
        )

    db.commit()

    return {
        "message": "Purchase Order Created",
        "id": order.id,
    }


# -----------------------------
# Get All Purchase Orders
# -----------------------------

@router.get("/")
def get_purchase_orders(
    db: Session = Depends(get_db),
):
    orders = (
        db.query(PurchaseOrder)
        .options(
            joinedload(PurchaseOrder.items)
        )
        .all()
    )

    return orders


# -----------------------------
# Get Single Purchase Order
# -----------------------------

@router.get("/{order_id}")
def get_purchase_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    order = (
        db.query(PurchaseOrder)
        .options(
            joinedload(PurchaseOrder.items)
        )
        .filter(
            PurchaseOrder.id == order_id
        )
        .first()
    )

    if order is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase Order not found",
        )

    return order


# -----------------------------
# Update Status
# -----------------------------

@router.put("/{order_id}/status")
def update_purchase_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
):
    order = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.id == order_id
        )
        .first()
    )

    if order is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase Order not found",
        )

    order.status = status

    db.commit()

    return {
        "message": "Status Updated"
    }


# -----------------------------
# Delete
# -----------------------------

@router.delete("/{order_id}")
def delete_purchase_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    order = (
        db.query(PurchaseOrder)
        .filter(
            PurchaseOrder.id == order_id
        )
        .first()
    )

    if order is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase Order not found",
        )

    db.delete(order)

    db.commit()

    return {
        "message": "Purchase Order Deleted"
    }