import csv
import sqlite3

DB_PATH = "../backend/db/labs.db"
CSV_PATH = "./labs.csv"

# データベース接続
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# テーブル作成（もしなければ）
cursor.execute("""
CREATE TABLE IF NOT EXISTS labs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    professor TEXT NOT NULL,
    field TEXT NOT NULL,
    capacity INTEGER NOT NULL
)
""")

# 既存データを消す（リセットしたい場合）
cursor.execute("DELETE FROM labs")

# CSVファイルを読み込み
with open(CSV_PATH, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        cursor.execute(
            "INSERT INTO labs (professor, field, capacity) VALUES (?, ?, ?)",
            (row["professor"], row["field"], int(row["capacity"]))
        )

# 保存して終了
conn.commit()
conn.close()

print("✅ データベース作成＆データ投入完了！")
