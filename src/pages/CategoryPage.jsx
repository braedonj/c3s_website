import { useParams, Link } from "react-router-dom";
import { articles } from "../data/articles";
import ArticleCard from "../components/ArticleCard";
import Header from "../components/Header";
import styles from './CategoryPage.module.css';

const categoryDisplayNames = {
  nfl: "NFL",
  nba: "NBA",
  mlb: "MLB",
  cfb: "College Football",
  cbb: "College Basketball",
  olympic: "Olympic",
  other: "Other",
};

function CategoryPage() {
  const { categoryName } = useParams();
  const categoryClass = styles[categoryName.toLowerCase()] || '';

  const now = new Date();
  const threeWeeksAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 21);

  const filteredArticles = articles.filter(article =>
    article.tags.map(tag => tag.toLowerCase()).includes(categoryName.toLowerCase())
  );

  const recentArticles = filteredArticles
    .filter(article => new Date(article.date) >= threeWeeksAgo)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className={`${styles.fullPageGradient} ${styles[categoryName.toLowerCase()] || ''}`}>
      <Header />
      <main className={styles.container}>
        <h2 className={styles.categoryHeading}>
             {(categoryDisplayNames[categoryName.toLowerCase()] || categoryName)} Articles
        </h2>



        {recentArticles.length > 0 ? (
          <section className={styles.recentArticles}>
            {recentArticles.map((article) => (
              <div key={article.slug} className={styles.articleFadeIn}>
                <ArticleCard article={article} />
              </div>
            ))}
          </section>
        ) : (
          <p>No recent articles found for "{categoryDisplayNames[categoryName.toLowerCase()] || categoryName}".</p>
        )}

        <div className={styles.archiveLinkWrapper}>
          <Link to={`/${categoryName.toLowerCase()}/archive`} className={styles.archiveLink}>
            View Archived Articles →
          </Link>
        </div>
      </main>
    </div>
  );
}

export default CategoryPage;
