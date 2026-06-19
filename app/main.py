from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from api.router import api_router
from core.config import settings
from core.dependencies import get_db

import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI Lifespan handler checking connection to resources.
    """
    logger.info("Initializing application startup sequence...")

    # Pre-ping db connection to verify setup
    try:
        async for session in get_db():
            from sqlalchemy import text

            await session.execute(text("SELECT 1"))
            logger.info("Connection to PostgreSQL verified successfully.")
            break
    except Exception as exc:
        logger.error(f"Failed to connect to PostgreSQL database on startup: {exc}")

    logger.info("Shutting down application...")


# FastAPI application initialization
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-grade FastAPI boiler-plate backend.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Rate Limit Middleware
# app.add_middleware(
#     RateLimitMiddleware, max_requests=100, window_seconds=60
# )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "data": None,
        },
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
