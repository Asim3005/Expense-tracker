from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, func
from sqlalchemy.orm import selectinload
from typing import List, Optional

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> List[Category]:
        """Get all categories."""
        result = await self.db.execute(select(Category))
        return result.scalars().all()

    async def get_by_id(self, category_id: str) -> Optional[Category]:
        """Get a category by ID."""
        result = await self.db.execute(
            select(Category).where(Category.id == category_id)
        )
        return result.scalar_one_or_none()

    async def create(self, category_data: CategoryCreate) -> Category:
        """Create a new category."""
        import uuid

        db_category = Category(
            id=str(uuid.uuid4()),
            name=category_data.name,
            color=category_data.color,
            icon=category_data.icon,
        )
        self.db.add(db_category)
        await self.db.commit()
        await self.db.refresh(db_category)
        return db_category

    async def update(self, category_id: str, category_data: CategoryUpdate) -> Optional[Category]:
        """Update a category."""
        db_category = await self.get_by_id(category_id)
        if not db_category:
            return None

        update_data = category_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_category, field, value)

        await self.db.commit()
        await self.db.refresh(db_category)
        return db_category

    async def delete(self, category_id: str) -> bool:
        """Delete a category."""
        db_category = await self.get_by_id(category_id)
        if not db_category:
            return False

        await self.db.execute(delete(Category).where(Category.id == category_id))
        await self.db.commit()
        return True
