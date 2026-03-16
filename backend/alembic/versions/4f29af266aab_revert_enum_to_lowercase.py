"""revert_enum_to_lowercase

Revision ID: 4f29af266aab
Revises: 5dc207795acf
Create Date: 2026-03-16 22:56:33.911511

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4f29af266aab'
down_revision: Union[str, Sequence[str], None] = '5dc207795acf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop and recreate the enum with correct lowercase values
    # First, temporarily cast the column to text
    op.execute("ALTER TABLE transactions ALTER COLUMN transaction_type TYPE VARCHAR(255)")

    # Drop the old uppercase enum
    op.execute("DROP TYPE transactiontype")

    # Create the new enum with lowercase values to match Python enum
    op.execute("CREATE TYPE transactiontype AS ENUM ('income', 'expense')")

    # Cast the column back to the new enum type
    op.execute("ALTER TABLE transactions ALTER COLUMN transaction_type TYPE transactiontype USING LOWER(transaction_type)::transactiontype")


def downgrade() -> None:
    """Downgrade schema."""
    # Drop the lowercase enum
    op.execute("ALTER TABLE transactions ALTER COLUMN transaction_type TYPE VARCHAR(255)")
    op.execute("DROP TYPE transactiontype")

    # Create the uppercase enum
    op.execute("CREATE TYPE transactiontype AS ENUM ('INCOME', 'EXPENSE')")

    # Cast the column back to the uppercase enum type
    op.execute("ALTER TABLE transactions ALTER COLUMN transaction_type TYPE transactiontype USING UPPER(transaction_type)::transactiontype")
