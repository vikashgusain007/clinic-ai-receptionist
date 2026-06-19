from services.embedding import generate_embedding
from vector.qdrant import qdrant_client

from core.logging import info_logger
import uuid
COLLECTION_NAME = "health-memory"

from qdrant_client.models import (
    Filter,
    FieldCondition,
    MatchValue,
)

async def search_memory(
    user_id: uuid.UUID,
    query: str,
):
    info_logger(f"Searching memory for user {user_id} with query {query}")
    vector = generate_embedding(query)

    info_logger(f"Querying Qdrant for user {user_id} with query {query}")
    user_id_str = str(user_id)
    results = qdrant_client.query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        limit=5,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="user_id",
                    match=MatchValue(value=user_id_str),
                )
            ]
        ),
    )

    info_logger(f"Found {len(results.points)} memories for user {user_id} with query {query}")
    memories = []

    for point in results.points:
        memories.append(
            {
                "score": point.score,
                "text": point.payload.get("text"),
                "record_id": point.payload.get("record_id"),
            }
        )

    info_logger(f"Returning {len(memories)} memories for user {user_id} with query {query}")
    return memories