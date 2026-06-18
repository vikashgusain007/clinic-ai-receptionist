from typing import AsyncGenerator, List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from core.config import settings
from core.security import decode_token
from db.models.user import User, UserRole
from db.session import async_session_maker
from services.user import user_service

# Defines OAuth2 scheme. Matches OAuth2 password flow.
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency generating async SQLAlchemy sessions.
    Automatically rolls back / commits sessions.
    """
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
