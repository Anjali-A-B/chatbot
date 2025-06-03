import subprocess
import sys

def run_command(command):
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True)
    if result.returncode != 0:
        print(f"❌ Command failed: {command}")
        sys.exit(result.returncode)
    else:
        print(f"✅ Completed: {command}\n")

if __name__ == "__main__":
    # Install dependencies
    run_command("pip install -r requirements.txt")

    # Preprocess and index documents
    run_command("python ../dataset_preprocessing/preprocess_documents.py")
    run_command("python ../dataset_preprocessing/build_faiss_index.py")

    # Optional: preload retrieval and generator steps (only if required)
    run_command("python ../dataset_preprocessing/retriever/retrieve.py")
    run_command("python ../dataset_preprocessing/generator/generate.py")  # Only if this performs initialization
