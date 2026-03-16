from datetime import datetime

from sqlalchemy import String, DateTime
from sqlalchemy.orm import mapped_column
from sqlalchemy.sql import func
import uuid

from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = mapped_column(String(100), unique=True, nullable=False, index=True)
    color = mapped_column(String(7), nullable=False, default="#6366f1")
    icon = mapped_column(String(50), nullable=False, default="tag")
    created_at = mapped_column(DateTime, server_default=func.datetime('now', type_=DateTime))
    updated_at = mapped_column(DateTime, server_default=func.datetime('now', type_=DateTime), onupdate=func.datetime('now', type_=DateTime))
