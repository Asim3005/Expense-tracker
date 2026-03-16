import uuid
from sqlalchemy import String, DateTime, Numeric, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base, TransactionTypeEnum


class Transaction(Base):
    __tablename__ = "transactions"

    id = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    amount = mapped_column(Numeric(12, 2), nullable=False)
    description = mapped_column(String(255), nullable=False)
    transaction_type = mapped_column(TransactionTypeEnum, nullable=False)
    category_id = mapped_column(String(36), ForeignKey("categories.id"), nullable=True)
    date = mapped_column(DateTime, nullable=False, server_default=func.datetime('now', type_=DateTime))
    created_at = mapped_column(DateTime, server_default=func.datetime('now', type_=DateTime))
    updated_at = mapped_column(DateTime, server_default=func.datetime('now', type_=DateTime), onupdate=func.datetime('now', type_=DateTime))

    category = relationship("Category", lazy="joined")
