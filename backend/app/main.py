from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models.store import Store
from app.routes.auth import router as auth_router
from app.routes.stores import router as store_router
from app.routes.users import router as user_router
from app.models.daily_report import DailyReport
from app.routes.daily_reports import router as daily_report_router 
from app.models.expense import Expense 
from app.routes.expenses import router as expense_router
from app.models.delivery import Delivery
from app.routes.deliveries import router as delivery_router
from app.models.bounced_product import BouncedProduct
from app.routes.bounced_products import router as bounced_product_router
from app.routes import udhaar
from app.routes import adjustments
from app.models.udhaar_entry import UdhaarEntry
from app.models.adjustment_request import AdjustmentRequest
from app.models.audit_log import AuditLog
from app.routes import audit_logs
from app.models.product import Product
from app.routes import products
from app.routes import analytics
from app.models.task_target import TaskTarget
from app.routes import task_targets
from app.routes import export
from app.models.purchase import Purchase
from app.routes import purchase

app = FastAPI()
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
app.include_router(task_targets.router)
app.include_router(export.router)
Base.metadata.create_all(bind=engine)
app.include_router(purchase.router)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def home():
    return {"message": "PharmaCore360 Backend Running"}


@app.get("/health")

    
def health():
    return {"status": "healthy"}