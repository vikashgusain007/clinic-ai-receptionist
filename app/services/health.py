from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

import uuid
from db.models.health import HealthRecord


async def get_health_records(
    user_id: uuid.UUID,
    db: AsyncSession
):
    result = await db.execute(
        select(HealthRecord)
        .where(HealthRecord.user_id == user_id)
    )

    return result.scalars().all()
