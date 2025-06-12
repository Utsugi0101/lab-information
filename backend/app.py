from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)
CORS(app)

DB_PATH = "db/labs.db"  # SQLiteデータベースのパス
DESCRIPTION_JSON = "./recommend/description/labs_with_descriptions.json"  # 生成した紹介文付きJSON

# =====================
# 推薦エンジンの初期化
# =====================
model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

with open(DESCRIPTION_JSON, encoding="utf-8") as f:
    labs_with_descriptions = json.load(f)

description_texts = [lab["description"] for lab in labs_with_descriptions]
description_embeddings = model.encode(description_texts)

# =====================
# SQLite接続
# =====================
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

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
# テストページルート
# =====================
@app.route("/")
def index():
    return "研究室APIサーバーは稼働中です"

if __name__ == "__main__":
    app.run(debug=True)
