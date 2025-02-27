from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

SQLALCHMEY_DATABASE_URL = os.getenv("SQLALCHMEY_DATABASE_URL")
engine = create_async_engine(SQLALCHMEY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

async def create_table():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db() -> AsyncSession: #type: ignore
    async with SessionLocal() as db:
        try:
            yield db
        finally:
            await db.close()