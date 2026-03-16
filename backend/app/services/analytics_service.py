from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, extract
from sqlalchemy.orm import selectinload
from typing import List, Dict, Optional
from datetime import datetime
from datetime import date as DateClass

from app.models.transaction import Transaction
from app.database import TransactionType
from decimal import Decimal


class AnalyticsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_summary(
        self,
        start_date: Optional[DateClass] = None,
        end_date: Optional[DateClass] = None,
    ) -> Dict:
        """Get financial summary: balance, total income, total expenses."""
        base_query = select(Transaction)

        if start_date:
            base_query = base_query.where(Transaction.date >= start_date)
        if end_date:
            base_query = base_query.where(Transaction.date <= end_date)

        # Calculate total income
        income_query = select(func.sum(Transaction.amount)).where(
            and_(
                Transaction.transaction_type == TransactionType.income,
                Transaction.date >= start_date if start_date else True,
                Transaction.date <= end_date if end_date else True,
            )
        )
        income_result = await self.db.execute(income_query)
        total_income = income_result.scalar() or Decimal("0")

        # Calculate total expenses
        expense_query = select(func.sum(Transaction.amount)).where(
            and_(
                Transaction.transaction_type == TransactionType.expense,
                Transaction.date >= start_date if start_date else True,
                Transaction.date <= end_date if end_date else True,
            )
        )
        expense_result = await self.db.execute(expense_query)
        total_expenses = expense_result.scalar() or Decimal("0")

        # Calculate balance
        balance = total_income - total_expenses

        return {
            "balance": float(balance),
            "total_income": float(total_income),
            "total_expenses": float(total_expenses),
        }

    async def get_spending_by_category(
        self,
        start_date: Optional[DateClass] = None,
        end_date: Optional[DateClass] = None,
    ) -> List[Dict]:
        """Get spending breakdown by category."""
        from app.models.category import Category

        query = (
            select(
                Category.id,
                Category.name,
                Category.color,
                Category.icon,
                func.sum(Transaction.amount).label("total"),
            )
            .join(Transaction, Transaction.category_id == Category.id)
            .where(Transaction.transaction_type == TransactionType.expense)
        )

        if start_date:
            query = query.where(Transaction.date >= start_date)
        if end_date:
            query = query.where(Transaction.date <= end_date)

        query = query.group_by(Category.id, Category.name, Category.color, Category.icon)
        query = query.order_by(func.sum(Transaction.amount).desc())

        result = await self.db.execute(query)
        rows = result.all()

        return [
            {
                "category_id": row.id,
                "category_name": row.name,
                "category_color": row.color,
                "category_icon": row.icon,
                "amount": float(row.total),
            }
            for row in rows
        ]

    async def get_monthly_trend(
        self,
        months: int = 12,
    ) -> List[Dict]:
        """Get monthly income and expense trends."""
        query = (
            select(
                extract("year", Transaction.date).label("year"),
                extract("month", Transaction.date).label("month"),
                Transaction.transaction_type,
                func.sum(Transaction.amount).label("total"),
            )
            .group_by(
                extract("year", Transaction.date),
                extract("month", Transaction.date),
                Transaction.transaction_type,
            )
            .order_by(
                extract("year", Transaction.date).desc(),
                extract("month", Transaction.date).desc(),
            )
            .limit(months * 2)  # months * 2 (income and expense)
        )

        result = await self.db.execute(query)
        rows = result.all()

        monthly_data = {}
        for row in rows:
            key = f"{int(row.year)}-{int(row.month):02d}"
            if key not in monthly_data:
                monthly_data[key] = {
                    "month": key,
                    "income": 0.0,
                    "expenses": 0.0,
                }

            if row.transaction_type == TransactionType.income:
                monthly_data[key]["income"] = float(row.total)
            else:
                monthly_data[key]["expenses"] = float(row.total)

        # Convert to list sorted by date
        return sorted(monthly_data.values(), key=lambda x: x["month"], reverse=True)
