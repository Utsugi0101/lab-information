import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header style={{ padding: '10px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
      <h1 style={{ margin: 0 }}><a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>klis研究室情報</a></h1>
      <nav>
        <ul className={styles.navList}>
          <li><a href="/">Home</a></li> 
          <li><a href="/flow">研究室配属の流れ</a></li>
          <li><a href="/resource">情報源</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
