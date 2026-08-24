from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.supplier import Supplier

from app.schemas.supplier import (
    SupplierCreate,
    SupplierUpdate,
    SupplierResponse,
)

from app.dependencies.auth import get_current_user


router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"],
)


def require_owner(current_user):
    if current_user.role != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the owner can manage suppliers.",
        )

    return current_user


# ---------------------------------------------------------
# GET ACTIVE SUPPLIERS
# ---------------------------------------------------------

@router.get(
    "/",
    response_model=list[SupplierResponse],
)
def get_suppliers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    suppliers = (
        db.query(Supplier)
        .filter(
            Supplier.is_active == True
        )
        .order_by(Supplier.name.asc())
        .all()
    )

    return suppliers


# ---------------------------------------------------------
# GET ALL SUPPLIERS
# Owner only
# ---------------------------------------------------------

@router.get(
    "/all",
    response_model=list[SupplierResponse],
)
def get_all_suppliers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_owner(current_user)

    suppliers = (
        db.query(Supplier)
        .order_by(Supplier.name.asc())
        .all()
    )

    return suppliers


# ---------------------------------------------------------
# CREATE SUPPLIER
# Owner only
# ---------------------------------------------------------

@router.post(
    "/",
    response_model=SupplierResponse,
)
def create_supplier(
    data: SupplierCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_owner(current_user)

    name = data.name.strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Supplier name cannot be empty.",
        )

    existing = (
        db.query(Supplier)
        .filter(
            Supplier.name.ilike(name)
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Supplier already exists.",
        )

    supplier = Supplier(
        name=name,
        is_active=True,
    )

    db.add(supplier)
    db.commit()
    db.refresh(supplier)

    return supplier


# ---------------------------------------------------------
# UPDATE SUPPLIER
# Owner only
# ---------------------------------------------------------

@router.put(
    "/{supplier_id}",
    response_model=SupplierResponse,
)
def update_supplier(
    supplier_id: int,
    data: SupplierUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_owner(current_user)

    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.id == supplier_id
        )
        .first()
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found.",
        )

    if data.name is not None:
        name = data.name.strip()

        if not name:
            raise HTTPException(
                status_code=400,
                detail="Supplier name cannot be empty.",
            )

        duplicate = (
            db.query(Supplier)
            .filter(
                Supplier.name.ilike(name),
                Supplier.id != supplier_id,
            )
            .first()
        )

        if duplicate:
            raise HTTPException(
                status_code=400,
                detail="Another supplier with this name already exists.",
            )

        supplier.name = name

    if data.is_active is not None:
        supplier.is_active = data.is_active

    db.commit()
    db.refresh(supplier)

    return supplier