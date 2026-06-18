from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator
from starlette.exceptions import HTTPException as StarletteHTTPException
from api.router import api_router
from core.config import settings
from core.dependencies import get_db
from core.logging import setup_logging
from middleware.rate_limit import RateLimitMiddleware
from middleware.request_log import RequestLogMiddleware
from middleware.security import SecurityHeadersMiddleware
from loguru import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI Lifespan handler checking connection to resources.
    """
    setup_logging()
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
