from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import DATABASE_URL
import os


print("DATABASE PATH:")
print(os.path.abspath("pharmacore.db"))
engine = create_engine(DATABASE_URL)
print("Current working directory:", os.getcwd())
print("Absolute DB path:", os.path.abspath("pharmacore.db"))
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()