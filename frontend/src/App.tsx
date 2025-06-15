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

  // 主専攻の選択肢を固定し、(協)も含めて判定
  const mainAffiliations = ["すべて", "知識情報システム", "知識科学", "情報資源経営"];

  const recommendedLabIds = recommendations?.map((rec) => rec.professor);
  const recommendedLabs = labs.filter((lab) => recommendedLabIds?.includes(lab.professor));

  // 絞り込みロジック
  const filteredLabs = (recommendations ? recommendedLabs : labs).filter((lab) => {
    if (selectedAffiliation === "すべて") return true;
    // 主専攻を「、」で分割し、(協)を除いたものも含めて判定
    return lab.affiliation.split("、").some((aff) => {
      // (協)を除いた文字列で比較
      const baseAff = aff.replace("(協)", "");
      return baseAff === selectedAffiliation;
    });
  });

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

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>研究室一覧</h1>

      <div className={styles.topControls}>
        <div style={{width: '100%', maxWidth: 900, margin: '0 auto'}}>
          <div className={styles.recommendBox} style={{marginBottom: '1.2rem'}}>
            <h2 className={styles.recommendTitle}>研究室を推薦してもらう</h2>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="興味のある研究内容を入力してください"
              rows={4}
              className={styles.recommendTextarea}
            />
            <div className={styles.recommendBtnRow}>
              <button
                onClick={handleRecommend}
                disabled={loading}
                className={styles.recommendButton}
              >
                {loading ? "検索中..." : "推薦を受ける"}
              </button>
              {recommendations && (
                <button
                  onClick={handleReset}
                  className={styles.recommendReset}
                >リセット</button>
              )}
            </div>
            {error && <p className={styles.recommendError}>{error}</p>}
            {recommendations && (
              <ul className={styles.recommendList}>
                {recommendations.map((rec, i) => (
                  <li key={i}>
                    <strong>{rec.professor}</strong> - 類似度: {rec.score.toFixed(3)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.filterContainer} style={{width: '100%', maxWidth: 900, margin: '0 auto'}}>
            <label htmlFor="affiliationFilter" className={styles.filterLabel}>主専攻で絞り込む:</label>
            <select
              id="affiliationFilter"
              value={selectedAffiliation}
              onChange={(e) => setSelectedAffiliation(e.target.value)}
              className={styles.filterSelect}
              style={{ minWidth: '180px' }}
            >
              {mainAffiliations.map((aff) => (
                <option key={aff} value={aff}>
                  {aff}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.cardContainer}>
        {(recommendations ? recommendedLabs : filteredLabs).map((lab) => (
          <div key={lab.id} className={styles.labCard}>
            <h2>
              {lab.professor}（{lab.position}）
            </h2>
            <p>
              <strong>主専攻:</strong>
              <br />
              {lab.affiliation.split("、").map((a, i) => (
                <span key={i}>
                  {a}
                  <br />
                </span>
              ))}
            </p>
            <p>
              <strong>分野:</strong>
              <br />
              {lab.field.split("、").map((f, i) => (
                <span key={i}>
                  {f}
                  <br />
                </span>
              ))}
            </p>
            <a href={`/labs/${lab.id}`} className={styles.linkButton}>
              詳細を見る
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
