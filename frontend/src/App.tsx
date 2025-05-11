import { useEffect, useState } from "react";

type Lab = {
  id: number;
  professor: string;
  field: string;
  capacity: number;
};

function App() {
  const [labs, setLabs] = useState<Lab[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/labs")
      .then((res) => res.json())
      .then((data) => setLabs(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>研究室一覧</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {labs.map((lab) => (
          <div
            key={lab.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "200px"
            }}
          >
            <h2>{lab.professor} 研究室</h2>
            <p>分野: {lab.field}</p>
            <p>定員: {lab.capacity}人</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
