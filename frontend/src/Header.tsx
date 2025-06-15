import React, { useEffect, useRef, useState } from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(window.scrollY);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  // スクロール方向でヘッダー表示制御
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 10) {
        setShow(true);
        lastScrollY.current = currentY;
        return;
      }
      if (currentY < lastScrollY.current) {
        setShow(true); // 上方向
      } else if (currentY > lastScrollY.current) {
        setShow(false); // 下方向
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // スワイプでヘッダー表示制御
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY.current = e.changedTouches[0].clientY;
      if (
        touchStartY.current !== null &&
        touchEndY.current !== null &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 && // ページ下部
        touchStartY.current - touchEndY.current > 40 // 上方向スワイプ
      ) {
        setShow(true);
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <header className={styles.header} style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'transform 0.3s',
      transform: show ? 'translateY(0)' : 'translateY(-120%)',
    }}>
      <h1 className={styles.title}>
        <a href="/" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-block', width: '100%' }}>klis研究室情報</a>
      </h1>
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
