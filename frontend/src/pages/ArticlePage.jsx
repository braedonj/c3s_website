// makes the article

import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/articles';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './ArticlePage.module.css';
import Header from '/src/components/Header.jsx';
import CommentSection from '/src/components/CommentSection.jsx';
import rehypeRaw from "rehype-raw";

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

  if (!article) {return (<div><Header/> <main className= {styles.pageContainer}>
    <p>Article not found.</p> </main> </div>);
  }

  const mainTag = article.tags?.[0]?.toLowerCase() || 'default';


  return (
    
    <div className={`${styles.fullPageGradient} ${styles[mainTag] || ''}`}>
      <Header/>
      <main className={styles.pageContainer}>
        <div className={styles.articleBox}>

         <h1>{article.title}</h1>
         <p><strong>{article.author}</strong> | {article.date}</p>
         {article.image && (<img className={styles.articleImage} src={article.image} alt={article.title} />
         )}
          {/* <img className={styles.articleImage} src={article.image} alt={article.title} /> */}
         {/* <ReactMarkdown className={styles.markdown}>{markdown}</ReactMarkdown> */}
         <div className={styles.markdown}>
           <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
         </div>

         {/* <ReactMarkdown>{markdown}</ReactMarkdown> */}
        </div>
      
        <CommentSection slug={article.slug} isAdmin={true} />
      </main>
    </div>  
  );
}

export default ArticlePage;


