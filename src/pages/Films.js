import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { filmsAPI } from '../services/api';

function Films() {
  const [films, setFilms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentalMode, setRentalMode] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const moviesPerPage = 20;

  useEffect(() => {
    getFilms();
  }, [currentPage]);

  const getFilms = async () => {
    try {
      const response = await filmsAPI.getAllFilms();
      if (response.success) {
        setFilms(response.data);
        setTotalMovies(response.data.length);
      }
    } catch (error) {
      console.log('error:', error);
    }
    setLoading(false);
  };

  const searchFilms = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await filmsAPI.searchFilms(searchQuery);
      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  const startRental = (film) => {
    setSelectedFilm(film);
    setRentalMode(true);
    setCustomerInfo({ firstName: '', lastName: '', email: '' });
  };

  const rentFilm = async () => {
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email) {
      alert('Please fill in all customer information');
      return;
    }
    
    try {
      const response = await filmsAPI.rentFilm(selectedFilm.film_id, customerInfo);
      if (response.success) {
        alert('Movie rented successfully!');
        setRentalMode(false);
        setSelectedFilm(null);
        setCustomerInfo({ firstName: '', lastName: '', email: '' });
      }
    } catch (error) {
      console.log('error:', error);
      alert('Error renting movie');
    }
  };

  const getCurrentPageMovies = () => {
    if (searchResults.length > 0) {
      return searchResults;
    }
    
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    return films.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(totalMovies / moviesPerPage);

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  if (rentalMode) {
    return (
      <div>
        <div className="header">
          <h1>🎬 Rent Movie</h1>
          <p>Rent "{selectedFilm?.title}"</p>
        </div>
        
        <div className="card">
          <h3>Customer Information</h3>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="First Name"
              value={customerInfo.firstName}
              onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
              style={{
                padding: '10px',
                marginBottom: '10px',
                width: '300px',
                backgroundColor: '#3c3c3c',
                color: '#d4d4d4',
                border: '1px solid #3e3e42',
                borderRadius: '4px',
                display: 'block'
              }}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={customerInfo.lastName}
              onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
              style={{
                padding: '10px',
                marginBottom: '10px',
                width: '300px',
                backgroundColor: '#3c3c3c',
                color: '#d4d4d4',
                border: '1px solid #3e3e42',
                borderRadius: '4px',
                display: 'block'
              }}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              style={{
                padding: '10px',
                marginBottom: '20px',
                width: '300px',
                backgroundColor: '#3c3c3c',
                color: '#d4d4d4',
                border: '1px solid #3e3e42',
                borderRadius: '4px',
                display: 'block'
              }}
            />
          </div>
          
          <div>
            <button className="btn" onClick={rentFilm}>
              Rent Movie
            </button>
            <button className="btn-secondary" onClick={() => setRentalMode(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentMovies = getCurrentPageMovies();

  return (
    <div>
      <div className="header">
        <h1>🎬 All Movies</h1>
        <p>Browse our complete collection of {totalMovies} movies</p>
      </div>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by movie name, actor, or genre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchFilms()}
        />
        <button className="btn" onClick={searchFilms}>Search</button>
        {searchResults.length > 0 && (
          <button className="btn-secondary" onClick={() => setSearchResults([])}>
            Clear Search
          </button>
        )}
      </div>

      {searchResults.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '20px', color: '#858585' }}>
          Found {searchResults.length} movies matching "{searchQuery}"
        </div>
      )}

      <div className="grid">
        {currentMovies.map(film => (
          <div key={film.film_id} className="card">
            <h3>{film.title}</h3>
            <p>{film.description}</p>
            <div className="film-info">
              <p><strong>Category:</strong> {film.category}</p>
              <p><strong>Rating:</strong> {film.rating}</p>
              <p><strong>Year:</strong> {film.release_year}</p>
              <p><strong>Length:</strong> {film.length} minutes</p>
            </div>
            <div>
              <Link to={`/films/${film.film_id}`}>
                <button className="btn">View Details</button>
              </Link>
              <button className="btn-secondary" onClick={() => startRental(film)}>
                Rent Film
              </button>
            </div>
          </div>
        ))}
      </div>

      {searchResults.length === 0 && totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            className="btn-secondary" 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{ marginRight: '10px' }}
          >
            Previous
          </button>
          <span style={{ color: '#858585', margin: '0 20px' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="btn-secondary" 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Films;
