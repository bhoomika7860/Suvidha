from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.purchase import Purchase
from app.schemas.purchase import PurchaseCreate, PurchaseResponse
from typing import List
from sqlalchemy import func
from datetime import date

router = APIRouter(
    prefix="/purchases",
    tags=["Purchases"]
)


# Create purchase
@router.post("/", response_model=PurchaseResponse)
def create_purchase(purchase: PurchaseCreate, db: Session = Depends(get_db)):
    new_purchase = Purchase(**purchase.dict())

    db.add(new_purchase)
    db.commit()
    db.refresh(new_purchase)

    return new_purchase


# Get all purchases
@router.get("/", response_model=List[PurchaseResponse])
def get_all_purchases(db: Session = Depends(get_db)):
    purchases = db.query(Purchase).all()
    return purchases


# Get store-wise purchases
@router.get("/store/{store_id}", response_model=List[PurchaseResponse])
def get_store_purchases(store_id: int, db: Session = Depends(get_db)):
    purchases = db.query(Purchase).filter(
        Purchase.store_id == store_id
    ).all()

    return purchases


# Get today's purchases
from datetime import date
from sqlalchemy import func


@router.get("/today", response_model=List[PurchaseResponse])
def get_today_purchases(db: Session = Depends(get_db)):
    today = date.today()

    purchases = db.query(Purchase).filter(
        func.date(Purchase.purchase_date) == today
    ).all()

    return purchases