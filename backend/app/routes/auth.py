from fastapi import APIRouter, Depends
from app.schemas.auth import LoginRequest
from app.database import SessionLocal
from app.models.user import User
from app.core.security import verify_password
from app.core.token import create_access_token
from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_role

router = APIRouter()

@router.get("/owner-dashboard")
def owner_dashboard(current_user: dict = Depends(get_current_user)):
    require_role(["owner"], current_user["role"])

    return {
        "message": "Welcome Owner",
        "user": current_user
    }

@router.post("/login")
def login(data: LoginRequest):
    db = SessionLocal()

    user = db.query(User).filter(
        User.username == data.username,
        User.is_active == True
    ).first()

    db.close()

    if not user:
        return {"message": "Invalid credentials"}

    if not verify_password(data.password, user.password):
        return {"message": "Invalid credentials"}

    token = create_access_token({
        "user_id": user.id,
        "username": user.username,
        "role": user.role,
        "store_id": user.store_id
    })

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "message": "Authenticated user",
        "user": current_user
    }