function Flow() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ borderBottom: '2px solid #4caf50', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        研究室配属の流れ（2024年度の場合）
      </h1>
      <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: '2' }}>
        <li>
          <strong>10/1：</strong>教員別の卒業研究指導方針が公表
        </li>
        <li>
          <strong>10/10〜：</strong>個別面談解禁
        </li>
        <li>
          <strong>10/21〜：</strong>
          <a href="https://hope.slis.tsukuba.ac.jp/" target="_blank" rel="noopener noreferrer">
            希望研究室システム
          </a>
          に登録開始
        </li>
        <li>
          <strong>11月上旬：</strong>研究室決定
        </li>
      </ul>
    </div>
  );
}

export default Flow;
