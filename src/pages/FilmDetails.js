import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { filmsAPI } from '../services/api';

function FilmDetails() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFilmDetails();
  }, [id]);

  const getFilmDetails = async () => {
    try {
      const response = await filmsAPI.getFilmDetails(id);
      if (response.success) {
        setFilm(response.data.film);
        setActors(response.data.actors);
      }
    } catch (error) {
      console.log('error loading film:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading film details...</div>;
  }

  if (!film) {
    return (
      <div className="card">
        <h3>Film not found</h3>
        <Link to="/films">
          <button className="btn">Back to Movies</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>🎬 {film.title}</h1>
        <p>Film Details</p>
      </div>

      <div className="section">
        <div className="card">
          <h3>{film.title}</h3>
          <p>{film.description}</p>
          <div className="film-info">
            <p><strong>Year:</strong> {film.release_year}</p>
            <p><strong>Rating:</strong> {film.rating}</p>
            <p><strong>Category:</strong> {film.category}</p>
            <p><strong>Length:</strong> {film.length} minutes</p>
            <p><strong>Language:</strong> {film.language}</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Cast</h2>
        <div className="grid">
          {actors.map(actor => (
            <div key={actor.actor_id} className="card">
              <h3>{actor.name}</h3>
              <Link to={`/actors/${actor.actor_id}`}>
                <button className="btn">View Actor Details</button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/films">
          <button className="btn btn-secondary">Back to Movies</button>
        </Link>
        <Link to="/">
          <button className="btn">Home</button>
        </Link>
      </div>
    </div>
  );
}

export default FilmDetails;
