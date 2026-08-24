from sqlalchemy import inspect

from app.database import (
    SessionLocal,
    Base,
    engine,
)

# ---------------------------------------------------------
# Import ALL models before creating tables.
# This ensures SQLAlchemy knows about every table.
# ---------------------------------------------------------

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


SUPPLIERS = [
    "AARBRO AGENCIES PRIVATE LIMITED",
    "ABHAY MEDICAL HALL",
    "ADITYA ENTERPRISES",
    "ADLAKHA & SONS",
    "AGGARWAL MEDIWAYS",
    "AKLAVYA ENTERPRISES",
    "AMAZON DISTRIBUTORS P LTD.",
    "ANUGRAHITA ENTERPRISES PRIVATE LIMITED",
    "AROSA BIOTECH PRIVATE LIMITED",
    "AROWANA HEALTHCARE PRIVATE LIMITED",
    "AUSGEN PHARMACEUTICALS",
    "BALAJI PHARMA",
    "BANTI PHARMA PRIVATE LIMITED",
    "BESTIME TRADING COMPANY PRIVATE LIMITED",
    "BHARTI DISTRIBUTORS",
    "BHARTI MEDICAL AGENCIES",
    "BIOSTEVE HEALTHCARE",
    "BIOTECH (INDIA) PHARMACEUTICALS",
    "CHANCHAL PHARMA",
    "CHANDRASEKHRA PHARMA PVT LTD",
    "CITY DISTRIBUTORS",
    "D & D SALES AGENCY",
    "D Y SURGICAL",
    "D. C. AGENCIES PRIVATE LIMITED",
    "DAANYA PHARMA PRIVATE LIMITED",
    "DAPSON INDUSTRIES",
    "DELHI PHARMA AGENCIES",
    "DEV TRADING COMPANY",
    "DOCXIS LIFE SCIENCES PRIVATE LIMITED",
    "FARMAVIBE LLP",
    "FBF ENTERPRISES",
    "G.S TRADERS",
    "GARG ENTERPRISES",
    "GAYATRI ASSOCIATES",
    "GAYATRI ENTERPRISES",
    "GAYTRI ENTERPRISES",
    "GLOBBUS INDIA",
    "GOYAL TRADERS",
    "GUPTA AGENCIES",
    "GURU KRIPA SURGICAL",
    "GURU KRIPA TRADERS",
    "GURUNANAK DEV AGENCY",
    "INSTANT SWIFT OVERSEAS PRIVATE LIMITED",
    "J.R.SACHDEVA MARKETING",
    "JAGGI ENTERPRISES PRIVATE LIMITED",
    "JAI SHRI RAM TRADERS",
    "JAICHANDA PHARMA",
    "JAIN PAPERS",
    "JATIN ENTERPRISES",
    "JAYANTI MEDICAL AGENCY LLP",
    "JMD ENTERPRISES",
    "JOSHI PHARMA",
    "K.D.SOLUTIONS",
    "KAMINI ENTERPRISES",
    "LAL SONS",
    "LAXMI & COMPANY",
    "LAXMI ENTERPRISES",
    "LENITIVE ORGANICS",
    "LEVIKAS ENTERPRISES PRIVATE LIMITED",
    "LIFE CARE",
    "LIFELINE PHARMA DISTRIBUTORS PRIVATE LIMITED",
    "LIVEAID PHARMACEUTICALS",
    "LUCKY PHARMA LOGISTICS PRIVATE LIMITED",
    "M. K. ENTERPRISES",
    "M.S MEDICOS",
    "M/S SAVEX PHARMA",
    "MEDIGLOBE PHARMA",
    "MEDISAMY LLP",
    "MEDISTE PHARMACEUTICAL PRIVATE LIMITED",
    "MEDIWEST LIFE CARE PRIVATE LIMITED",
    "METRO MARKETING",
    "MUKUL COSMETICS",
    "N KRISHNA PHARMACEUTICAL & RESEARCH CO",
    "N.A.K. PHARMA",
    "NAMAN PHARMACEUTICALS",
    "NAM-ENT FMCG PRIVATE LIMITED",
    "NARULA ASSOCIATES",
    "NATIONAL UDYOG",
    "NATURE PHARMA",
    "NAVEEN ENTERPRISES",
    "NAVYA BIOTECH",
    "NEELKANTH PHARMA LOGISTICS PRIVATE LIMITED",
    "NIRMAL AGENCIES",
    "NUTRIX HEALTH CARE PVT LTD",
    "OM AGENCIES",
    "ORCHEM LABORATORIES",
    "P.S. PHARMA",
    "PHARMA CUBE",
    "PHARMA DISTRIBUTORS",
    "PHARMEX ENTERPRISES",
    "POOJA TRADING COMPANY",
    "PRESCRIPTION PHARMACY HO",
    "QNT SPORT INDIA PRIVATE LIMITED",
    "RAVI ENTERPRISES",
    "REBELLION COSMETICS PRIVATE LIMITED",
    "RESOURCE LIFESCIENCES",
    "RIDHI SURGICAL",
    "RS ENTERPRISES",
    "S N PHARMA",
    "S. N. ENTERPRISES",
    "S.K. SALES",
    "S.S. ENTERPRISES",
    "SAI PHARMA",
    "SAI RK PHARMA PRIVATE LIMITED",
    "SAI TRADERS",
    "SAVEX PHARMACEUTICALS",
    "SAVIOUR AGENCIES PRIVATE LIMITED",
    "SEHGAL MEDICAL AGENCIES",
    "SHIV SHAKTI TRADING COMPANY",
    "SHIV SHANKAR ENTERPRISES",
    "SHREE SHYAM MEDIWAYS PRIVATE LIMITED",
    "SHRI THAKRAN ENTERPRISES",
    "SKINZYMES INNOVATION PRIVATE LIMITED",
    "SL ENTERPRISES",
    "SRS ENTERPRISES",
    "SRS UNIFOODS CORP",
    "SURGICAL WALA",
    "V S HEALTHCARE",
    "VARDHMAN ENTERPRISES",
    "VIDKRIS RETAIL STORES PRIVATE LIMITED",
    "VINAYAK ENTERPRISES",
    "WALIA TRADERS",
    "XYMERA BIOSCIENCE PRIVATE LIMITED",
    "ZYDOVA HEALTHCARE PRIVATE LIMTED",
]


def seed_suppliers():
    db = SessionLocal()

    try:
        added = 0
        skipped = 0

        for name in SUPPLIERS:

            existing = (
                db.query(Supplier)
                .filter(
                    Supplier.name.ilike(name)
                )
                .first()
            )

            if existing:
                skipped += 1
                continue

            supplier = Supplier(
                name=name,
                is_active=True,
            )

            db.add(supplier)
            added += 1

        db.commit()

        print(
            f"Supplier seed complete. "
            f"Added: {added}, "
            f"Skipped existing: {skipped}"
        )

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":

    print(
        "DATABASE URL:",
        engine.url
    )

    print(
        "Creating database tables..."
    )

    Base.metadata.create_all(
        bind=engine
    )

    print(
        "Checking database tables..."
    )

    inspector = inspect(engine)

    tables = inspector.get_table_names()

    print(
        "Tables:",
        tables
    )

    if "suppliers" not in tables:
        raise RuntimeError(
            "The suppliers table was not created. "
            "Check the database configuration and Supplier model."
        )

    seed_suppliers()