from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import json
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os

app = Flask(__name__)
CORS(app)

DB_PATH = "db/labs.db"
DESCRIPTION_JSON = "./recommend/description/labs_with_descriptions.json"

# グローバルキャッシュ
model = None
labs_with_descriptions = None
description_embeddings = None

# =====================
# SQLite接続
# =====================
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# =====================
# モデルと埋め込みの初期化
# =====================
def initialize_model():
    global model, labs_with_descriptions, description_embeddings
    if model is None:
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
    if labs_with_descriptions is None:
        with open(DESCRIPTION_JSON, encoding="utf-8") as f:
            labs_with_descriptions = json.load(f)
    if description_embeddings is None:
        description_texts = [lab["description"] for lab in labs_with_descriptions]
        description_embeddings = model.encode(description_texts)

# =====================
# 研究室一覧取得
# =====================
@app.route("/api/labs", methods=["GET"])
def get_labs():
    conn = get_db_connection()
    labs = conn.execute("SELECT * FROM labs").fetchall()
    conn.close()

    result = [
        {
            "id": lab["id"],
            "professor": lab["professor"],
            "position": lab["position"],
            "field": lab["field"],
            "capacity": lab["capacity"],
            "affiliation": lab["affiliation"],
            "papers": lab["papers"],
            "papersURL": lab["papersURL"],
            "guidanceURL": lab["guidanceURL"]
        }
        for lab in labs
    ]
    return jsonify(result)

# =====================
# ID指定の研究室取得
# =====================
@app.route("/api/labs/<int:lab_id>", methods=["GET"])
def get_lab_by_id(lab_id):
    conn = get_db_connection()
    lab = conn.execute("SELECT * FROM labs WHERE id = ?", (lab_id,)).fetchone()
    conn.close()

    if lab is None:
        return jsonify({"error": "Lab not found"}), 404

    result = {
        "id": lab["id"],
        "professor": lab["professor"],
        "position": lab["position"],
        "field": lab["field"],
        "capacity": lab["capacity"],
        "affiliation": lab["affiliation"],
        "papers": lab["papers"],
        "papersURL": lab["papersURL"],
        "guidanceURL": lab["guidanceURL"]
    }
    return jsonify(result)

# =====================
# 研究室推薦API
# =====================
@app.route("/api/recommend", methods=["POST"])
def recommend():
    initialize_model()  # モデルと埋め込みを遅延ロード

    data = request.get_json()
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"error": "query is required"}), 400

    user_embedding = model.encode([query])
    similarities = cosine_similarity(user_embedding, description_embeddings)[0]
    top_indices = np.argsort(similarities)[::-1][:3]

    recommendations = []
    for i in top_indices:
        lab = labs_with_descriptions[i]
        recommendations.append({
            "id": lab["id"],
            "professor": lab["professor"],
            "position": lab["position"],
            "description": lab["description"],
            "score": round(float(similarities[i]), 3)
        })

    return jsonify({"recommendations": recommendations})

# =====================
# テストページ
# =====================
@app.route("/")
def index():
    return "研究室APIサーバーは稼働中です"

if __name__ == "__main__":
    app.run(debug=True)
