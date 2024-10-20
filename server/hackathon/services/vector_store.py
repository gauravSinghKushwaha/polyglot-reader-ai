import chromadb
from tqdm import tqdm

client = chromadb.PersistentClient(path="./bookchromadb")

def get_collection(book_id):
    return client.get_or_create_collection(
        name=book_id,
        metadata={"hnsw:space": "cosine"}  # l2 is the default
    )

def add_pages_to_vector_store(pages, book_id):

    documents = []
    metadatas = []
    ids = []
    for page_no in tqdm(pages):
        page = pages[page_no]
        documents.append(page['content'])
        metadatas.append({"book_id": book_id, "page_no": int(page_no)})
        ids.append(str(page_no))

    collection = get_collection(book_id)
    collection.upsert(
        documents=documents,
        metadatas=metadatas,
        ids=ids
    )


def query_db(page_no, book_id, query):

    collection = get_collection(book_id)
    results = collection.query(
        query_texts=[query],  # Chroma will embed this for you
        n_results=3,
        where={
            "page_no": {
                "$lte": int(page_no)
            }
        }
    )

    return results