from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.services.transaction_service import TransactionService
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse, TransactionFilter

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=List[TransactionResponse])
async def list_transactions(
    transaction_type: str = Query(None, description="Filter by transaction type (income/expense)"),
    category_id: str = Query(None, description="Filter by category ID"),
    search: str = Query(None, description="Search by description"),
    start_date: str = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(None, description="End date (YYYY-MM-DD)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List all transactions with optional filtering."""
    from datetime import datetime

    filters = TransactionFilter(
        transaction_type=transaction_type,
        category_id=category_id,
        search=search,
        start_date=datetime.strptime(start_date, "%Y-%m-%d").date() if start_date else None,
        end_date=datetime.strptime(end_date, "%Y-%m-%d").date() if end_date else None,
        skip=skip,
        limit=limit,
    )

    service = TransactionService(db)
    transactions = await service.get_all(filters)
    return transactions


@router.post("", response_model=TransactionResponse, status_code=201)
async def create_transaction(
    transaction_data: TransactionCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new transaction."""
    service = TransactionService(db)
    transaction = await service.create(transaction_data)
    return transaction


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a transaction by ID."""
    service = TransactionService(db)
    transaction = await service.get_by_id(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: str,
    transaction_data: TransactionUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a transaction."""
    service = TransactionService(db)
    transaction = await service.update(transaction_id, transaction_data)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@router.delete("/{transaction_id}", status_code=204)
async def delete_transaction(
    transaction_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Delete a transaction."""
    service = TransactionService(db)
    deleted = await service.delete(transaction_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return None
