"""remove_enum_use_varchar

Revision ID: 46daf2d435d2
Revises: 4f29af266aab
Create Date: 2026-03-16 23:00:13.815526

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '46daf2d435d2'
down_revision: Union[str, Sequence[str], None] = '4f29af266aab'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Change the column to VARCHAR type
    op.execute("ALTER TABLE transactions ALTER COLUMN transaction_type TYPE VARCHAR(10)")

    # Drop the enum type
    op.execute("DROP TYPE IF EXISTS transactiontype")

    # Add a check constraint to ensure only valid values
    op.execute("ALTER TABLE transactions ADD CONSTRAINT check_transaction_type CHECK (transaction_type IN ('income', 'expense'))")


def downgrade() -> None:
    """Downgrade schema."""
    # Drop the check constraint
    op.execute("ALTER TABLE transactions DROP CONSTRAINT IF EXISTS check_transaction_type")

    # Create the enum type
    op.execute("CREATE TYPE transactiontype AS ENUM ('income', 'expense')")

    # Change the column back to enum type
    op.execute("ALTER TABLE transactions ALTER COLUMN transaction_type TYPE transactiontype USING transaction_type::transactiontype")
