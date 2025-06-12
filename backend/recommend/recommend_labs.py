import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# モデル読み込み（日本語対応、軽量・高速）
model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

# データ読み込み
with open("./description/labs_with_descriptions.json", encoding="utf-8") as f:
    labs = json.load(f)

# 各研究室の紹介文をベクトル化（embedding）
descriptions = [lab["description"] for lab in labs]
description_embeddings = model.encode(descriptions)

# ユーザー入力
user_input = input("あなたの興味のある研究内容を自然文で入力してください：\n> ")

# 入力文をベクトル化
user_embedding = model.encode([user_input])

# コサイン類似度を計算
similarities = cosine_similarity(user_embedding, description_embeddings)[0]

# 上位3件のインデックスを取得
top_indices = np.argsort(similarities)[::-1][:3]

# 結果表示
print("\n=== あなたに合いそうな研究室 ===\n")
for i in top_indices:
    lab = labs[i]
    score = similarities[i]
    print(f"{lab['professor']}（{lab['position']}）")
    print(f"類似度スコア: {score:.3f}")
    print(lab["description"])
    print("-" * 50)
