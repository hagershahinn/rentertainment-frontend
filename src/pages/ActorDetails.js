import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { actorsAPI } from '../services/api';

function ActorDetails() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [topFilms, setTopFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActorDetails();
  }, [id]);

  const getActorDetails = async () => {
    try {
      const response = await actorsAPI.getActorDetails(id);
      if (response.success) {
        setActor(response.data.actor);
        setTopFilms(response.data.topFilms);
      }
    } catch (error) {
      console.log('error loading actor:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading actor details...</div>;
  }

  if (!actor) {
    return (
      <div className="card">
        <h3>Actor not found</h3>
        <Link to="/">
          <button className="btn">Back to Home</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>🌟 {actor.name}</h1>
        <p>Actor Details</p>
      </div>

      <div className="section">
        <div className="card">
          <h3>{actor.name}</h3>
          <div className="film-info">
            <p><strong>Total Rentals:</strong> {actor.total_rentals}</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Top 5 Rented Films</h2>
        <div className="grid">
          {topFilms.map(film => (
            <div key={film.film_id} className="card">
              <h3>{film.title}</h3>
              <p>{film.description}</p>
              <div className="film-info">
                <p><strong>Category:</strong> {film.category}</p>
                <p><strong>Rating:</strong> {film.rating}</p>
                <p><strong>Rentals:</strong> {film.rental_count}</p>
              </div>
              <Link to={`/films/${film.film_id}`}>
                <button className="btn">View Film Details</button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/">
          <button className="btn btn-secondary">Back to Home</button>
        </Link>
      </div>
    </div>
  );
}

export default ActorDetails;
