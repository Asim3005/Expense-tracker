"""fix_transaction_type_enum

Revision ID: 5dc207795acf
Revises: 0001
Create Date: 2026-03-16 22:44:42.795231

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5dc207795acf'
down_revision: Union[str, Sequence[str], None] = '0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop and recreate the enum with correct uppercase values
    # First, temporarily cast the column to text
    op.execute("ALTER TABLE transactions ALTER COLUMN transaction_type TYPE VARCHAR(255)")

    # Drop the old enum
    op.execute("DROP TYPE transactiontype")

    # Create the new enum with uppercase values to match SQLAlchemy's behavior
    op.execute("CREATE TYPE transactiontype AS ENUM ('INCOME', 'EXPENSE')")

    # Cast the column back to the new enum type
    op.execute("ALTER TABLE transactions ALTER COLUMN transaction_type TYPE transactiontype USING UPPER(transaction_type)::transactiontype")


def downgrade() -> None:
    """Downgrade schema."""
    # Drop the uppercase enum
    op.execute("ALTER TABLE transactions ALTER COLUMN transaction_type TYPE VARCHAR(255)")
    op.execute("DROP TYPE transactiontype")

    # Create the lowercase enum
    op.execute("CREATE TYPE transactiontype AS ENUM ('income', 'expense')")

    # Cast the column back to the lowercase enum type
    op.execute("ALTER TABLE transactions ALTER COLUMN transaction_type TYPE transactiontype USING LOWER(transaction_type)::transactiontype")
