import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getHero } from '../api/heroes';
import { getHeroRelationships, addToFavorites, removeFromFavorites, getFavorites } from '../api/lore';
import './HeroPage.css';

function HeroPage() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [hero, setHero] = useState(null);
  const [relationships, setRelationships] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHeroData();
    if (user) {
      loadFavorites();
    }
  }, [id, user]);

  const loadHeroData = async () => {
    try {
      setLoading(true);
      const [heroResponse, relationshipsResponse] = await Promise.all([
        getHero(id),
        getHeroRelationships(id)
      ]);
      setHero(heroResponse.data);
      setRelationships(relationshipsResponse.data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить данные персонажа');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await getFavorites();
      setFavorites(response.data.map(f => f.hero_id));
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) return;
    
    try {
      const isFavorite = favorites.includes(parseInt(id));
      if (isFavorite) {
        await removeFromFavorites(id);
        setFavorites(favorites.filter(f => f !== parseInt(id)));
      } else {
        await addToFavorites(id);
        setFavorites([...favorites, parseInt(id)]);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error || !hero) {
    return <div className="error-message">{error || 'Персонаж не найден'}</div>;
  }

  const isFavorite = favorites.includes(parseInt(id));

  return (
    <div className="hero-page">
      <div className="hero-detail">
        {hero.bio_image_url && (
          <img src={hero.bio_image_url} alt={hero.name} />
        )}
        <h1>{hero.name}</h1>
        {hero.title && <h2>{hero.title}</h2>}
        {hero.attribute && (
          <span className="attribute-badge">{hero.attribute}</span>
        )}
        
        {user && (
          <button
            className={`btn-favorite ${isFavorite ? 'active' : ''}`}
            onClick={handleToggleFavorite}
          >
            {isFavorite ? '★ В избранном' : '☆ Добавить в избранное'}
          </button>
        )}

        {hero.bio_text && (
          <div className="bio-text">
            <h3>Биография</h3>
            <p>{hero.bio_text}</p>
          </div>
        )}

        {relationships.length > 0 && (
          <div className="relationships">
            <h3>Связи</h3>
            {relationships.map((rel) => (
              <div key={rel.id} className="relationship-item">
                <span className={`relationship-type ${rel.relationship_type}`}>
                  {rel.relationship_type === 'ally' && 'Союзник'}
                  {rel.relationship_type === 'enemy' && 'Враг'}
                  {rel.relationship_type === 'related' && 'Связан'}
                </span>
                <span>Герой ID: {rel.hero_id_1 === parseInt(id) ? rel.hero_id_2 : rel.hero_id_1}</span>
                {rel.description && <p>{rel.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroPage;

