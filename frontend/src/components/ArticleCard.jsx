// makes the cards that show the articles

import { Link } from 'react-router-dom';
import styles from './ArticleCard.module.css';

function ArticleCard({ article }) {
  return (
    <div className={`${styles.card} ${styles.articleFadeIn}`}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h2>
            <Link to={`/articles/${article.slug}`} className={styles.link}>
                {article.title}
            </Link>
          </h2>
          <p>{article.summary}</p>
          <div className={styles.meta}>
            <span>{article.author}</span> | <span>{article.date}</span>
          </div>
        </div>
        <img className={styles.image} src={article.image} alt={article.title} />
      </div>
    </div>
  );
}

export default ArticleCard;
