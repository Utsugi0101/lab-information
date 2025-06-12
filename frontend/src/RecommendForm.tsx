import { useState } from "react";

type Recommendation = {
  professor: string;
  score: number;
};

export default function RecommendForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error("API Error");
      }

      const data = await res.json();
      setResults(data.recommendations);
    } catch (err: any) {
      setError("通信に失敗しました。Flask サーバーが起動しているか確認してください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>研究室推薦</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={4}
        style={{ width: "100%", marginBottom: "1rem" }}
        placeholder="興味のある研究内容を入力してください"
      />
      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "検索中..." : "推薦を受ける"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ marginTop: "1rem" }}>
        {results.map((item, index) => (
          <li key={index}>
            <strong>{item.professor}</strong> - 類似度: {item.score.toFixed(3)}
          </li>
        ))}
      </ul>
    </div>
  );
}
