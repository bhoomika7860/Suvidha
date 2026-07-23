from fastapi import APIRouter, Depends
from app.database import SessionLocal
from app.models.store import Store
from app.models.user import User
from app.schemas.store import StoreCreate, StoreUpdate
from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_role

router = APIRouter(
    prefix="/stores",
    tags=["Stores"]
)


# -----------------------------
# Create Store
# -----------------------------
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
        address=data.address,
        manager_name=data.manager_name,
    )

    db.add(store)
    db.commit()
    db.refresh(store)

    db.close()

    return {
        "message": "Store created",
        "store_id": store.id,
    }


# -----------------------------
# Get Single Store
# -----------------------------
@router.get("/{store_id}")
def get_store(
    store_id: int,
    current_user: dict = Depends(get_current_user)
):
    db = SessionLocal()

    store = (
        db.query(Store)
        .filter(Store.id == store_id)
        .first()
    )

    db.close()

    if not store:
        return {
            "message": "Store not found"
        }

    return store


# -----------------------------
# Update Store
# -----------------------------
@router.put("/{store_id}")
def update_store(
    store_id: int,
    data: StoreUpdate,
    current_user: dict = Depends(get_current_user)
):
    require_role(["owner"], current_user["role"])

    db = SessionLocal()

    store = (
        db.query(Store)
        .filter(Store.id == store_id)
        .first()
    )

    if not store:
        db.close()
        return {
            "message": "Store not found"
        }

    store.name = data.name
    store.code = data.code
    store.address = data.address
    store.manager_name = data.manager_name
    store.is_active = data.is_active

    db.commit()
    db.refresh(store)

    db.close()

    return {
        "message": "Store updated"
    }


# -----------------------------
# Delete Store
# -----------------------------
@router.delete("/{store_id}")
def delete_store(
    store_id: int,
    current_user: dict = Depends(get_current_user)
):
    require_role(["owner"], current_user["role"])

    db = SessionLocal()

    store = (
        db.query(Store)
        .filter(Store.id == store_id)
        .first()
    )

    if not store:
        db.close()
        return {
            "message": "Store not found"
        }

    db.delete(store)
    db.commit()

    db.close()

    return {
        "message": "Store deleted"
    }


# -----------------------------
# Get All Stores
# -----------------------------
@router.get("/")
def get_stores(
    current_user: dict = Depends(get_current_user)
):
    db = SessionLocal()

    stores = db.query(Store).all()

    results = []

    for store in stores:
        results.append({
            "id": store.id,
            "name": store.name,
            "code": store.code,
            "address": store.address,
            "is_active": store.is_active,
            "manager_name": store.manager_name,
        })

    db.close()

    return results