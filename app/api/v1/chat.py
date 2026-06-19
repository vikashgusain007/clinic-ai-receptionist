from fastapi import APIRouter, Depends
from core.logging import info_logger
from schemas.chat import ChatRequest
from services.vector_memory import search_memory
from services.health import get_health_records
from services.llm import generate_response, extract_memory, build_context
from sqlalchemy.ext.asyncio import AsyncSession
from core.dependencies import get_db
from services.memory import save_extracted_memory

router = APIRouter()

@router.post("/chat")
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    info_logger(f"Retrieving existing memory for user {request.user_id}")
    memories = await search_memory(
        request.user_id,
        request.message
    )


    health_records = await get_health_records(
        request.user_id,
        db
    )


    context = build_context(
        user_message=request.message,
        health_records=health_records,
        memories=memories
    )

    print(context)


    response = await generate_response(
        context
    )


    extract_result = await extract_memory(
        user_id=request.user_id,
        message=request.message
    )

    print("========== RAW LLM OUTPUT ==========")
    print(extract_result)
    print("====================================")


    await save_extracted_memory(
        user_id=request.user_id,
        extract_result=extract_result,
        db=db
    )


    return {
        "message": response
    }