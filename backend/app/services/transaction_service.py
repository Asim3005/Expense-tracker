from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, and_, or_, desc
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime
from datetime import date as DateClass
from decimal import Decimal

from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionFilter
from app.database import TransactionType


class TransactionService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, filters: Optional[TransactionFilter] = None) -> List[Transaction]:
        """Get all transactions with optional filtering."""
        query = select(Transaction).options(selectinload(Transaction.category))

        if filters:
            if filters.transaction_type:
                query = query.where(Transaction.transaction_type == filters.transaction_type.value)
            if filters.category_id:
                query = query.where(Transaction.category_id == filters.category_id)
            if filters.search:
                search_term = f"%{filters.search}%"
                query = query.where(Transaction.description.ilike(search_term))
            if filters.start_date:
                query = query.where(Transaction.date >= filters.start_date)
            if filters.end_date:
                query = query.where(Transaction.date <= filters.end_date)

        query = query.order_by(desc(Transaction.date), desc(Transaction.created_at))

        if filters:
            query = query.offset(filters.skip).limit(filters.limit)

        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_by_id(self, transaction_id: str) -> Optional[Transaction]:
        """Get a transaction by ID."""
        result = await self.db.execute(
            select(Transaction)
            .options(selectinload(Transaction.category))
            .where(Transaction.id == transaction_id)
        )
        return result.scalar_one_or_none()

    async def create(self, transaction_data: TransactionCreate) -> Transaction:
        """Create a new transaction."""
        import uuid

        db_transaction = Transaction(
            id=str(uuid.uuid4()),
            amount=float(transaction_data.amount),
            description=transaction_data.description,
            transaction_type=TransactionType(transaction_data.transaction_type),
            category_id=transaction_data.category_id,
            date=transaction_data.date if transaction_data.date else DateClass.today(),
        )
        self.db.add(db_transaction)
        await self.db.commit()
        await self.db.refresh(db_transaction)
        return db_transaction

    async def update(self, transaction_id: str, transaction_data: TransactionUpdate) -> Optional[Transaction]:
        """Update a transaction."""
        db_transaction = await self.get_by_id(transaction_id)
        if not db_transaction:
            return None

        update_data = transaction_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == "amount":
                setattr(db_transaction, field, float(value))
            elif field == "transaction_type":
                setattr(db_transaction, field, TransactionType(value))
            else:
                setattr(db_transaction, field, value)

        await self.db.commit()
        await self.db.refresh(db_transaction)
        return db_transaction

    async def delete(self, transaction_id: str) -> bool:
        """Delete a transaction."""
        db_transaction = await self.get_by_id(transaction_id)
        if not db_transaction:
            return False

        await self.db.execute(delete(Transaction).where(Transaction.id == transaction_id))
        await self.db.commit()
        return True
