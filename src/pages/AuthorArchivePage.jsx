import { useParams } from "react-router-dom";
import { articles } from "../data/articles";
import ArticleCard from "../components/ArticleCard";
import Header from "../components/Header";
import styles from './CategoryPage.module.css'; // Reuse styling
import SearchBar from '../components/SearchBar';

function AuthorArchivePage() {
  const { authorSlug } = useParams();
  const { authorName } = useParams(); // step 4


  const now = new Date();
  const fourWeeksAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 28);

  const archivedArticles = articles
    .filter(article =>
      article.author.toLowerCase().replace(/\s+/g, "-") === authorSlug.toLowerCase() &&
      new Date(article.date) < fourWeeksAgo
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

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


  return (
    <div>
      <Header />
        <div className="search-bar-wrapper">
          <SearchBar articles={articles} mode="author" filterValue={authorSlug} />
        </div>
      <main className={styles.container}>
        <h1>{toTitleCase(authorSlug.replace(/-/g, " "))} Articles Archive</h1>
        {archivedArticles.length > 0 ? (
          <section className={styles.recentArticles}>
            {archivedArticles.map((article) => (
              <div key={article.slug} className={styles.articleFadeIn}>
                <ArticleCard article={article} />
              </div>
            ))}
          </section>
        ) : (
          <p>No archived articles found for "{authorSlug}".</p>
        )}
      </main>
    </div>
  );
}

export default AuthorArchivePage;
