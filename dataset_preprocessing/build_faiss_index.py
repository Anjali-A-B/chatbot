import json
import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import pickle

# Base path (directory where this script is located)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths
CHUNKS_FILE = os.path.join(BASE_DIR, "processed", "chunks.json")
INDEX_SAVE_PATH = os.path.join(BASE_DIR, "embeddings", "faiss_index.index")
METADATA_SAVE_PATH = os.path.join(BASE_DIR, "embeddings", "chunk_metadata.pkl")

# Load chunks
with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
    chunks = json.load(f)

texts = [item["text"] for item in chunks]

# Load embedding model
model = SentenceTransformer("BAAI/bge-base-en-v1.5")
print("✅ Model loaded.")

# BGE recommends using a prefix for retrieval
texts_for_embedding = [f"Represent this sentence for retrieval: {text}" for text in texts]

# Create embeddings
print("🔄 Creating embeddings...")
embeddings = model.encode(texts_for_embedding, normalize_embeddings=True, show_progress_bar=True)
embeddings = np.array(embeddings).astype("float32")

# Create FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatIP(dimension)  # Inner product (cosine similarity because we normalized)
index.add(embeddings)
print(f"✅ FAISS index created with {index.ntotal} vectors.")

# Save index
os.makedirs(os.path.join(BASE_DIR, "embeddings"), exist_ok=True)
faiss.write_index(index, INDEX_SAVE_PATH)

# Save metadata (so we can retrieve the text from search results)
with open(METADATA_SAVE_PATH, "wb") as f:
    pickle.dump(chunks, f)

print("✅ Embeddings and metadata saved!")