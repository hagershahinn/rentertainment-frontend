import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { landingAPI } from '../services/api';

function Landing() {
  const [films, setFilms] = useState([]);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const filmsData = await landingAPI.getTopRentedFilms();
      const actorsData = await landingAPI.getTopActors();
      
      if (filmsData.success) {
        setFilms(filmsData.data);
      }
      if (actorsData.success) {
        setActors(actorsData.data);
      }
    } catch (error) {
      console.log('error:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>🎬 Rentertainment</h1>
        <p>Your ultimate destination for movie rentals and entertainment</p>
      </div>
      
      <div className="section">
        <h2 className="movies-header">Top 5 Rented Movies</h2>
        <div className="grid">
          {films.map(film => (
            <div key={film.film_id} className="card">
              <h3>{film.title}</h3>
              <p>{film.description}</p>
              <div className="film-info">
                <p><strong>Category:</strong> {film.category}</p>
                <p><strong>Rating:</strong> {film.rating}</p>
                <p><strong>Rentals:</strong> {film.rental_count}</p>
                <p><strong>Length:</strong> {film.length} minutes</p>
              </div>
              <Link to={`/films/${film.film_id}`}>
                <button className="btn">View Details</button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Top Actors</h2>
        <div className="grid">
          {actors.map(actor => (
            <div key={actor.actor_id} className="card">
              <h3>{actor.name}</h3>
              <div className="film-info">
                <p><strong>Total Rentals:</strong> {actor.total_rentals}</p>
              </div>
              <Link to={`/actors/${actor.actor_id}`}>
                <button className="btn">View Actor Details</button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/films">
          <button className="btn">Browse All Movies</button>
        </Link>
      </div>
    </div>
  );
}

export default Landing;
