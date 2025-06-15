import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./LabDetail.module.css"; // スタイルを追加


type Lab = {
  id: number;
  professor: string;
  position: string;
  field: string;
  capacity: number;
  affiliation: string;
  papers: string;     // 句点区切りのタイトル
  papersURL: string;  // カンマ区切りのURL
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

  // 句点でタイトルを分割（空白や空要素を除外）
  const paperTitles = lab.papers
    .split("、")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const paperURLs = lab.papersURL
    .split(/\s*,\s*/); // 空白ありのカンマにも対応

  // 主専攻・協力専攻ごとの定員を表示するロジック
  const capacityInfo: { [key: string]: string } = {
    '知識情報システム': '3人',
    '知識科学': '3人',
    '情報資源経営': '3人',
    '知識情報システム(協)': '0~2人',
    '知識科学(協)': '0~2人',
    '情報資源経営(協)': '0~2人',
  };

  // 主専攻・協力専攻を配列で取得
  const affiliations = lab.affiliation.split('、').map(a => a.trim()).filter(a => a.length > 0);

  return (
  <div className={styles.detailCard}> {/* ここを修正 */}
    <h1>{lab.professor}（{lab.position}）研究室の詳細</h1>
    <p><strong>主専攻:</strong> {lab.affiliation}</p>
    <p><strong>分野:</strong> {lab.field}</p>
    <p><strong>定員:</strong><br />
      {affiliations.map((aff, i) => (
        <span key={i}>
          {aff}: {capacityInfo[aff] ?? '-'}<br />
        </span>
      ))}
    </p>

    {/* 論文一覧 */}
    {paperTitles.length > 0 && paperURLs.length > 0 && (
      <div>
        <strong>2024年度卒業論文:</strong>
        <ul>
          {paperTitles.map((title, i) => (
            <li key={i}>
              <a
                href={paperURLs[i] ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
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
