from fastapi import APIRouter, Depends
from core.logging import info_logger
from schemas.chat import ChatRequest
from services.vector_memory import search_memory
from services.health import get_health_records
from services.llm import answer_health_query, extract_memory, build_context
from sqlalchemy.ext.asyncio import AsyncSession
from core.dependencies import get_db
from services.memory import save_extracted_memory
from fastapi import BackgroundTasks

router = APIRouter()

@router.post("/chat")
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    background_tasks: BackgroundTasks = BackgroundTasks()
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


    response = await answer_health_query(
        context
    )

    background_tasks.add_task(
        process_memory_pipeline,
        request.user_id,
        request.message,
        db
    )

    return {
        "message": response
    }


async def process_memory_pipeline(
    user_id,
    message,
    db: AsyncSession
):

    try:

        extract_result = await extract_memory(
            user_id,
            message
        )


        print(
            "MEMORY RESULT:",
            extract_result
        )


        await save_extracted_memory(
            user_id,
            extract_result,
            db
        )


    except Exception as e:

        print(
            "MEMORY PIPELINE ERROR",
            e
        )
