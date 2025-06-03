# preprocess_documents.py

import os
import json
import pandas as pd
# from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_DIR = os.path.join(BASE_DIR, "processed")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def clean_text(text):
    text = re.sub(r"\s+", " ", text)  # Remove extra whitespaces
    return text.strip()

def chunk_text(text, max_chunk_size=500):
    words = text.split()
    chunks = []
    for i in range(0, len(words), max_chunk_size):
        chunk = " ".join(words[i:i + max_chunk_size])
        if chunk:
            chunks.append(chunk)
    return chunks

def process_pdf(file_path):
    reader = PdfReader(file_path)
    full_text = " ".join(page.extract_text() or "" for page in reader.pages)
    return chunk_text(clean_text(full_text))

def process_txt(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()
    return chunk_text(clean_text(text))

def process_csv(file_path):
    df = pd.read_csv(file_path)
    chunks = []
    for _, row in df.iterrows():
        q = str(row.get("question", "")).strip()
        a = str(row.get("answer", "")).strip()
        if q and a:
            combined = f"Q: {q}\nA: {a}"
            chunks.extend(chunk_text(clean_text(combined)))
    return chunks

def process_all_files():
    all_chunks = []
    for filename in os.listdir(DATA_DIR):
        filepath = os.path.join(DATA_DIR, filename)
        if filename.lower().endswith(".pdf"):
            print(f"Processing PDF: {filename}")
            all_chunks += process_pdf(filepath)
        elif filename.lower().endswith(".txt"):
            print(f"Processing TXT: {filename}")
            all_chunks += process_txt(filepath)
        elif filename.lower().endswith(".csv"):
            print(f"Processing CSV: {filename}")
            all_chunks += process_csv(filepath)
        else:
            print(f"Skipping unsupported file: {filename}")

    # Save chunks to JSON
    chunks_data = [{"id": i, "text": chunk} for i, chunk in enumerate(all_chunks)]
    with open(os.path.join(OUTPUT_DIR, "chunks.json"), "w", encoding="utf-8") as f:
        json.dump(chunks_data, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Done! {len(all_chunks)} chunks saved to 'processed/chunks.json'.")

if __name__ == "__main__":
    process_all_files()
