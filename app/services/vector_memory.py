from qdrant_client.models import PointStruct

from vector.qdrant import qdrant_client


COLLECTION_NAME = "health_memory"


async def store_health_memory(
    record_id: int,
    user_id: int,
    text: str,
    vector: list
):

    qdrant_client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=record_id,
                vector=vector,
                payload={
                    "user_id": user_id,
                    "record_id": record_id,
                    "source": "health_record",
                    "text": text,
                }
            )
        ]
    )


from services.embedding import generate_embedding
from vector.qdrant import qdrant_client


COLLECTION_NAME = "health_memory"

from qdrant_client.models import (
    Filter,
    FieldCondition,
    MatchValue,
)

async def search_memory(
    user_id: int,
    query: str,
):
    vector = generate_embedding(query)

    results = qdrant_client.query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        limit=5,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="user_id",
                    match=MatchValue(value=user_id),
                )
            ]
        ),
    )

    memories = []

    for point in results.points:
        memories.append(
            {
                "score": point.score,
                "text": point.payload.get("text"),
                "record_id": point.payload.get("record_id"),
            }
        )

    return memories