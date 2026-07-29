from fastapi import APIRouter, Depends, HTTPException
from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.dependencies.auth import get_current_user
from app.dependencies.roles import require_role
from app.core.security import hash_password
from sqlalchemy import func

from app.models.daily_report import DailyReport
from app.models.delivery import Delivery
from app.models.expense import Expense
from app.models.purchase import Purchase

from app.schemas.performance import EmployeePerformanceResponse
router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# Bootstrap first owner
@router.post("/bootstrap-owner/{setup_key}")
def bootstrap_owner(
    setup_key: str,
    data: UserCreate
):
    db = SessionLocal()

    # Secret setup key check
    if setup_key != "pharmacore_setup_2026":
        db.close()
        raise HTTPException(
            status_code=403,
            detail="Invalid setup key"
        )

    # Allow only if no users exist
    existing_users = db.query(User).count()

    if existing_users > 0:
        db.close()
        raise HTTPException(
            status_code=403,
            detail="Bootstrap disabled. Users already exist."
        )

    owner = User(
        full_name=data.full_name,
        username=data.username,
        password=hash_password(data.password),
        role="owner",
        store_id=None
    )

    db.add(owner)
    db.commit()
    db.refresh(owner)
    db.close()

    return {
        "message": "Owner account created successfully",
        "user_id": owner.id
    }

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
     users = db.query(User).all()

    result = []

    for user in users:
        result.append({
            "id": user.id,
            "full_name": user.full_name,
            "username": user.username,
            "role": user.role,
            "is_active": user.is_active,
            "store_id": user.store_id,
            "store_name": user.store.name if user.store else None,
        })

    db.close()
    return result


    # Non-owner users can only see users from their own store
    if user.store_id != current_user["store_id"]:
        db.close()
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    db.close()
    return user


@router.get("/{user_id}/performance", response_model=EmployeePerformanceResponse)
def get_employee_performance(
    user_id: int,
    current_user: dict = Depends(get_current_user),
):
    require_role(["owner"], current_user["role"])

    db = SessionLocal()

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    daily_reports = (
        db.query(func.count(DailyReport.id))
        .filter(DailyReport.submitted_by == user.id)
        .scalar()
    )

    expenses = (
        db.query(func.count(Expense.id))
        .filter(Expense.created_by == user.id)
        .scalar()
    )

    purchases = (
        db.query(func.count(Purchase.id))
        .filter(Purchase.created_by == user.id)
        .scalar()
    )

    # deliveries = (
#     db.query(func.count(Delivery.id))
#     .filter(Delivery.completed_by == user.id)
#     .scalar()
# )

    deliveries = 0

    completed_tasks = (
        daily_reports
        + expenses
        + purchases
        + deliveries
    )

    assigned_tasks = completed_tasks

    pending_tasks = 0

    completion_rate = (
        100
        if assigned_tasks == 0
        else round((completed_tasks / assigned_tasks) * 100)
    )

    response = {
        "employee": {
            "id": user.id,
            "full_name": user.full_name,
            "username": user.username,
            "role": user.role,
            "store_id": user.store_id,
            "is_active": user.is_active,
        },
        "performance": {
            "completed_tasks": completed_tasks,
            "assigned_tasks": assigned_tasks,
            "pending_tasks": pending_tasks,
            "completion_rate": completion_rate,
            "overall_score": completion_rate,
        },
        "statistics": {
            "daily_reports": daily_reports,
            "deliveries": deliveries,
            "purchases": purchases,
            "expenses": expenses,
        },
    }

    db.close()

    return response

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

        result = []

        for user in users:
            result.append({
                "id": user.id,
                "full_name": user.full_name,
                "username": user.username,
                "role": user.role,
                "is_active": user.is_active,
                "store_id": user.store_id,
                "store_name": user.store.name if user.store else None,
            })

        db.close()
        return result

    # Staff sees only their own store users
    users = db.query(User).filter(
        User.store_id == current_user["store_id"]
    ).all()

    result = []

    for user in users:
        result.append({
            "id": user.id,
            "full_name": user.full_name,
            "username": user.username,
            "role": user.role,
            "is_active": user.is_active,
            "store_id": user.store_id,
            "store_name": user.store.name if user.store else None,
        })

    db.close()
    return result