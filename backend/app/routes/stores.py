from fastapi import APIRouter, Depends
from app.database import SessionLocal
from app.models.store import Store
from app.schemas.store import StoreCreate, StoreUpdate
from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_role

router = APIRouter(prefix="/stores", tags=["Stores"])

@router.post("/")
def create_store(
    data: StoreCreate,
    current_user: dict = Depends(get_current_user)
):
    require_role(["owner"], current_user["role"])

    db = SessionLocal()

    store = Store(
        name=data.name,
        code=data.code,
        address=data.address
    )

    db.add(store)
    db.commit()
    db.refresh(store)
    db.close()

    return {
        "message": "Store created",
        "store_id": store.id
    }

@router.get("/{store_id}")
def get_store(
    store_id: int,
    current_user: dict = Depends(get_current_user)
):
    db = SessionLocal()

    store = db.query(Store).filter(
        Store.id == store_id
    ).first()

    db.close()

    if not store:
        return {"message": "Store not found"}

    return store


@router.put("/{store_id}")
def update_store(
    store_id: int,
    data: StoreUpdate,
    current_user: dict = Depends(get_current_user)
):
    require_role(["owner"], current_user["role"])

    db = SessionLocal()

    store = db.query(Store).filter(
        Store.id == store_id
    ).first()

    if not store:
        db.close()
        return {"message": "Store not found"}

    store.name = data.name
    store.code = data.code
    store.address = data.address
    store.is_active = data.is_active

    db.commit()
    db.close()

    return {"message": "Store updated"}


@router.delete("/{store_id}")
def deactivate_store(
    store_id: int,
    current_user: dict = Depends(get_current_user)
):
    require_role(["owner"], current_user["role"])

    db = SessionLocal()

    store = db.query(Store).filter(
        Store.id == store_id
    ).first()

    if not store:
        db.close()
        return {"message": "Store not found"}

    store.is_active = False

    db.commit()
    db.close()

    return {"message": "Store deactivated"}

@router.get("/")
def get_stores(current_user: dict = Depends(get_current_user)):
    db = SessionLocal()

    stores = db.query(Store).all()
    db.close()

    return stores