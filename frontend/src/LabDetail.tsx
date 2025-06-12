import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./LabDetail.module.css";


type Lab = {
  id: number;
  professor: string;
  position: string;
  field: string;
  capacity: number;
  affiliation: string;
  papers: string;
  papersURL: string;
  guidanceURL: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export default function LabDetail() {
  const { id } = useParams<{ id: string }>();
  const [lab, setLab] = useState<Lab | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/labs/${id}`)
      .then((res) => res.json())
      .then((data) => setLab(data))
      .catch((err) => console.error("API fetch error:", err));
  }, [id]);

  if (!lab) return <p>読み込み中...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>{lab.professor}（{lab.position}）研究室の詳細</h1>
      <p><strong>主専攻:</strong> {lab.affiliation}</p>
      <p><strong>分野:</strong> {lab.field}</p>
      <p><strong>定員:</strong> {lab.capacity}人</p>

      {/* 論文一覧 */}
      {lab.papers && lab.papersURL && (
        <div>
          <strong>関連論文:</strong>
          <ul>
            {lab.papers.split(",").map((title, i) => (
              <li key={i}>
                <a
                  href={lab.papersURL.split(",")[i]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {title.trim()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ガイダンス資料 */}
      {lab.guidanceURL && (
        <p>
          <a
            href={lab.guidanceURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            2025年度卒業指導方針
          </a>
        </p>
      )}

      {/* 戻る */}
      <p>
        <Link to="/">← 一覧に戻る</Link>
      </p>
    </div>
  );
}
