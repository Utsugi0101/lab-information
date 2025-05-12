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
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>教授名</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>分野</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>定員</th>
          </tr>
        </thead>
        <tbody>
          {labs.map((lab) => (
            <tr key={lab.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{lab.professor}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{lab.field}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{lab.capacity}人</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
