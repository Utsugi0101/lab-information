import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type Lab = {
  id: number;
  professor: string;
  field: string;
  capacity: number;
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
    <div>
      <h1>{lab.professor} 研究室の詳細</h1>
      <p><strong>分野:</strong> {lab.field}</p>
      <p><strong>定員:</strong> {lab.capacity}人</p>
    </div>
  );
}
