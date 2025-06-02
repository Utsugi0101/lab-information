function Resource() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ borderBottom: '2px solid #4caf50', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        情報源
      </h1>
      <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: '2' }}>
        <li>
          <a href="https://klis.tsukuba.ac.jp/2306.html" target="_blank" rel="noopener noreferrer">
            教員別卒業研究指導方針（2025年度）
          </a>
        </li>
        <li>
          <a href="https://klis.tsukuba.ac.jp/assets/files/teiin20250223.pdf" target="_blank" rel="noopener noreferrer">
            各研究室の定員（PDF）
          </a>
        </li>
        <li>
          <a href="https://klis.tsukuba.ac.jp/2367.html" target="_blank" rel="noopener noreferrer">
            2024年度卒業論文
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Resource;