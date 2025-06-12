import pandas as pd
import json

def generate_description(row):
    professor = row.get("professor", "")
    position = row.get("position", "")
    field_raw = str(row.get("field", ""))
    papers_raw = str(row.get("papers", ""))
    explanation = str(row.get("explanation", ""))  # ← 要約せずそのまま使う

    fields = field_raw.split("、")
    papers = papers_raw.split("、")

    field_1 = fields[0] if len(fields) > 0 else ""
    field_2 = fields[1] if len(fields) > 1 else ""
    paper_1 = papers[0] if len(papers) > 0 else ""
    paper_2 = papers[1] if len(papers) > 1 else ""

    description = (
        f"{professor} 研究室（{position}）では、{field_1} や {field_2} を中心に研究が行われています。\n"
        f"近年は「{paper_1}」「{paper_2}」などの研究に取り組んでおり、\n"
        f"研究の背景として「{explanation}」といった問題意識を持っています。"
    )

    return description

def main():
    input_path = "研究室情報 (3).xlsx"  # Excelファイル名（同じフォルダに置く）
    output_path = "labs_with_descriptions.json"  # 出力ファイル名

    # Excel読み込み
    df = pd.read_excel(input_path)

    # 各研究室の紹介文を生成してDataFrameに追加
    df["description"] = df.apply(generate_description, axis=1)

    # 出力用データ（必要な列だけ選択）
    output_data = df[["id", "professor", "position", "field", "papers", "description"]].to_dict(orient="records")

    # JSON形式で保存（UTF-8、読みやすいインデント付き）
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    # コンソール出力も（確認用）
    print("=== 各研究室の紹介文 ===\n")
    for item in output_data:
        print(f"--- {item['professor']} 研究室 ---")
        print(item["description"])
        print()

    print(f"✅ JSONファイルを出力しました: {output_path}")

if __name__ == "__main__":
    main()
