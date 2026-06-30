from fastapi import HTTPException


def require_role(allowed_roles: list, user_role: str):
    allowed_roles = [role.lower() for role in allowed_roles]

    if user_role.lower() not in allowed_roles:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )