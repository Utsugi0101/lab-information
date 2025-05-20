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

  // ✅ 環境変数を使う
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
  fetch(`${API_URL}/api/labs`)
    .then((res) => res.json())
    .then((data) => setLabs(data))
    .catch((err) => console.error("API fetch error:", err));
}, [API_URL]);

  return (
    <div className={styles.container}>
      <h1>研究室一覧</h1>
      <table className={styles.labTable}>
        <thead>
          <tr>
            <th>教授名</th>
            <th>分野</th>
            <th>定員</th>
          </tr>
        </thead>
        <tbody>
          {labs.map((lab) => (
            <tr key={lab.id}>
              <td>
                <a href={`/labs/${lab.id}`}>{lab.professor}</a>
              </td>
              <td>{lab.field}</td>
              <td>{lab.capacity}人</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
