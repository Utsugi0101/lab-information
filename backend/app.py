from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB_PATH = "db/labs.db"  # データベースファイルのパス

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # 辞書型で受け取れるように
    return conn

@app.route("/api/hello")
def hello():
    return jsonify(message="Hello from Flask!")

@app.route("/api/labs")
def get_labs():
    conn = get_db_connection()
    labs = conn.execute("SELECT * FROM labs").fetchall()
    conn.close()

    labs_list = []
    for lab in labs:
        labs_list.append({
            "id": lab["id"],
            "professor": lab["professor"],
            "field": lab["field"],
            "capacity": lab["capacity"]
        })

    return jsonify(labs_list)
