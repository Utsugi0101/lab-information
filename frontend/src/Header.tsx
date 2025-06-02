import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>klis研究室情報</h1>
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
