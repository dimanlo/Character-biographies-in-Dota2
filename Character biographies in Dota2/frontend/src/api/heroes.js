import axios from 'axios';

const API_URL = process.env.REACT_APP_HEROES_API_URL || 'http://localhost:4002';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getHeroes = (params = {}) => {
  return api.get('/api/heroes', { params });
};

export const getHero = (id) => {
  return api.get(`/api/heroes/${id}`);
};

export const createHero = (heroData) => {
  return api.post('/api/heroes', heroData);
};

export const updateHero = (id, heroData) => {
  return api.put(`/api/heroes/${id}`, heroData);
};

export const deleteHero = (id) => {
  return api.delete(`/api/heroes/${id}`);
};

