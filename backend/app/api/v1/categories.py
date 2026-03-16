from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.services.category_service import CategoryService
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=List[CategoryResponse])
async def list_categories(
    db: AsyncSession = Depends(get_db),
):
    """List all categories."""
    service = CategoryService(db)
    categories = await service.get_all()
    return categories


@router.post("", response_model=CategoryResponse, status_code=201)
async def create_category(
    category_data: CategoryCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new category."""
    service = CategoryService(db)
    category = await service.create(category_data)
    return category


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a category by ID."""
    service = CategoryService(db)
    category = await service.get_by_id(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    category_data: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a category."""
    service = CategoryService(db)
    category = await service.update(category_id, category_data)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.delete("/{category_id}", status_code=204)
async def delete_category(
    category_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Delete a category."""
    service = CategoryService(db)
    deleted = await service.delete(category_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Category not found")
    return None
