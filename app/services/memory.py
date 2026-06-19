from sqlalchemy.ext.asyncio import AsyncSession

from db.models.memory import Memory
from db.models.health import HealthRecord

from services.embedding import generate_embedding
from vector.qdrant import qdrant_client

from qdrant_client.models import PointStruct

import uuid


COLLECTION_NAME = "health-memory"


async def save_extracted_memory(
    user_id,
    extract_result,
    db: AsyncSession
):

    memory_id = None


    # -------------------------
    # 1. Save Health Record
    # -------------------------

    if extract_result.get("store_health_record"):

        health_data = extract_result["health_record"]


        health_record = HealthRecord(
        user_id=user_id,
        record_type=(
            health_data.get("type")
            or extract_result.get("category")
        ),
        value=(
            health_data.get("description")
            or extract_result.get("memory_content")
        ),
        memory_metadata={
            "title": health_data.get("title"),
            "event_date": health_data.get("event_date"),
            "source": "chat"
        }
    )


        db.add(health_record)



    # -------------------------
    # 2. Save Memory Table
    # -------------------------

    if extract_result.get("store_memory"):

        memory = Memory(
            user_id=user_id,
            memory_type=extract_result["memory_type"],
            content=extract_result["memory_content"]
        )


        db.add(memory)

        await db.flush()

        memory_id = memory.id



    await db.commit()



    # -------------------------
    # 3. Store in Qdrant
    # -------------------------

    if memory_id:

        text = extract_result["memory_content"]


        vector = generate_embedding(text)


        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            points=[
                PointStruct(
                    id=str(memory_id),
                    vector=vector,
                    payload={
                        "user_id": str(user_id),
                        "memory_id": str(memory_id),
                        "memory_type": extract_result["memory_type"],
                        "text": text
                    }
                )
            ]
        )


    return {
        "health_record_saved":
            extract_result.get("store_health_record"),

        "memory_saved":
            extract_result.get("store_memory")
    }
