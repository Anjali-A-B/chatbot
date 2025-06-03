


# # 2 model working both nsg and text



from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import torch
import io
import sys
import mysql.connector
from flask import send_file
import torchaudio
from pydub import AudioSegment
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor

from werkzeug.security import generate_password_hash, check_password_hash
import jwt 



# Add path to access generator module
sys.path.append(os.path.abspath("D:/chatbot - Copy/dataset_preprocessing"))

# Import your local Mistral GGUF generator
from generator.generate import generate_answer,generate_sql_query

#path to the guideline file for generate.py
GUIDELINE_PATH = "D:/chatbot - Copy/dataset_preprocessing/generator/guidelines.txt"

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)
# Secret key for JWT tokens
app.config['SECRET_KEY'] = 'your_super_secret_key_here'

# Path to local SeamlessM4T model
MODEL_PATH = "D:/chatbot - Copy/seamless_m4t_model"

# Load the processor and model for audio transcription
processor = AutoProcessor.from_pretrained(MODEL_PATH)
model = AutoModelForSpeechSeq2Seq.from_pretrained(MODEL_PATH)



# MySQL configuration

import mysql.connector

#database for data for model
db_config = {
    "host": "srv662.hstgr.io",
    "user": "u911827301_school_db_test",
    "password": "testSchool@123",
    "database": "u911827301_school_db_test"
}


#databse for chatbot login and other

chatbot_db = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Database@123',
    'database': 'chatbot_db'  # Your DB name
}




def get_user_db_connection():
    return mysql.connector.connect(**chatbot_db)  

# @app.route('/api/signup', methods=['POST'])
# def signup():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')
#     role = data.get('role')

#     if not email or not password or role not in ('user', 'company'):
#         return jsonify({'error': 'Invalid input'}), 400

#     hashed_password = generate_password_hash(password)

#     try:
#         conn = get_user_db_connection()
#         cursor = conn.cursor()
#         cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
#         if cursor.fetchone():
#             return jsonify({'error': 'User already exists'}), 409

#         cursor.execute(
#             "INSERT INTO users (email, password, role) VALUES (%s, %s, %s)",
#             (email, hashed_password, role)
#         )
#         conn.commit()
#         cursor.close()
#         conn.close()

#         return jsonify({'message': 'User created successfully'}), 201

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


import os
import uuid
from flask import request, jsonify
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta

UPLOAD_FOLDER = 'static/uploads/logos'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def generate_chatbot_slug(name):
    # Simple slug generator from company name + random suffix
    slug_base = name.lower().replace(" ", "-")
    suffix = uuid.uuid4().hex[:6]
    return f"{slug_base}-{suffix}"

def is_email_registered(email, cursor):
    # Check bot_users
    cursor.execute("SELECT id FROM bot_users WHERE email = %s", (email,))
    if cursor.fetchone():
        return True
    # Check companies
    cursor.execute("SELECT id FROM companies WHERE email = %s", (email,))
    if cursor.fetchone():
        return True
    # Check admins
    cursor.execute("SELECT id FROM admins WHERE email = %s", (email,))
    if cursor.fetchone():
        return True
    return False


@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        form = request.form
        role = form.get('role')

        email = form.get('email')  # get email once, since needed in both roles

        conn = get_user_db_connection()
        cursor = conn.cursor()

        # Check email uniqueness globally for both user and company signups
        if is_email_registered(email, cursor):
            cursor.close()
            conn.close()
            return jsonify({'error': 'Email already registered'}), 409

        if role == 'user':
            # Signup as bot user
            password = form.get('password')

            if not email or not password:
                cursor.close()
                conn.close()
                return jsonify({'error': 'Email and password required for user signup'}), 400

            hashed_password = generate_password_hash(password)

            cursor.execute(
                "INSERT INTO bot_users (email, password) VALUES (%s, %s)",
                (email, hashed_password)
            )
            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({'message': 'User signup successful'}), 201

        elif role == 'company':
            # Signup as company
            name = form.get('companyName')
            password = form.get('password')
            db_host = form.get('dbHost')
            db_user = form.get('dbUser')
            db_password = form.get('dbPassword')
            db_name = form.get('dbName')
            logo_file = request.files.get('logo')

            if not all([name, email, password]):
                cursor.close()
                conn.close()
                return jsonify({'error': 'Name, email, and password required for company signup'}), 400

            hashed_password = generate_password_hash(password)

            logo_url = None
            if logo_file:
                filename = secure_filename(f"{uuid.uuid4().hex}_{logo_file.filename}")
                logo_path = os.path.join(UPLOAD_FOLDER, filename)
                logo_file.save(logo_path)
                logo_url = f"static/uploads/logos/{filename}"

            chatbot_slug = generate_chatbot_slug(name)

            # cursor.execute("""
            #     INSERT INTO companies (
            #         name, email, password_hash, logo_url, db_host, db_user, db_password, db_name, chatbot_slug, created_at
            #     ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            # """, (
            #     name, email, hashed_password, logo_url, db_host, db_user, db_password, db_name,
            #     chatbot_slug, datetime.utcnow()
            # ))
            # conn.commit()
            # cursor.close()
            # conn.close()

            # return jsonify({'message': 'Company signup successful', 'chatbot_slug': chatbot_slug}), 201

            chatbot_slug = generate_chatbot_slug(name)
            chatbot_link = f"http://localhost:8080/index/{chatbot_slug}"# Construct full bot URL

            cursor.execute("""
                INSERT INTO companies (
                name, email, password_hash, logo_url, db_host, db_user, db_password, db_name, chatbot_slug, chatbot_link, created_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                 """, (
                         name, email, hashed_password, logo_url, db_host, db_user, db_password, db_name,
                        chatbot_slug, chatbot_link, datetime.utcnow()
                    ))
            conn.commit()

            return jsonify({
                    'message': 'Company signup successful',
                    'chatbot_slug': chatbot_slug,
                    'chatbot_link': chatbot_link
                    }), 201
            

        else:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Invalid role'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500



# @app.route('/api/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     if not email or not password:
#         return jsonify({'error': 'Missing username or password'}), 400

#     try:
#         conn = get_user_db_connection()
#         cursor = conn.cursor(dictionary=True)
#         cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
#         user = cursor.fetchone()
#         cursor.close()
#         conn.close()

#         if user and check_password_hash(user['password'], password):
#             token = jwt.encode({
#                 'user_id': user['id'],
#                 'username': user['email'],
#                 'role': user['role'],
#                 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
#             }, app.config['SECRET_KEY'], algorithm='HS256')



#             return jsonify({
#                 'token': token,
#                 'role': user['role'],
#                 'email': user['email']
#             })


#         return jsonify({'error': 'Invalid credentials'}), 401

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# import jwt
# from flask import request, jsonify
# from werkzeug.security import check_password_hash

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    try:
        conn = get_user_db_connection()
        cursor = conn.cursor(dictionary=True)

        role = None
        user_id = None
        stored_password_hash = None

        # Check bot_users table (user)
        cursor.execute("SELECT id, email, password FROM bot_users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if user:
            role = 'user'
            user_id = user['id']
            stored_password_hash = user['password']
        else:
            # Check companies table (company)
            cursor.execute("SELECT id, email, password_hash FROM companies WHERE email = %s", (email,))
            company = cursor.fetchone()
            if company:
                role = 'company'
                user_id = company['id']
                stored_password_hash = company['password_hash']
            else:
                # Check admin table (admin)
                cursor.execute("SELECT id, email, password FROM admins WHERE email = %s", (email,))
                admin = cursor.fetchone()
                if admin:
                    role = 'admin'
                    user_id = admin['id']
                    stored_password_hash = admin['password']

        cursor.close()
        conn.close()

        if role and stored_password_hash and check_password_hash(stored_password_hash, password):
            token = jwt.encode({
                'user_id': user_id,
                'email': email,
                'role': role,
                # 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
                'exp': datetime.utcnow() + timedelta(hours=24)

            }, app.config['SECRET_KEY'], algorithm='HS256')

            return jsonify({
                'token': token,
                'role': role,
                'email': email
            })

        return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/company-info', methods=['GET'])
def company_info():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({'error': 'Authorization token missing'}), 401

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload.get('user_id')
        role = payload.get('role')

        if role != 'company':
            return jsonify({'error': 'Unauthorized access'}), 403

        conn = get_user_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT name, email, db_name,db_host, db_user, db_password, chatbot_link, logo_url FROM companies WHERE id = %s", (user_id,))
        company = cursor.fetchone()

        cursor.close()
        conn.close()

        if not company:
            return jsonify({'error': 'Company not found'}), 404

        # Convert relative logo path to full URL
        if company.get('logo_url'):
            company['logo_url'] = request.host_url + company['logo_url']

        return jsonify(company)

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#company info edit

@app.route('/api/company-info', methods=['PUT'])
def update_company_info():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({'error': 'Authorization token missing'}), 401

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload.get('user_id')
        role = payload.get('role')

        if role != 'company':
            return jsonify({'error': 'Unauthorized access'}), 403

        data = request.json
        conn = get_user_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE companies
            SET name = %s, email = %s, db_name = %s, chatbot_link = %s, logo_url = %s
            WHERE id = %s
        """, (
            data.get('name'),
            data.get('email'),
            data.get('db_name'),
            data.get('chatbot_link'),
            data.get('logo_url'),
            user_id
        ))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify(data), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500



#editing or view guideline from frontend
@app.route('/api/admin/guidelines', methods=['GET'])
def get_guidelines_file():
    with open(GUIDELINE_PATH, "r") as f:
        content = f.read()
    return jsonify({"guidelines": content})


@app.route('/api/admin/guidelines', methods=['POST'])
def update_guidelines_file():
    data = request.get_json()
    new_guidelines = data.get("guidelines")

    if not new_guidelines:
        return jsonify({"error": "No guidelines provided"}), 400

    with open(GUIDELINE_PATH, "w") as f:
        f.write(new_guidelines)
    
    return jsonify({"message": "Guidelines updated successfully"})



# Function to execute SQL query
def execute_sql_query(sql_query):
    try:
        sql_query = sql_query.strip()

        # Enforce only SELECT queries are allowed
        if not sql_query.strip().lower().startswith("select"):
            return {"error": "Only SELECT queries are allowed. Read-only access enforced."}

        # Try connecting to the database
        connection = mysql.connector.connect(**db_config)
        print("✅ Database connection successful.")

        cursor = connection.cursor()
        cursor.execute(sql_query)

        # Fetch and return data
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]

        cursor.close()
        connection.close()
        return result

    except mysql.connector.Error as err:
        return {"error": str(err)}

  
# Convert audio to 16kHz mono WAV in-memory
def convert_to_16k_mono(audio_file):
    audio = AudioSegment.from_file(audio_file)
    audio = audio.set_channels(1).set_frame_rate(16000)

    byte_io = io.BytesIO()
    audio.export(byte_io, format="wav")
    byte_io.seek(0)
    return byte_io

# Transcription function using SeamlessM4T
def transcribe(audio_file):
    converted_audio = convert_to_16k_mono(audio_file)
    waveform, sample_rate = torchaudio.load(converted_audio)

    inputs = processor(
        audios=waveform,
        sampling_rate=sample_rate,
        return_tensors="pt",
        tgt_lang="eng"
    )

    with torch.no_grad():
        generated_tokens = model.generate(**inputs)

    transcription = processor.batch_decode(generated_tokens, skip_special_tokens=True)[0]
    return transcription

# Text message route: send user message to Mistral model
@app.route('/api/text-message', methods=['POST'])
def handle_text_message():
    data = request.get_json()
    message = data.get("message")

    if not message:
        return jsonify({"error": "No message provided"}), 400

    # Placeholder chunks — replace with retrieval if needed
    chunks = [{"text": "This is general company information used as context."}]
    
    # Generate reply using Mistral
    reply = generate_answer(chunks, message)
    return jsonify({"reply": reply})

# Route to accept and transcribe audio
@app.route('/api/convert-audio', methods=['POST'])
def convert_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    transcription = transcribe(audio_file)

    if transcription:
        return jsonify({'transcription': transcription})
    else:
        return jsonify({'error': 'Failed to transcribe the audio'}), 500
    

# Route to handle report queries
@app.route('/api/report-query', methods=['POST'])
def handle_report_query():
    data = request.get_json()
    query = data.get("query")

    if not query:
        return jsonify({"error": "No query provided"}), 400

    # Print the query to the console for debugging
    print(f"Received report query: {query}")

    # Call the generate_sql_query function to generate SQL query
    sql_query = generate_sql_query(query)
    print(sql_query)
    # if sql_query:
    #     return jsonify({"reply": f"{sql_query}"})
    
    if sql_query:
        result = execute_sql_query(sql_query)
        # print(result)
    #     # return jsonify({"sql": sql_query, "result": result})
        print(result)
        return jsonify(result)

    else:
        return jsonify({"error": "Unable to generate SQL query"}), 400





if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)






