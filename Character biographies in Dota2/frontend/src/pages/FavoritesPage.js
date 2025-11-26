import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getFavorites, removeFromFavorites } from '../api/lore';
import { getHero } from '../api/heroes';
import './FavoritesPage.css';

function FavoritesPage() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [favoriteHeroes, setFavoriteHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadFavorites();
  }, [user, navigate]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoritesResponse = await getFavorites();
      const favoriteIds = favoritesResponse.data.map(f => f.hero_id);
      
      // Загружаем информацию о каждом персонаже
      const heroesPromises = favoriteIds.map(heroId => getHero(heroId));
      const heroesResponses = await Promise.all(heroesPromises);
      const heroes = heroesResponses.map(response => response.data);
      
      setFavoriteHeroes(heroes);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить избранное');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (heroId, e) => {
    e.stopPropagation();
    try {
      await removeFromFavorites(heroId);
      setFavoriteHeroes(favoriteHeroes.filter(hero => hero.id !== heroId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      alert('Ошибка при удалении из избранного');
    }
  };

  const handleHeroClick = (id) => {
    navigate(`/hero/${id}`);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="favorites-page">
      <h1>Избранное</h1>
      
      {error && <div className="error-message">{error}</div>}

      {favoriteHeroes.length === 0 && !loading && (
        <div className="no-favorites">
          <p>У вас пока нет избранных персонажей</p>
          <p>Добавьте персонажей в избранное, чтобы быстро к ним возвращаться</p>
        </div>
      )}

      <div className="heroes-grid">
        {favoriteHeroes.map((hero) => (
          <div
            key={hero.id}
            className="hero-card favorite-card"
            onClick={() => handleHeroClick(hero.id)}
          >
            {hero.bio_image_url && (
              <img src={hero.bio_image_url} alt={hero.name} />
            )}
            <h3>{hero.name}</h3>
            {hero.title && <p>{hero.title}</p>}
            {hero.attribute && (
              <span className="attribute-badge">{hero.attribute}</span>
            )}
            <button
              className="btn-remove-favorite"
              onClick={(e) => handleRemoveFavorite(hero.id, e)}
              title="Удалить из избранного"
            >
              ★
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;

