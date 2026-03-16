import pytest
from datetime import datetime
from datetime import date as DateClass

from app.services.transaction_service import TransactionService
from app.schemas.transaction import TransactionCreate, TransactionUpdate
from app.database import TransactionType


@pytest.mark.asyncio
async def test_get_all_transactions(test_db, sample_transaction):
    """Test getting all transactions."""
    service = TransactionService(test_db)
    transactions = await service.get_all()

    assert len(transactions) >= 1
    assert transactions[0].id == sample_transaction.id


@pytest.mark.asyncio
async def test_get_transaction_by_id(test_db, sample_transaction):
    """Test getting a transaction by ID."""
    service = TransactionService(test_db)
    transaction = await service.get_by_id(sample_transaction.id)

    assert transaction is not None
    assert transaction.id == sample_transaction.id
    assert transaction.description == "Test transaction"


@pytest.mark.asyncio
async def test_get_nonexistent_transaction(test_db):
    """Test getting a non-existent transaction."""
    service = TransactionService(test_db)
    transaction = await service.get_by_id("nonexistent-id")

    assert transaction is None


@pytest.mark.asyncio
async def test_create_transaction(test_db, sample_category):
    """Test creating a new transaction."""
    service = TransactionService(test_db)
    transaction_data = TransactionCreate(
        amount=75.25,
        description="New transaction",
        transaction_type="income",
        category_id=sample_category.id,
        date=DateClass.today(),
    )

    transaction = await service.create(transaction_data)

    assert transaction.id is not None
    assert float(transaction.amount) == 75.25
    assert transaction.description == "New transaction"
    assert transaction.transaction_type == TransactionType.INCOME
    assert transaction.category_id == sample_category.id


@pytest.mark.asyncio
async def test_update_transaction(test_db, sample_transaction):
    """Test updating a transaction."""
    service = TransactionService(test_db)
    update_data = TransactionUpdate(
        amount=150.00,
        description="Updated transaction"
    )

    transaction = await service.update(sample_transaction.id, update_data)

    assert transaction is not None
    assert float(transaction.amount) == 150.00
    assert transaction.description == "Updated transaction"


@pytest.mark.asyncio
async def test_update_nonexistent_transaction(test_db):
    """Test updating a non-existent transaction."""
    service = TransactionService(test_db)
    update_data = TransactionUpdate(amount=100.00)

    transaction = await service.update("nonexistent-id", update_data)

    assert transaction is None


@pytest.mark.asyncio
async def test_delete_transaction(test_db, sample_transaction):
    """Test deleting a transaction."""
    service = TransactionService(test_db)
    result = await service.delete(sample_transaction.id)

    assert result is True

    # Verify it's deleted
    deleted = await service.get_by_id(sample_transaction.id)
    assert deleted is None


@pytest.mark.asyncio
async def test_delete_nonexistent_transaction(test_db):
    """Test deleting a non-existent transaction."""
    service = TransactionService(test_db)
    result = await service.delete("nonexistent-id")

    assert result is False
