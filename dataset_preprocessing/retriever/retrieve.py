# retriever/retrieve.py

import os
import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer

# Base path = directory where this script resides
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths
INDEX_PATH = os.path.join(BASE_DIR, "..", "embeddings", "faiss_index.index")
METADATA_PATH = os.path.join(BASE_DIR, "..", "embeddings", "chunk_metadata.pkl")

# Load FAISS index
index = faiss.read_index(INDEX_PATH)

# Load metadata
with open(METADATA_PATH, "rb") as f:
    metadata = pickle.load(f)

# Load embedding model
model = SentenceTransformer("BAAI/bge-base-en-v1.5")

def retrieve_chunks(query, top_k=5):
    # Preprocess query for BGE
    query = f"Represent this sentence for retrieval: {query}"
    
    # Embed and normalize
    query_embedding = model.encode([query], normalize_embeddings=True).astype("float32")

    # Search
    D, I = index.search(query_embedding, top_k)
    
    # Get top results
    results = []
    for idx in I[0]:
        if idx < len(metadata):
            results.append(metadata[idx])
    
    return results
