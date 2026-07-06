from app.database import SessionLocal

from app.models.store import Store
from app.models.user import User
from app.models.daily_report import DailyReport
from app.core.security import hash_password
from app.models.expense import Expense
from app.models.bounced_product import BouncedProduct
from app.models.adjustment_request import AdjustmentRequest
db = SessionLocal()

# --------------------------------------------------
# Get Existing Stores
# --------------------------------------------------

sector7 = db.query(Store).filter(Store.code == "SEC7").first()
sector12 = db.query(Store).filter(Store.code == "SEC12").first()
sector4 = db.query(Store).filter(Store.code == "SEC4").first()
sector22 = db.query(Store).filter(Store.code == "SEC22").first()
sector109 = db.query(Store).filter(Store.code == "SEC109").first()

print("✓ Stores loaded")

# --------------------------------------------------
# Create Staff Users (Only Once)
# --------------------------------------------------

existing = db.query(User).filter(User.role == "staff").count()

if existing == 0:

    print("Creating staff users...")

    users = [

        User(
            full_name="Sector 7 Staff",
            username="sec7",
            password=hash_password("123456"),
            role="staff",
            store_id=sector7.id,
        ),

        User(
            full_name="Sector 12 Staff",
            username="sec12",
            password=hash_password("123456"),
            role="staff",
            store_id=sector12.id,
        ),

        User(
            full_name="Sector 4 Staff",
            username="sec4",
            password=hash_password("123456"),
            role="staff",
            store_id=sector4.id,
        ),

        User(
            full_name="Sector 22 Staff",
            username="sec22",
            password=hash_password("123456"),
            role="staff",
            store_id=sector22.id,
        ),

        User(
            full_name="Sector 109 Staff",
            username="sec109",
            password=hash_password("123456"),
            role="staff",
            store_id=sector109.id,
        ),

    ]

    db.add_all(users)
    db.commit()

    print("✓ Staff users created")

else:

    print("✓ Staff users already exist")


from datetime import date

owner = db.query(User).filter(User.username == "admin").first()

existing_report = (
    db.query(DailyReport)
    .filter(DailyReport.store_id == sector7.id)
    .first()
)

if not existing_report:
    report1 = DailyReport(
        store_id=sector7.id,
        submitted_by=owner.id,
        total_bills=234,
        deliveries=18,
        cash_sales=82000,
        upi_sales=28500,
        card_sales=10150,
        udhaar_sales=4500,
        total_expenses=4850,
        total_purchases=28400,
        notes="""
Delivery van had a flat tyre this morning...
"""
    )

    db.add(report1)
    db.commit()
    db.refresh(report1)

    print("Sector 7 report created.")

else:
    print("Sector 7 report already exists.")

bounced_products = [

    BouncedProduct(
        daily_report_id=report1.id,
        product_name="Metformin 500mg",
        quantity=50
    ),

    BouncedProduct(
        daily_report_id=report1.id,
        product_name="Azithromycin 250mg",
        quantity=20
    ),

    BouncedProduct(
        daily_report_id=report1.id,
        product_name="Insulin Glargine",
        quantity=10
    ),

    BouncedProduct(
        daily_report_id=report1.id,
        product_name="Pantoprazole 40mg",
        quantity=30
    ),

    BouncedProduct(
        daily_report_id=report1.id,
        product_name="Cetirizine 10mg",
        quantity=100
    ),
]

db.add_all(bounced_products)
db.commit()

print("Bounced products created.")

adjustments = [

    AdjustmentRequest(
        daily_report_id=report1.id,
        requested_by=owner.id,
        field_name="cash_sales",
        old_value="92000",
        new_value="91500",
        reason="Cash counting correction",
        status="pending"
    ),

    AdjustmentRequest(
        daily_report_id=report1.id,
        requested_by=owner.id,
        field_name="bill_count",
        old_value="230",
        new_value="234",
        reason="Missed invoices",
        status="approved"
    ),

    AdjustmentRequest(
        daily_report_id=report1.id,
        requested_by=owner.id,
        field_name="total_expenses",
        old_value="5000",
        new_value="4850",
        reason="Duplicate expense removed",
        status="rejected"
    ),
]

db.add_all(adjustments)
db.commit()

print("Adjustment requests created.")

print("Sector 7 report created.")
db.close()