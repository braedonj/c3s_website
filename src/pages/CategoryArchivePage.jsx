import { useParams } from "react-router-dom";
import { articles } from "../data/articles";
import ArticleCard from "../components/ArticleCard";
import Header from "../components/Header";
import styles from './CategoryPage.module.css';
import SearchBar from '../components/SearchBar';

const categoryDisplayNames = {
  nfl: "NFL",
  nba: "NBA",
  mlb: "MLB",
  cfb: "College Football",
  cbb: "College Basketball",
  olympic: "Olympic",
  other: "Other",
};

function ArchiveCategoryPage() {
  const { categoryName } = useParams();

  const now = new Date();
  const threeWeeksAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 21);

  const filteredArticles = articles.filter(article =>
    article.tags.map(tag => tag.toLowerCase()).includes(categoryName.toLowerCase())
  );

  const archivedArticles = filteredArticles
    .filter(article => new Date(article.date) < threeWeeksAgo)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <Header />
        <div className="search-bar-wrapper">
          <SearchBar articles={articles} mode="category" filterValue={categoryName} />
        </div>
      <main className={styles.container}>
        <h2 className={styles.categoryHeading}>
         {categoryDisplayNames[categoryName.toLowerCase()] || categoryName} Articles Archive
        </h2>


        {archivedArticles.length > 0 ? (
          <section className={styles.recentArticles}>
            {archivedArticles.map((article) => (
              <div key={article.slug} className={styles.articleFadeIn}>
                <ArticleCard article={article} />
              </div>
            ))}
          </section>
        ) : (
          <p>No archived articles found for "{categoryDisplayNames[categoryName.toLowerCase()] || categoryName}".</p>
        )}
      </main>
    </div>
  );
}

export default ArchiveCategoryPage;
