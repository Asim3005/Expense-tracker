"""Initial migration - create categories and transactions tables

Revision ID: 0001
Revises:
Create Date: 2024-02-24 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '0001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create categories table
    op.create_table(
        'categories',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False, unique=True),
        sa.Column('color', sa.String(7), nullable=False, server_default='#6366f1'),
        sa.Column('icon', sa.String(50), nullable=False, server_default='tag'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.current_timestamp()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.current_timestamp()),
    )
    op.create_index(op.f('ix_categories_name'), 'categories', ['name'], unique=True)

    # Create transactions table
    op.create_table(
        'transactions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('amount', sa.Numeric(12, 2), nullable=False),
        sa.Column('description', sa.String(255), nullable=False),
        sa.Column('transaction_type', sa.Enum('income', 'expense', name='transactiontype'), nullable=False),
        sa.Column('category_id', sa.String(36), nullable=True),
        sa.Column('date', sa.DateTime(), nullable=False, server_default=sa.func.current_timestamp()),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.current_timestamp()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.current_timestamp()),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
    )


def downgrade() -> None:
    op.drop_table('transactions')
    op.drop_index(op.f('ix_categories_name'), table_name='categories')
    op.drop_table('categories')
    sa.Enum(name='transactiontype').drop(op.get_bind())
