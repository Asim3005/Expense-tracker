from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


class CategoryBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str = Field(..., min_length=1, max_length=100)
    color: str = Field(default="#6366f1", pattern=r"^#[0-9A-Fa-f]{6}$")
    icon: str = Field(default="tag", max_length=50)


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    color: Optional[str] = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")
    icon: Optional[str] = Field(None, max_length=50)


class CategoryResponse(CategoryBase):
    id: str
    created_at: datetime
    updated_at: datetime
