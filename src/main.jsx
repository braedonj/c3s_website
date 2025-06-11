import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import ArticlePage from './pages/ArticlePage';
import AuthorPage from './pages/AuthorPage';
import CategoryPage from './pages/CategoryPage';
import CategoryArchivePage from './pages/CategoryArchivePage';
import AuthorArchivePage from './pages/AuthorArchivePage';
import { SpeedInsights } from "@vercel/speed-insights/react"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/author/:authorSlug" element={<AuthorPage />} />
        <Route path="/:categoryName" element={<CategoryPage />} />
        <Route path="/:categoryName/archive" element={<CategoryArchivePage />} />
        <Route path="/author/:authorSlug/archive" element={<AuthorArchivePage />} />


      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

