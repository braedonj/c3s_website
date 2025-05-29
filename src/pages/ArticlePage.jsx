// makes the article

import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/articles';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './ArticlePage.module.css';
import Header from '/src/components/Header.jsx';

function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug.toString() === slug);
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    if (article?.contentPath) {
      fetch(article.contentPath)
        .then(res => res.text())
        .then(setMarkdown)
        .catch(console.error);
    }
  }, [article]);

  if (!article) return <div>Article not found.</div>;

  return (
    <>
    <div>
      <Header/>
    </div>

    <div style={{ maxWidth: '800px', margin: 'auto', padding: '2rem' }}>
      <h1>{article.title}</h1>
      <p><strong>{article.author}</strong> | {article.date}</p>
      <img className={styles.articleImage} src={article.image} alt={article.title} />
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
    </>
  );
}

export default ArticlePage;
