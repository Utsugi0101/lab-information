from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB_PATH = "db/labs.db"  # SQLiteデータベースのパス

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Rowをdictのように扱う
    return conn

# すべての研究室情報を取得
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

# 特定のIDの研究室情報を取得
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

if __name__ == "__main__":
    app.run(debug=True)
