from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from datetime import date as DateClass
from typing import Optional, Literal
from decimal import Decimal


class TransactionBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    amount: Decimal = Field(..., gt=0, max_digits=12, decimal_places=2)
    description: str = Field(..., min_length=1, max_length=255)
    transaction_type: Literal["income", "expense"]
    category_id: Optional[str] = None


class TransactionCreate(TransactionBase):
    date: Optional[DateClass] = None


class TransactionUpdate(BaseModel):
    amount: Optional[Decimal] = Field(None, gt=0, max_digits=12, decimal_places=2)
    description: Optional[str] = Field(None, min_length=1, max_length=255)
    transaction_type: Optional[Literal["income", "expense"]] = None
    category_id: Optional[str] = None
    date: Optional[DateClass] = None


class CategorySummary(BaseModel):
    id: str
    name: str
    color: str
    icon: str


class TransactionResponse(TransactionBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    date: DateClass
    created_at: datetime
    updated_at: datetime
    category: Optional[CategorySummary] = None


class TransactionFilter(BaseModel):
    transaction_type: Optional[Literal["income", "expense"]] = None
    category_id: Optional[str] = None
    search: Optional[str] = None
    start_date: Optional[DateClass] = None
    end_date: Optional[DateClass] = None
    skip: int = 0
    limit: int = 100
