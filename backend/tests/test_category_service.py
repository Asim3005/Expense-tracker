import pytest
from sqlalchemy import select

from app.services.category_service import CategoryService
from app.schemas.category import CategoryCreate, CategoryUpdate


@pytest.mark.asyncio
async def test_get_all_categories(test_db, sample_category):
    """Test getting all categories."""
    service = CategoryService(test_db)
    categories = await service.get_all()

    assert len(categories) >= 1
    assert categories[0].id == sample_category.id


@pytest.mark.asyncio
async def test_get_category_by_id(test_db, sample_category):
    """Test getting a category by ID."""
    service = CategoryService(test_db)
    category = await service.get_by_id(sample_category.id)

    assert category is not None
    assert category.id == sample_category.id
    assert category.name == "Test Category"


@pytest.mark.asyncio
async def test_get_nonexistent_category(test_db):
    """Test getting a non-existent category."""
    service = CategoryService(test_db)
    category = await service.get_by_id("nonexistent-id")

    assert category is None


@pytest.mark.asyncio
async def test_create_category(test_db):
    """Test creating a new category."""
    service = CategoryService(test_db)
    category_data = CategoryCreate(
        name="New Category",
        color="#00ff00",
        icon="new",
    )

    category = await service.create(category_data)

    assert category.id is not None
    assert category.name == "New Category"
    assert category.color == "#00ff00"
    assert category.icon == "new"


@pytest.mark.asyncio
async def test_update_category(test_db, sample_category):
    """Test updating a category."""
    service = CategoryService(test_db)
    update_data = CategoryUpdate(name="Updated Category")

    category = await service.update(sample_category.id, update_data)

    assert category is not None
    assert category.name == "Updated Category"
    assert category.color == sample_category.color  # Unchanged


@pytest.mark.asyncio
async def test_update_nonexistent_category(test_db):
    """Test updating a non-existent category."""
    service = CategoryService(test_db)
    update_data = CategoryUpdate(name="Updated")

    category = await service.update("nonexistent-id", update_data)

    assert category is None


@pytest.mark.asyncio
async def test_delete_category(test_db, sample_category):
    """Test deleting a category."""
    service = CategoryService(test_db)
    result = await service.delete(sample_category.id)

    assert result is True

    # Verify it's deleted
    deleted = await service.get_by_id(sample_category.id)
    assert deleted is None


@pytest.mark.asyncio
async def test_delete_nonexistent_category(test_db):
    """Test deleting a non-existent category."""
    service = CategoryService(test_db)
    result = await service.delete("nonexistent-id")

    assert result is False
