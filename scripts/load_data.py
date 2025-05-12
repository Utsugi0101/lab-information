import sqlite3

# データベースファイルを作成
conn = sqlite3.connect("../backend/db/labs.db")
cursor = conn.cursor()

# テーブル作成
cursor.execute("""
CREATE TABLE IF NOT EXISTS labs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    professor TEXT NOT NULL,
    field TEXT NOT NULL,
    capacity INTEGER NOT NULL
)
""")

# 仮データを登録
labs = [
    ("田中太郎", "人工知能", 5),
    ("鈴木花子", "情報検索", 3),
    ("佐藤次郎", "データベース", 4)
]

cursor.executemany("""
INSERT INTO labs (professor, field, capacity) VALUES (?, ?, ?)
""", labs)

conn.commit()
conn.close()

print("✅ データベースを作成して、データを登録しました！")
