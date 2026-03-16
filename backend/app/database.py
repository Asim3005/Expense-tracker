from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, DateTime, Numeric, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from datetime import datetime
import enum
import uuid

from app.config import settings


class TransactionType(str, enum.Enum):
    income = "income"
    expense = "expense"


# Use String instead of Enum for better compatibility
TransactionTypeEnum = String(10)


engine = create_async_engine(settings.database_url, echo=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
