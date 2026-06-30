from app.utils.audit import create_audit_log
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.bounced_product import BouncedProduct
from app.models.daily_report import DailyReport
from app.schemas.bounced_product import BouncedProductCreate
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/bounced-products",
    tags=["Bounced Products"]
)


@router.post("/")
def create_bounced_product(
    data: BouncedProductCreate,
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

    if report.is_locked:
        raise HTTPException(
        status_code=409,
        detail="Cannot add bounced products to a locked report"
    )
    product = BouncedProduct(
        daily_report_id=data.daily_report_id,
        product_name=data.product_name,
        quantity=data.quantity
    )

    db.add(product)
    db.commit()
    db.refresh(product)
    create_audit_log(
    db=db,
    user_id=report.submitted_by,
    action="CREATE",
    table_name="bounced_products",
    record_id=product.id,
    description="Added bounced product"
)

    return product
  


@router.get("/")
def get_bounced_products(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] == "owner":
        return db.query(BouncedProduct).all()

    return db.query(BouncedProduct).join(
        DailyReport
    ).filter(
        DailyReport.store_id == current_user["store_id"]
    ).all()


@router.get("/{product_id}")
def get_bounced_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(BouncedProduct).filter(
        BouncedProduct.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@router.delete("/{product_id}")
def delete_bounced_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(BouncedProduct).filter(
        BouncedProduct.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Bounced product deleted"
    }