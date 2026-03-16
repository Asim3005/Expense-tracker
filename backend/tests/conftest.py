import pytest
import sys
from pathlib import Path

# Add parent directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.models import Category, Transaction
from app.database import TransactionType


# Test database URL (SQLite for testing)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture
async def test_db():
    """Create a test database session."""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async_session_maker = async_sessionmaker(
        engine, expire_on_commit=False, class_=AsyncSession
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def client(test_db):
    """Create an async test client."""
    async def override_get_db():
        yield test_db

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest.fixture
async def sample_category(test_db):
    """Create a sample category."""
    import uuid

    category = Category(
        id=str(uuid.uuid4()),
        name="Test Category",
        color="#ff0000",
        icon="test",
    )
    test_db.add(category)
    await test_db.commit()
    await test_db.refresh(category)
    return category


@pytest.fixture
async def sample_transaction(test_db, sample_category):
    """Create a sample transaction."""
    import uuid
    from datetime import datetime
    from datetime import date as DateClass

    transaction = Transaction(
        id=str(uuid.uuid4()),
        amount=100.50,
        description="Test transaction",
        transaction_type=TransactionType.EXPENSE,
        category_id=sample_category.id,
        date=DateClass.today(),
    )
    test_db.add(transaction)
    await test_db.commit()
    await test_db.refresh(transaction)
    return transaction
