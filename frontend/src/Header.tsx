import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={{ padding: '10px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
      <h1 style={{ margin: 0 }}>klis研究室情報</h1>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '10px' }}>
          <li><a href="/flow">研究室配属の流れ</a></li>
          <li><a href="/resource">情報源</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
