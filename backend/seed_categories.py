"""Seed default categories for the Finance Tracker."""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.models.category import Category
from app.config import settings
import uuid

# Default categories
DEFAULT_CATEGORIES = [
    # Income categories
    {"name": "Salary", "color": "#10b981", "icon": "briefcase"},
    {"name": "Freelance", "color": "#3b82f6", "icon": "laptop"},
    {"name": "Investment", "color": "#8b5cf6", "icon": "trending-up"},
    # Expense categories
    {"name": "Food", "color": "#f59e0b", "icon": "utensils"},
    {"name": "Transportation", "color": "#64748b", "icon": "car"},
    {"name": "Housing", "color": "#3b82f6", "icon": "home"},
    {"name": "Entertainment", "color": "#ec4899", "icon": "film"},
    {"name": "Shopping", "color": "#f97316", "icon": "shopping-bag"},
    {"name": "Health", "color": "#ef4444", "icon": "heart"},
]


async def seed_categories():
    """Seed default categories to the database."""
    # Create database engine
    engine = create_async_engine(settings.database_url)
    async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    async with async_session() as session:
        # Check if categories already exist
        from sqlalchemy import select

        result = await session.execute(select(Category))
        existing_categories = result.scalars().all()

        if existing_categories:
            print(f"Found {len(existing_categories)} existing categories.")
            for cat in existing_categories:
                print(f"  - {cat.name}")
            confirm = input("Do you want to continue adding default categories? (y/n): ")
            if confirm.lower() != 'y':
                print("Aborting.")
                return

        # Add default categories
        for cat_data in DEFAULT_CATEGORIES:
            # Check if category already exists
            result = await session.execute(
                select(Category).where(Category.name == cat_data["name"])
            )
            existing = result.scalar_one_or_none()

            if existing:
                print(f"Skipping: Category '{cat_data['name']}' already exists.")
                continue

            category = Category(
                id=str(uuid.uuid4()),
                name=cat_data["name"],
                color=cat_data["color"],
                icon=cat_data["icon"],
            )
            session.add(category)
            print(f"Added: {cat_data['name']}")

        await session.commit()
        print("\nCategory seeding complete!")


if __name__ == "__main__":
    print("Seeding default categories...")
    asyncio.run(seed_categories())
