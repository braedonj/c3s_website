import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
        const currentY = window.scrollY;

        setVisible(currentY < lastScrollY || currentY < 80);
        setScrolled(currentY > 10); // Add shadow if you've scrolled even a little

        setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

  return (
    <header className={`site-header ${visible ? 'visible' : 'hidden'} ${scrolled ? 'scrolled' : ''}`}>
      {/* 🔷 Logo on top */}
      <div className="header-top">
        <div className="logo-container">
          <Link to="/">
            <img src="/images/Blue Logo C3S.png" alt="C3S Logo" className="logo" />
          </Link>
        </div>

        <div className="author-buttons">
          <Link to="/author/braedon-jones">
            <button className="author-btn" title="Braedon Jones">🦅</button>
          </Link>
          <Link to="/author/joseph-whiting">
            <button className="author-btn" title="Joseph Whiting">❄️</button>
          </Link>
          <Link to="/author/ryan-earl">
            <button className="author-btn" title="Ryan Earl">⁉️</button>
          </Link>
          <Link to="/author/bj-muhlestein">
            <button className="author-btn" title="BJ Muhlestein">🐊</button>
          </Link>
          <Link to="/author/zach-taylor">
            <button className="author-btn" title="Zach Taylor">💰</button>
          </Link>
          <Link to="/author/jason-cannon">
            <button className="author-btn" title="Jason Cannon">🍬</button>
          </Link>
          <Link to="/author/cory-lemons">
            <button className="author-btn" title="Cory Lemons">👻</button>
          </Link>
          <Link to="/author/tucker-knudsen">
            <button className="author-btn" title="Tucker Knudsen">🌪️</button>
          </Link>
          <Link to="/author/josh-brown">
            <button className="author-btn" title="Josh Brown">🌅</button>
          </Link>
        </div>
      </div>

      {/* ✅ Green bar now below logo */}
      <div className="top-bar">
        <nav className="sports-nav">
          <Link to="/nfl">NFL</Link>
          <Link to="/nba">NBA</Link>
          <Link to="/cfb">CFB</Link>
          <Link to="/cbb">CBB</Link>
          <Link to="/mlb">MLB</Link>
          <Link to="/olympic">Olympic</Link>
          <Link to="/other">Other</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
