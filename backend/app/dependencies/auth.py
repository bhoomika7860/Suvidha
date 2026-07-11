from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.token import verify_access_token
from app.database import SessionLocal
from app.models.user import User

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    db = SessionLocal()

    user = db.query(User).filter(
        User.id == payload["user_id"],
        User.is_active == True
    ).first()

    db.close()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return {
        "user_id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "role": user.role,
        "store_id": user.store_id,
    }