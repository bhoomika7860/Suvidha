import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine

# ----------------------------------------------------
# Import models so SQLAlchemy creates tables
# ----------------------------------------------------

from app.models.store import Store
from app.models.daily_report import DailyReport
from app.models.expense import Expense
from app.models.delivery import Delivery
from app.models.cash_denomination import CashDenomination
from app.models.udhaar_entry import UdhaarEntry
from app.models.adjustment_request import AdjustmentRequest
from app.models.audit_log import AuditLog
from app.models.product import Product
from app.models.task import Task
from app.models.purchase import Purchase
from app.models.purchase_order import PurchaseOrder
from app.models.supplier import Supplier
from app.models.purchase_order_item import PurchaseOrderItem
from app.models.payment_machine import PaymentMachine
from app.models.payment_machine_entry import PaymentMachineEntry

# ----------------------------------------------------
# Import routers
# ----------------------------------------------------

from app.routes.auth import router as auth_router
from app.routes.stores import router as store_router
from app.routes.users import router as user_router
from app.routes.daily_reports import router as daily_report_router
from app.routes.expenses import router as expense_router
from app.routes.deliveries import router as delivery_router

from app.routes import (
    cash_denominations,
    payment_machine_entries,
    udhaar,
    adjustments,
    audit_logs,
    products,
    analytics,
    tasks,
    export,
    purchase,
    purchase_orders,
    payment_machines,
    delivery_assignments,
    suppliers,
)

# ----------------------------------------------------
# Create FastAPI app
# ----------------------------------------------------

app = FastAPI(
    title="Suvidha API"
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
    allow_origins=[
        "https://suvidha-flax.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# Create database tables
# ----------------------------------------------------

print("Creating database tables...")

Base.metadata.create_all(
    bind=engine
)

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

app.include_router(udhaar.router)
app.include_router(adjustments.router)
app.include_router(audit_logs.router)
app.include_router(products.router)
app.include_router(analytics.router)
app.include_router(tasks.router)
app.include_router(export.router)

app.include_router(purchase.router)
app.include_router(purchase_orders.router)
app.include_router(suppliers.router)

app.include_router(delivery_assignments.router)
app.include_router(cash_denominations.router)
app.include_router(payment_machines.router)
app.include_router(payment_machine_entries.router)

# ----------------------------------------------------
# Health Routes
# ----------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Suvidha Backend Running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }