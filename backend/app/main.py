import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine

# Import models so SQLAlchemy creates tables
from app.models.store import Store
from app.models.daily_report import DailyReport
from app.models.expense import Expense
from app.models.delivery import Delivery
from app.models.bounced_product import BouncedProduct
from app.models.udhaar_entry import UdhaarEntry
from app.models.adjustment_request import AdjustmentRequest
from app.models.audit_log import AuditLog
from app.models.product import Product
from app.models.task import Task
from app.models.purchase import Purchase
from app.models.purchase_order import PurchaseOrder
from app.models.purchase_order_item import PurchaseOrderItem
from app.routes import delivery_assignments
# Import routers
from app.routes.auth import router as auth_router
from app.routes.stores import router as store_router
from app.routes.users import router as user_router
from app.routes.daily_reports import router as daily_report_router
from app.routes.expenses import router as expense_router
from app.routes.deliveries import router as delivery_router
from app.routes.bounced_products import router as bounced_product_router
from app.routes import (
    udhaar,
    adjustments,
    audit_logs,
    products,
    analytics,
    tasks,
    export,
    purchase,
    purchase_orders,
)

# ----------------------------------------------------
# Create FastAPI app
# ----------------------------------------------------

app = FastAPI(
    title="PharmaCore360 API"
)

# ----------------------------------------------------
# Create upload folders
# ----------------------------------------------------

os.makedirs("uploads", exist_ok=True)
os.makedirs("uploads/tasks", exist_ok=True)
os.makedirs("uploads/bills", exist_ok=True)

# ----------------------------------------------------
# Serve uploaded files
# ----------------------------------------------------

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

# ----------------------------------------------------
# CORS
# ----------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# Create database tables
# ----------------------------------------------------

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Database tables created.")

# ----------------------------------------------------
# Register routers
# ----------------------------------------------------

app.include_router(auth_router)
app.include_router(store_router)
app.include_router(user_router)
app.include_router(daily_report_router)
app.include_router(expense_router)
app.include_router(delivery_router)
app.include_router(bounced_product_router)
app.include_router(udhaar.router)
app.include_router(adjustments.router)
app.include_router(audit_logs.router)
app.include_router(products.router)
app.include_router(analytics.router)
app.include_router(tasks.router)
app.include_router(export.router)
app.include_router(purchase.router)
app.include_router(purchase_orders.router)
app.include_router(delivery_assignments.router)

# ----------------------------------------------------
# Health Routes
# ----------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "PharmaCore360 Backend Running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

