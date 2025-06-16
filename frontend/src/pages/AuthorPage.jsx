import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/articles';
import ArticleCard from '../components/ArticleCard';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import styles from './CategoryPage.module.css'; // Reuse existing styles
import styles2 from './AuthorPage.module.css';
import { useState} from 'react';
import { authorLogos } from '../data/authorLogo';
import { useEffect } from 'react';
import SearchBar from '../components/SearchBar';


// import { useState, useEffect } from 'react';

function toTitleCase(str) {
  const exceptions = {
    bj: 'BJ'
    // add more special cases here if needed
  };

  // Default behavior for other names
  return str
    .toLowerCase()
    .split(' ')
    .map(word => exceptions[word] || word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function AuthorPage() {
  const { authorSlug } = useParams();
  const [showLogos, setShowLogos] = useState(false);
  const { authorName } = useParams();


useEffect(() => {
  const handleScroll = () => {
    const isAtTop = window.scrollY < 20;
    const root = document.documentElement;
    root.style.setProperty('--logo-top', isAtTop ? '250px' : '20px');
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
  }, []);


function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

  const now = new Date();
  const fourWeeksAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 28);

  // Filter by authorSlug
  const filteredArticles = articles.filter(a => a.authorSlug === authorSlug);

  // Only recent articles
  const recentArticles = filteredArticles
    .filter(article => new Date(article.date) >= fourWeeksAgo)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const authorInfo = authorLogos.find(a => a.authorSlug === authorSlug);
  const favoriteTeams = authorInfo?.favoriteTeams || [];

  const displayName =
  filteredArticles[0]?.author || toTitleCase(authorSlug.replace(/-/g, ' '));

  const isMobile = useIsMobile();

  return (
    <div>
      <Header />
        <div className="search-bar-wrapper">
          <SearchBar articles={articles} mode="author" filterValue={authorSlug} />
         </div>
        {showLogos && (
          <>
            <div className={styles2.logoColumnLeft}>
               {favoriteTeams.map((team, i) => (
                 <img key={i} src={team.logo} alt={team.name} className={styles2.teamLogo} />
               ))}
            </div>
            <div className={styles2.logoColumnRight}>
               {favoriteTeams.map((team, i) => (
                <img key={i} src={team.logo} alt={team.name} className={styles2.teamLogo} />
              ))}
             </div>
          </>
        )}

      <div className={styles2.pageContainer}>
        <h1
          className={styles2.authorHeading}
         {...(isMobile
           ? { onClick: () => setShowLogos(prev => !prev) }
            : {
                onMouseEnter: () => setShowLogos(true),
                onMouseLeave: () => setShowLogos(false),
            })}
        >
          Articles by {displayName}
        </h1>

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
    </div>
  );
}

export default AuthorPage;
