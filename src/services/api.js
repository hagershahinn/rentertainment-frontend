import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const landingAPI = {
  getTopRentedFilms: async () => {
    const response = await api.get('/films/top-rented');
    return response.data;
  },

  getTopActors: async () => {
    const response = await api.get('/actors/top-actors');
    return response.data;
  }
};

export const filmsAPI = {
  getAllFilms: async () => {
    const response = await api.get('/films');
    return response.data;
  },

  getFilmDetails: async (filmId) => {
    const response = await api.get(`/films/${filmId}`);
    return response.data;
  },

  searchFilms: async (query) => {
    const response = await api.get(`/films/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getCustomers: async () => {
    const response = await api.get('/customers');
    return response.data;
  },

  rentFilm: async (filmId, customerId) => {
    const response = await api.post('/rentals', { filmId, customerId });
    return response.data;
  }
};

export const actorsAPI = {
  getActorDetails: async (actorId) => {
    const response = await api.get(`/actors/${actorId}`);
    return response.data;
  }
};

export const rentalsAPI = {
  getCustomers: async () => {
    const response = await api.get('/customers');
    return response.data;
  },

  rentFilm: async (filmId, customerId) => {
    const response = await api.post('/rentals', { filmId, customerId });
    return response.data;
  }
};

export default api;
