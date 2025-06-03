import os
import requests

# URL and output path
url = "https://huggingface.co/MaziyarPanahi/Mistral-7B-Instruct-SQL-Mistral-7B-Instruct-v0.2-slerp-GGUF/resolve/main/Mistral-7B-Instruct-SQL-Mistral-7B-Instruct-v0.2-slerp.Q4_K_M.gguf"
output_path = "D:/chatbot - Copy/dataset_preprocessing/models/Merged-Mistral/Mistral-7B-Instruct-SQL-Mistral-7B-Instruct-v0.2-slerp.Q4_K_M.gguf"

# Make sure directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Download with requests
response = requests.get(url, stream=True)
with open(output_path, "wb") as f:
    for chunk in response.iter_content(chunk_size=8192):
        if chunk:
            f.write(chunk)

print("✅ Merged SLERP model downloaded successfully!")
