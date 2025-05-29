import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/articles';
import ArticleCard from '../components/ArticleCard';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import styles from './CategoryPage.module.css'; // Reuse existing styles

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function AuthorPage() {
  const { authorSlug } = useParams();

  const now = new Date();
  const fourWeeksAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 28);

  // Filter by authorSlug
  const filteredArticles = articles.filter(a => a.authorSlug === authorSlug);

  // Only recent articles
  const recentArticles = filteredArticles
    .filter(article => new Date(article.date) >= fourWeeksAgo)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const displayName = filteredArticles[0]?.author || toTitleCase(authorSlug.replace(/-/g, " "));


  return (
    <>
      <Header />
      <div style={{ maxWidth: '800px', margin: 'auto', padding: '2rem' }}>
        <h1>Articles by {displayName}</h1>

        {recentArticles.length === 0 ? (
          <p>No recent articles found for "{displayName}".</p>
        ) : (
          recentArticles.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))
        )}

        <div className={styles.archiveLinkWrapper}>
          <Link to={`/author/${authorSlug}/archive`} className={styles.archiveLink}>
            View Archived Articles →
          </Link>
        </div>
      </div>
    </>
  );
}

export default AuthorPage;
