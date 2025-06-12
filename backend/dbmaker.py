import csv
import sqlite3
import os

def csv_to_sqlite(csv_path, db_path, table_name="labs"):
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)

        conn = sqlite3.connect(db_path)
        cur = conn.cursor()

        columns = ', '.join([f'"{header}" TEXT' for header in headers])
        cur.execute(f'DROP TABLE IF EXISTS "{table_name}"')
        cur.execute(f'CREATE TABLE "{table_name}" ({columns})')

        for row in reader:
            placeholders = ', '.join(['?'] * len(row))
            cur.execute(f'INSERT INTO "{table_name}" VALUES ({placeholders})', row)

        conn.commit()
        conn.close()

# ここで関数を使う（パスは適宜書き換える）
if __name__ == "__main__":
    csv_to_sqlite("./db/csv/研究室情報 - シート1.csv", "./db/labs.db")
