from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.supplier import Supplier

from app.schemas.supplier import (
    SupplierCreate,
    SupplierUpdate,
    SupplierResponse,
)

from app.dependencies.auth import get_current_user


router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"],
)


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


def require_owner(current_user):
    if current_user.role != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the owner can manage suppliers.",
        )

    return current_user


def ensure_suppliers_seeded(db: Session):
    existing_count = db.query(Supplier).count()

    if existing_count > 0:
        return

    for name in SUPPLIERS:
        db.add(
            Supplier(
                name=name,
                is_active=True,
            )
        )

    db.commit()


# ---------------------------------------------------------
# GET ACTIVE SUPPLIERS
# ---------------------------------------------------------

@router.get(
    "/",
    response_model=list[SupplierResponse],
)
def get_suppliers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    ensure_suppliers_seeded(db)

    suppliers = (
        db.query(Supplier)
        .filter(
            Supplier.is_active == True
        )
        .order_by(Supplier.name.asc())
        .all()
    )

    return suppliers


# ---------------------------------------------------------
# GET ALL SUPPLIERS
# Owner only
# ---------------------------------------------------------

@router.get(
    "/all",
    response_model=list[SupplierResponse],
)
def get_all_suppliers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_owner(current_user)

    ensure_suppliers_seeded(db)

    suppliers = (
        db.query(Supplier)
        .order_by(Supplier.name.asc())
        .all()
    )

    return suppliers


# ---------------------------------------------------------
# CREATE SUPPLIER
# Owner only
# ---------------------------------------------------------

@router.post(
    "/",
    response_model=SupplierResponse,
)
def create_supplier(
    data: SupplierCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_owner(current_user)

    name = data.name.strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Supplier name cannot be empty.",
        )

    existing = (
        db.query(Supplier)
        .filter(
            Supplier.name.ilike(name)
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Supplier already exists.",
        )

    supplier = Supplier(
        name=name,
        is_active=True,
    )

    db.add(supplier)
    db.commit()
    db.refresh(supplier)

    return supplier


# ---------------------------------------------------------
# UPDATE SUPPLIER
# Owner only
# ---------------------------------------------------------

@router.put(
    "/{supplier_id}",
    response_model=SupplierResponse,
)
def update_supplier(
    supplier_id: int,
    data: SupplierUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_owner(current_user)

    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.id == supplier_id
        )
        .first()
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found.",
        )

    if data.name is not None:
        name = data.name.strip()

        if not name:
            raise HTTPException(
                status_code=400,
                detail="Supplier name cannot be empty.",
            )

        duplicate = (
            db.query(Supplier)
            .filter(
                Supplier.name.ilike(name),
                Supplier.id != supplier_id,
            )
            .first()
        )

        if duplicate:
            raise HTTPException(
                status_code=400,
                detail="Another supplier with this name already exists.",
            )

        supplier.name = name

    if data.is_active is not None:
        supplier.is_active = data.is_active

    db.commit()
    db.refresh(supplier)

    return supplier