import { useEffect, useState } from "react";
import styles from "./App.module.css";

type Lab = {
  id: number;
  professor: string;
  position: string;
  field: string;
  affiliation: string;
};

function App() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/labs`)
      .then((res) => res.json())
      .then((data) =>
        // 必要な情報だけ抽出
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

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>研究室一覧</h1>
      <div className={styles.cardContainer}>
        {labs.map((lab) => (
          <div key={lab.id} className={styles.labCard}>
            <h2>{lab.professor}（{lab.position}）</h2>
            <p><strong>主専攻:</strong> {lab.affiliation}</p>
            <p><strong>分野:</strong> {lab.field}</p>

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
