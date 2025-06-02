import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App.tsx';           // 一覧ページ
import Header from './Header.tsx';     // 共通ヘッダー
import LabDetail from './LabDetail.tsx'; // 詳細ページ（新しく作成）
import Flow from './Flow.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/labs/:id" element={<LabDetail />} />
        <Route path="/flow" element={<Flow />} />  {/* 研究室配属の流れページ */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
