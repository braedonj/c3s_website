import './App.css';
import ArticleCard from './components/ArticleCard';
import { articles } from './data/articles';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import { motion } from 'framer-motion';
import { a, b } from 'framer-motion/client';

function App() {
  const now = new Date();
  const threeWeeksAgo = new Date(now.getTime() -1000*60*60*24*21);

  const recentArticles = articles
  .filter(article => new Date(article.date) >= threeWeeksAgo)
  .sort((a,b) => new Date(b.date) - new Date(a.date));
  return (
    <>
    <Header />
    <div>
      <main className="container">
        <h2 className="titleHeading"> Recent Articles</h2>
      {recentArticles.length > 0 ? (
        <section className="recent-articles">
          {recentArticles.map((article, i) => (
            <motion.div
            key={article.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.01 }}
            >
           <ArticleCard article={article} />
         </motion.div>
      ))}
      </section>
      ) : (
        <p>No recent articles found.</p>
      )}

      </main>

      <footer>&copy; 2025 CCCSports</footer>
    </div>

    </>
  );
}

export default App;
