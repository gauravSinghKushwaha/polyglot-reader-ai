from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.http.models import Range
from langchain_core.documents import Document
from qdrant_client.http import models
from langchain_ollama import OllamaEmbeddings
from tqdm import tqdm
from uuid import uuid4
from qdrant_client.http.models import Distance, VectorParams


embeddings = OllamaEmbeddings(
    model="llama3.2",
)

client = QdrantClient(url="http://localhost:6333")

client.create_collection(
    collection_name="polyglot",
    vectors_config=VectorParams(size=3072, distance=Distance.COSINE),
)

vector_store = QdrantVectorStore(
    client=client,
    collection_name="polyglot",
    embedding=embeddings,
)

def add_pages_to_vector_store(pages, book_id):

    documents = []
    for page_no in tqdm(pages):
        page = pages[page_no]
        documents.append(Document(
            page_content=page['content'],
            metadata={"book_id": book_id, "page_no": int(page_no)}
        ))

    uuids = [str(uuid4()) for _ in range(len(documents))]
    vector_store.add_documents(documents=documents, ids=uuids)


def query_db(page_no, book_id, query):

    results = vector_store.similarity_search(
        query=query,
        # filter=models.Filter(
            # should=[
            #     models.FieldCondition(
            #         key="page_no",
            #         range=Range(
            #             gte=0,
            #             lte=page_no
            #         )
            #     )
            # ],
            # must=[
            #     models.FieldCondition(
            #         key="book_id",
            #         match=models.MatchValue(
            #             value=book_id
            #         )
            #     )
            # ]
        # ),
    )

    return results