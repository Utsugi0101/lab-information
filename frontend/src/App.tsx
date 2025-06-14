import { useEffect, useState } from "react";
import styles from "./App.module.css";

type Lab = {
  id: number;
  professor: string;
  position: string;
  field: string;
  affiliation: string;
};

type Recommendation = {
  professor: string;
  score: number;
};

function App() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedAffiliation, setSelectedAffiliation] = useState<string>("すべて");
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/labs`)
      .then((res) => res.json())
      .then((data) =>
        setLabs(
          data.map((lab: any) => ({
            id: lab.id,
            professor: lab.professor,
            position: lab.position,
            field: lab.field,
            affiliation: lab.affiliation,
          }))
        )
      )
      .catch((err) => console.error("API fetch error:", err));
  }, [API_URL]);

  const affiliations = Array.from(new Set(labs.map((lab) => lab.affiliation)));

  const filteredLabs =
    selectedAffiliation === "すべて"
      ? labs
      : labs.filter((lab) => lab.affiliation === selectedAffiliation);

  const handleRecommend = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setError("推薦APIの通信に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecommendations(null);
    setQuery("");
    setError("");
  };

  const recommendedLabIds = recommendations?.map((rec) => rec.professor);
  const recommendedLabs = labs.filter((lab) => recommendedLabIds?.includes(lab.professor));
  
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>研究室一覧</h1>

      <div className={styles.recommendBox}>
        <h2>研究室を推薦してもらう</h2>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="興味のある研究内容を入力してください"
          rows={4}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <div>
          <button onClick={handleRecommend} disabled={loading}>
            {loading ? "検索中..." : "推薦を受ける"}
          </button>
          {recommendations && (
            <button onClick={handleReset} style={{ marginLeft: "1rem" }}>
              リセット
            </button>
          )}
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {recommendations && (
          <ul>
            {recommendations.map((rec, i) => (
              <li key={i}>
                <strong>{rec.professor}</strong> - 類似度: {rec.score.toFixed(3)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {!recommendations && (
        <div className={styles.filterContainer}>
          <label htmlFor="affiliationFilter">主専攻で絞り込む: </label>
          <select
            id="affiliationFilter"
            value={selectedAffiliation}
            onChange={(e) => setSelectedAffiliation(e.target.value)}
          >
            <option value="すべて">すべて</option>
            {affiliations.map((aff) => (
              <option key={aff} value={aff}>
                {aff}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.cardContainer}>
        {(recommendations ? recommendedLabs : filteredLabs).map((lab) => (
          <div key={lab.id} className={styles.labCard}>
            <h2>
              {lab.professor}（{lab.position}）
            </h2>
            <p>
              <strong>主専攻:</strong> {lab.affiliation}
            </p>
            <p>
              <strong>分野:</strong> {lab.field}
            </p>
            <a href={`/labs/${lab.id}`} className={styles.linkButton}>
              詳細を見る
            </a>
          </div>
        ))}
      </div>
  // フィルタリング処理
  const filteredLabs = labs.filter((lab) => {
    const professorMatch = lab.professor.includes(professorFilter);
    const fieldMatch = lab.field.includes(fieldFilter);
    return professorMatch && fieldMatch;
  });

  const affiliations = Array.from(new Set(labs.map((lab) => lab.affiliation)));

  const filteredLabs =
    selectedAffiliation === "すべて"
      ? labs
      : labs.filter((lab) => lab.affiliation === selectedAffiliation);

  const handleRecommend = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setError("推薦APIの通信に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecommendations(null);
    setQuery("");
    setError("");
  };

  // 推薦結果から対応する研究室情報を取得
  const recommendedLabIds = recommendations?.map((rec) => rec.professor);
  const recommendedLabs = labs.filter((lab) => recommendedLabIds?.includes(lab.professor));


export default App;
