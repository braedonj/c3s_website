import { useState, useEffect, useRef } from 'react';
import { articles } from '../data/articles';
import { Link } from 'react-router-dom';
import './SearchBar.css';
import { useLocation } from 'react-router-dom';

function SearchBar({ articles, mode = 'all', filterValue = '' }) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef(null);
  const location = useLocation();

// Reset query when the path changes
useEffect(() => {
  setQuery('');
}, [location.pathname]);


  const filteredArticles = articles.filter(article => {
  if (mode === 'author' && filterValue) {
    return article.author.toLowerCase().replace(/\s+/g, '-') === filterValue.toLowerCase();
  }
  if (mode === 'category' && filterValue) {
    return article.tags?.[0]?.toLowerCase() === filterValue.toLowerCase();
  }
  return true; // mode === 'all'
}).filter(article =>
  article.title.toLowerCase().includes(query.toLowerCase())
);
  useEffect(() => {
    setShowResults(query.length > 0);
  }, [query]);

  // Close results on mobile if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        window.innerWidth <= 768
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-bar-container" ref={containerRef}>
      <input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="search-input"
      />

      {showResults && (
       <ul className="search-results">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <li key={article.slug}>
              <Link to={`/articles/${article.slug}`}>{article.title}</Link>
            </li>
          ))
        ) : (
            <li className="no-results">No results found.</li>
          )}
      </ul>
      )}
    </div>
  );
}

export default SearchBar;
