from qdrant_client import QdrantClient
from qdrant_client.models import Distance,VectorParams
from fastembed import TextEmbedding
import os

client = QdrantClient(
    url=os.getenv("QDRANT_API_ENDPOINT"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

client.create_collection(
    collection_name="document-items",
    vectors_config=VectorParams(size=384,distance=Distance.COSINE)
)