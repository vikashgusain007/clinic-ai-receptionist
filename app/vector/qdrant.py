from qdrant_client import QdrantClient
from core.config import settings
from qdrant_client.models import Distance, VectorParams

qdrant_client = QdrantClient(
    host=settings.QDRANT_HOST,
    port=settings.QDRANT_PORT
)

collection_name = "health-memory"

collections = qdrant_client.get_collections()

if collection_name not in [
    c.name for c in collections.collections
]:
    qdrant_client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(
            size=384,
            distance=Distance.COSINE
        ),
    )