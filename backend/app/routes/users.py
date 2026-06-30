from fastapi import APIRouter, Depends, HTTPException
from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_role
from app.core.security import hash_password

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# Create user (owner only)
@router.post("/")
def create_user(
    data: UserCreate,
    current_user: dict = Depends(get_current_user)
):
    require_role(["owner"], current_user["role"])

    db = SessionLocal()

    user = User(
        full_name=data.full_name,
        username=data.username,
        password=hash_password(data.password),
        role=data.role,
        store_id=data.store_id
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

    return {
        "message": "User created",
        "user_id": user.id
    }


# Get single user
@router.get("/{user_id}")
def get_user(
    user_id: int,
    current_user: dict = Depends(get_current_user)
):
    db = SessionLocal()

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Owner can view anyone
    if current_user["role"] == "owner":
        db.close()
        return user

    # Staff can only view users from same store
    if user.store_id != current_user["store_id"]:
        db.close()
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    db.close()
    return user


# Update user (owner only)
@router.put("/{user_id}")
def update_user(
    user_id: int,
    data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    require_role(["owner"], current_user["role"])

    db = SessionLocal()

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.full_name = data.full_name
    user.username = data.username
    user.role = data.role
    user.store_id = data.store_id
    user.is_active = data.is_active

    db.commit()
    db.close()

    return {
        "message": "User updated"
    }


# Deactivate user (owner only)
@router.delete("/{user_id}")
def deactivate_user(
    user_id: int,
    current_user: dict = Depends(get_current_user)
):
    require_role(["owner"], current_user["role"])

    db = SessionLocal()

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.is_active = False

    db.commit()
    db.close()

    return {
        "message": "User deactivated"
    }


# Get users
@router.get("/")
def get_users(
    current_user: dict = Depends(get_current_user)
):
    db = SessionLocal()

    # Owner sees all users
    if current_user["role"] == "owner":
        users = db.query(User).all()
        db.close()
        return users

    # Staff sees only their own store users
    users = db.query(User).filter(
        User.store_id == current_user["store_id"]
    ).all()

    db.close()
    return users