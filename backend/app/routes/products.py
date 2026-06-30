from fastapi import APIRouter, Depends, HTTPException
from app.database import SessionLocal
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_role

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# Create product (owner only)
@router.post("/")
def create_product(
    data: ProductCreate,
    current_user: dict = Depends(get_current_user)
):
    require_role(["owner"], current_user["role"])

    db = SessionLocal()

    existing = db.query(Product).filter(
        Product.name == data.name
    ).first()

    if existing:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="Product already exists"
        )

    product = Product(
        name=data.name,
        category=data.category,
        brand=data.brand
    )

    db.add(product)
    db.commit()
    db.refresh(product)
    db.close()

    return product


# Get all active products
@router.get("/")
def get_products():
    db = SessionLocal()

    products = db.query(Product).filter(
        Product.is_active == True
    ).all()

    db.close()
    return products


# Get single product
@router.get("/{product_id}")
def get_product(product_id: int):
    db = SessionLocal()

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    db.close()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# Update product (owner only)
@router.put("/{product_id}")
def update_product(
    product_id: int,
    data: ProductUpdate,
    current_user: dict = Depends(get_current_user)
):
    require_role(["owner"], current_user["role"])

    db = SessionLocal()

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.name = data.name
    product.category = data.category
    product.brand = data.brand
    product.is_active = data.is_active

    db.commit()
    db.refresh(product)
    db.close()

    return product


# Soft delete
@router.delete("/{product_id}")
def deactivate_product(
    product_id: int,
    current_user: dict = Depends(get_current_user)
):
    require_role(["owner"], current_user["role"])

    db = SessionLocal()

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.is_active = False

    db.commit()
    db.close()

    return {
        "message": "Product deactivated"
    }