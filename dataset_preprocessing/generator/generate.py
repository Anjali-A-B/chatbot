# import pymysql
# from llama_cpp import Llama

# # MySQL credentials
# DB_CONFIG = {
#     "host": "srv662.hstgr.io",
#     "user": "u911827301_school_db_test",
#     "password": "testSchool@123",
#     "database": "u911827301_school_db_test"
# }

# # Connect to MySQL and extract schema
# def get_database_schema():
#     connection = pymysql.connect(**DB_CONFIG)
#     cursor = connection.cursor()

#     schema_text = f"Database: {DB_CONFIG['database']}\n\n"
#     cursor.execute(f"""
#         SELECT TABLE_NAME 
#         FROM INFORMATION_SCHEMA.TABLES 
#         WHERE TABLE_SCHEMA = '{DB_CONFIG['database']}';
#     """)
#     tables = cursor.fetchall()

#     for (table_name,) in tables:
#         schema_text += f"Table: {table_name}\n"
#         cursor.execute(f"""
#             SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_KEY, EXTRA
#             FROM INFORMATION_SCHEMA.COLUMNS
#             WHERE TABLE_SCHEMA = '{DB_CONFIG['database']}' AND TABLE_NAME = '{table_name}';
#         """)
#         columns = cursor.fetchall()
#         for col_name, col_type, col_key, extra in columns:
#             details = f"{col_type}"
#             if col_key == "PRI":
#                 details += ", PRIMARY KEY"
#             elif col_key == "MUL":
#                 details += ", FOREIGN KEY"
#             if "auto_increment" in extra.lower():
#                 details += ", AUTO_INCREMENT"
#             schema_text += f"- {col_name} ({details})\n"
#         schema_text += "\n"

#     cursor.close()
#     connection.close()
#     return schema_text.strip()

# # Load schema dynamically
# DATABASE_SCHEMA = get_database_schema()

# # GGUF model path
# MODEL_PATH = r"D:\New folder (2)\knowledge_chatbot.part01\knowledge_chatbot\models\Mistral-7B-Instruct\mistral-7b-instruct-v0.1.Q4_K_M.gguf"
# llm = Llama(
#     model_path=MODEL_PATH,
#     n_ctx=4096,
#     n_threads=8,
#     n_batch=64,
#     use_mlock=True
# )

# # Prompt for QA
# def format_prompt(context_chunks, user_query):
#     context = "\n\n".join([f"- {chunk['text']}" for chunk in context_chunks])
#     prompt = f"""You are a helpful customer support assistant. Use the following company information to answer the user's question.

# ### Company Info:
# {context}

# ### Question:
# {user_query}

# ### Answer:"""
#     return prompt

# # Prompt for SQL
# # def format_sql_prompt(user_query):
# #     question = user_query.replace("/report", "").strip()
# #     prompt = f"""You are an expert SQL assistant. Your job is to generate valid and syntactically correct SQL queries from user questions.

# # Follow these steps carefully:

# # 1. Read the question.
# # 2. Identify possible column names by looking for semantic matches in the schema.
# # 3. If the user says "student name", and schema has "student_name" or "full_name", use that instead of "name".
# # 4. ONLY use columns present in schema — NEVER assume.
# # 5. If you can’t find a matching column, return: SELECT 'Error: Column not found in schema';

# # Use correct case-sensitive column and table names.

# # ### Database Schema:
# # {DATABASE_SCHEMA}

# # ### Question:
# # {question}

# # ### SQL Query:"""
# #     return prompt


# def get_guidelines():
#     with open("D:/chatbot - Copy/dataset_preprocessing/generator/guidelines.txt", "r") as f:
#         return f.read()

# def format_sql_prompt(user_query):
#     question = user_query.replace("/report", "").strip()
#     guidelines = get_guidelines()
    
#     prompt = f"""{guidelines}

# ### Database Schema:
# {DATABASE_SCHEMA}

# ### Question:
# {question}

# ### SQL Query:"""
#     return prompt


# # SQL Query Generator
# # def generate_sql_query(user_query, max_tokens=200):
# #     prompt = format_sql_prompt(user_query)

# #     output = llm(
# #         prompt,
# #         max_tokens=max_tokens,
# #         temperature=0.1,
# #         top_p=0.9,
# #         stop=["###"]
# #     )

# #     return output["choices"][0]["text"].strip()

# def generate_sql_query(user_query, max_tokens=200):
#     prompt = format_sql_prompt(user_query)

#     output = llm(
#         prompt,
#         max_tokens=max_tokens,
#         temperature=0.1,
#         top_p=0.9,
#         stop=["###"]
#     )

#     # Get the generated text
#     raw_sql = output["choices"][0]["text"].strip()

#     # Clean any Markdown or formatting artifacts
#     cleaned_sql = (
#         raw_sql.replace("```sql", "")
#                .replace("```", "")
#                .strip()
#     )

#     # Optional: Remove trailing semicolon
#     if cleaned_sql.endswith(";"):
#         cleaned_sql = cleaned_sql[:-1].strip()

#     return cleaned_sql


# # Answer Generator
# def generate_answer(chunks, query, max_tokens=300):
#     if query.strip().lower().startswith("/report"):
#         return generate_sql_query(query, max_tokens=150)

#     prompt = format_prompt(chunks, query)

#     output = llm(
#         prompt,
#         max_tokens=max_tokens,
#         temperature=0.7,
#         top_p=0.9,
#         stop=["###"]
#     )

#     return output["choices"][0]["text"].strip()


# import os
# import pymysql
# from llama_cpp import Llama

# # MySQL credentials
# DB_CONFIG = {
#     "host": "srv662.hstgr.io",
#     "user": "u911827301_school_db_test",
#     "password": "testSchool@123",
#     "database": "u911827301_school_db_test"
# }

# # Connect to MySQL and extract schema
# def get_database_schema():
#     connection = pymysql.connect(**DB_CONFIG)
#     cursor = connection.cursor()

#     schema_text = f"Database: {DB_CONFIG['database']}\n\n"
#     cursor.execute(f"""
#         SELECT TABLE_NAME 
#         FROM INFORMATION_SCHEMA.TABLES 
#         WHERE TABLE_SCHEMA = '{DB_CONFIG['database']}';
#     """)
#     tables = cursor.fetchall()

#     for (table_name,) in tables:
#         schema_text += f"Table: {table_name}\n"
#         cursor.execute(f"""
#             SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_KEY, EXTRA
#             FROM INFORMATION_SCHEMA.COLUMNS
#             WHERE TABLE_SCHEMA = '{DB_CONFIG['database']}' AND TABLE_NAME = '{table_name}';
#         """)
#         columns = cursor.fetchall()
#         for col_name, col_type, col_key, extra in columns:
#             details = f"{col_type}"
#             if col_key == "PRI":
#                 details += ", PRIMARY KEY"
#             elif col_key == "MUL":
#                 details += ", FOREIGN KEY"
#             if "auto_increment" in extra.lower():
#                 details += ", AUTO_INCREMENT"
#             schema_text += f"- {col_name} ({details})\n"
#         schema_text += "\n"

#     cursor.close()
#     connection.close()
#     return schema_text.strip()

# # Load schema dynamically
# DATABASE_SCHEMA = get_database_schema()

# # Load RAG Answer Model (Mistral-7B-Instruct)
# ANSWER_MODEL_PATH = r"D:\chatbot - Copy\dataset_preprocessing\models\Mistral-7B-Instruct\mistral-7b-instruct-v0.1.Q4_K_M.gguf"
# llm_answer = Llama(
#     model_path=ANSWER_MODEL_PATH,
#     n_ctx=4096,
#     n_threads=8,
#     n_batch=64,
#     use_mlock=True
# )

# # Load SQL Model (Mistral-7B-Instruct-SQL-ian)
# SQL_MODEL_PATH = r"D:\chatbot - Copy\dataset_preprocessing\models\Mistral-SQL\Mistral-7B-Instruct-SQL-ian.Q4_K_M.gguf"
# llm_sql = Llama(
#     model_path=SQL_MODEL_PATH,
#     n_ctx=4096,
#     n_threads=8,
#     n_batch=64,
#     use_mlock=True
# )

# # Prompt for QA
# def format_prompt(context_chunks, user_query):
#     context = "\n\n".join([f"- {chunk['text']}" for chunk in context_chunks])
#     prompt = f"""You are a helpful customer support assistant. Use the following company information to answer the user's question.

# ### Company Info:
# {context}

# ### Question:
# {user_query}

# ### Answer:"""
#     return prompt

# # Guidelines file for SQL model
# def get_guidelines():
#     with open("D:/chatbot - Copy/dataset_preprocessing/generator/guidelines.txt", "r") as f:
#         return f.read()

# # Prompt for SQL generation
# def format_sql_prompt(user_query):
#     question = user_query.replace("/report", "").strip()
#     guidelines = get_guidelines()
    
#     prompt = f"""{guidelines}

# ### Database Schema:
# {DATABASE_SCHEMA}

# ### Question:
# {question}

# ### SQL Query:"""
#     return prompt

# # SQL Query Generator (using SQL-specialized model)
# def generate_sql_query(user_query, max_tokens=200):
#     prompt = format_sql_prompt(user_query)

#     output = llm_sql(
#         prompt,
#         max_tokens=max_tokens,
#         temperature=0.1,
#         top_p=0.9,
#         stop=["###"]
#     )

#     raw_sql = output["choices"][0]["text"].strip()

#     cleaned_sql = (
#         raw_sql.replace("```sql", "")
#                .replace("```", "")
#                .strip()
#     )

#     if cleaned_sql.endswith(";"):
#         cleaned_sql = cleaned_sql[:-1].strip()

#     return cleaned_sql

# # Answer Generator (using RAG model)
# def generate_answer(chunks, query, max_tokens=300):
#     if query.strip().lower().startswith("/report"):
#         return generate_sql_query(query, max_tokens=150)

#     prompt = format_prompt(chunks, query)

#     output = llm_answer(
#         prompt,
#         max_tokens=max_tokens,
#         temperature=0.7,
#         top_p=0.9,
#         stop=["###"]
#     )

#     return output["choices"][0]["text"].strip()


import pymysql
from llama_cpp import Llama

# MySQL credentials
DB_CONFIG = {
    "host": "srv662.hstgr.io",
    "user": "u911827301_school_db_test",
    "password": "testSchool@123",
    "database": "u911827301_school_db_test"
}

# Connect to MySQL and extract schema
def get_database_schema():
    connection = pymysql.connect(**DB_CONFIG)
    cursor = connection.cursor()

    schema_text = f"Database: {DB_CONFIG['database']}\n\n"
    cursor.execute(f"""
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = '{DB_CONFIG['database']}';
    """)
    tables = cursor.fetchall()

    for (table_name,) in tables:
        schema_text += f"Table: {table_name}\n"
        cursor.execute(f"""
            SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_KEY, EXTRA
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = '{DB_CONFIG['database']}' AND TABLE_NAME = '{table_name}';
        """)
        columns = cursor.fetchall()
        for col_name, col_type, col_key, extra in columns:
            details = f"{col_type}"
            if col_key == "PRI":
                details += ", PRIMARY KEY"
            elif col_key == "MUL":
                details += ", FOREIGN KEY"
            if "auto_increment" in extra.lower():
                details += ", AUTO_INCREMENT"
            schema_text += f"- {col_name} ({details})\n"
        schema_text += "\n"

    cursor.close()
    connection.close()
    return schema_text.strip()
# print(get_database_schema())

# Load schema dynamically
DATABASE_SCHEMA = get_database_schema()

# ✅ Updated path to merged model
MODEL_PATH = r"D:\chatbot - Copy\dataset_preprocessing\models\Merged-Mistral\Mistral-7B-Instruct-SQL-Mistral-7B-Instruct-v0.2-slerp.Q4_K_M.gguf"

llm = Llama(
    model_path=MODEL_PATH,
    n_ctx=4096,
    n_threads=8,
    n_batch=64,
    use_mlock=True
)

# Prompt for QA
def format_prompt(context_chunks, user_query):
    context = "\n\n".join([f"- {chunk['text']}" for chunk in context_chunks])
    prompt = f"""You are a helpful customer support assistant. Use the following company information to answer the user's question as briefly and clearly as possible.

### Company Info:
{context}

### Question:
{user_query}

### Answer:"""
    return prompt

# def format_prompt(context_chunks, user_query):
#     context = "\n\n".join([f"- {chunk['text']}" for chunk in context_chunks])
#     prompt = f"""You are a concise and helpful customer support assistant. Use the following company information to answer the user's question as briefly and clearly as possible.

# ### Company Info:
# {context}

# ### Question:
# {user_query}

# ### Answer (keep it brief):"""
#     return prompt

# Get SQL generation guidelines
def get_guidelines():
    with open("D:/chatbot - Copy/dataset_preprocessing/generator/guidelines.txt", "r") as f:
        return f.read()

# SQL Prompt formatting
def format_sql_prompt(user_query):
    question = user_query.replace("/report", "").strip()
    guidelines = get_guidelines()
    
    prompt = f"""{guidelines}

### Database Schema:
{DATABASE_SCHEMA}

### Question:
{question}

### SQL Query:"""
    return prompt

# SQL Query Generator
def generate_sql_query(user_query, max_tokens=200):
    prompt = format_sql_prompt(user_query)

    output = llm(
        prompt,
        max_tokens=max_tokens,
        temperature=0.1,
        top_p=0.9,
        stop=["###"]
    )

    raw_sql = output["choices"][0]["text"].strip()

    cleaned_sql = (
        raw_sql.replace("```sql", "")
               .replace("```", "")
               .strip()
    )

    if cleaned_sql.endswith(";"):
        cleaned_sql = cleaned_sql[:-1].strip()

    return cleaned_sql

# Main Answer Generator
def generate_answer(chunks, query, max_tokens=300):
    if query.strip().lower().startswith("/report"):
        return generate_sql_query(query, max_tokens=150)

    prompt = format_prompt(chunks, query)

    output = llm(
        prompt,
        max_tokens=max_tokens,
        temperature=0.7,
        top_p=0.9,
        stop=["###"]
    )

    return output["choices"][0]["text"].strip()
