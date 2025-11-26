import axios from 'axios';

const API_URL = process.env.REACT_APP_LORE_API_URL || 'http://localhost:4003';

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

export const getHeroRelationships = (heroId) => {
  return api.get(`/api/lore/hero/${heroId}/relationships`);
};

export const createRelationship = (relationshipData) => {
  return api.post('/api/lore/relationships', relationshipData);
};

export const addToFavorites = (heroId) => {
  return api.post('/api/lore/favorites', { hero_id: heroId });
};

export const getFavorites = () => {
  return api.get('/api/lore/favorites');
};

export const removeFromFavorites = (heroId) => {
  return api.delete(`/api/lore/favorites/${heroId}`);
};

