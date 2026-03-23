from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary")
async def get_summary(
    start_date: str = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(None, description="End date (YYYY-MM-DD)"),
    db: AsyncSession = Depends(get_db),
):
    """Get financial summary: balance, total income, total expenses."""
    from datetime import datetime

    service = AnalyticsService(db)
    return await service.get_summary(
        start_date=datetime.strptime(start_date, "%Y-%m-%d").date() if start_date else None,
        end_date=datetime.strptime(end_date, "%Y-%m-%d").date() if end_date else None,
    )


@router.get("/spending-by-category")
async def get_spending_by_category(
    start_date: str = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(None, description="End date (YYYY-MM-DD)"),
    db: AsyncSession = Depends(get_db),
):
    """Get spending breakdown by category."""
    from datetime import datetime

    service = AnalyticsService(db)
    return await service.get_spending_by_category(
        start_date=datetime.strptime(start_date, "%Y-%m-%d").date() if start_date else None,
        end_date=datetime.strptime(end_date, "%Y-%m-%d").date() if end_date else None,
    )


@router.get("/monthly-trend")
async def get_monthly_trend(
    months: int = Query(12, ge=1, le=24, description="Number of months to retrieve"),
    db: AsyncSession = Depends(get_db),
):
    """Get monthly income and expense trends."""
    try:
        service = AnalyticsService(db)
        return await service.get_monthly_trend(months=months)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
