import { useEffect, useState } from "react";
import styles from "./App.module.css";

type Lab = {
  id: number;
  professor: string;
  field: string;
  capacity: number;
};

function App() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/labs`)
      .then((res) => res.json())
      .then((data) => setLabs(data))
      .catch((err) => console.error("API fetch error:", err));
  }, [API_URL]);
  
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>研究室一覧</h1>
      <div className={styles.cardContainer}>
        {labs.map((lab) => (
          <div key={lab.id} className={styles.labCard}>
            <h2>{lab.professor}</h2>
            <p><strong>分野:</strong> {lab.field}</p>
            <p><strong>定員:</strong> {lab.capacity}人</p>
            <div className={styles.labCardContent}></div>
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

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>研究室一覧</h1>
      <div className={styles.cardContainer}>
        {labs.map((lab) => (
          <div key={lab.id} className={styles.labCard}>
            <h2>{lab.professor}</h2>
            <p><strong>分野:</strong> {lab.field}</p>
            <p><strong>定員:</strong> {lab.capacity}人</p>
            <div className={styles.labCardContent}></div>
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