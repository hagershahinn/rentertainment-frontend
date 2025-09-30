import React from 'react';
import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/films" className="nav-link">Movies</Link>
        </div>
      </nav>
      <main className="container">
        {children}
      </main>
    </div>
  );
}

export default Layout;
