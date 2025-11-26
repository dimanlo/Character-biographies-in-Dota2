import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHeroes } from '../api/heroes';
import './HomePage.css';

function HomePage() {
  const [heroes, setHeroes] = useState([]);
  const [allHeroes, setAllHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadHeroes();
  }, []);

  useEffect(() => {
    filterHeroes();
  }, [searchQuery, allHeroes, filter]);

  const loadHeroes = async () => {
    try {
      setLoading(true);
      const response = await getHeroes({ limit: 200 });
      setAllHeroes(response.data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить персонажей');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterHeroes = () => {
    let filtered = [...allHeroes];
    
    if (filter) {
      filtered = filtered.filter(hero => hero.attribute === filter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(hero => 
        hero.name.toLowerCase().includes(query) ||
        (hero.title && hero.title.toLowerCase().includes(query))
      );
    }
    
    setHeroes(filtered);
  };

  const handleHeroClick = (id) => {
    navigate(`/hero/${id}`);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="home-page">
      <h1>Персонажи Dota 2</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск персонажа..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="filters">
        <button
          className={filter === '' ? 'active' : ''}
          onClick={() => setFilter('')}
        >
          Все
        </button>
        <button
          className={filter === 'STR' ? 'active' : ''}
          onClick={() => setFilter('STR')}
        >
          Сила
        </button>
        <button
          className={filter === 'AGI' ? 'active' : ''}
          onClick={() => setFilter('AGI')}
        >
          Ловкость
        </button>
        <button
          className={filter === 'INT' ? 'active' : ''}
          onClick={() => setFilter('INT')}
        >
          Интеллект
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="heroes-grid">
        {heroes.map((hero) => (
          <div
            key={hero.id}
            className="hero-card"
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
          </div>
        ))}
      </div>

      {heroes.length === 0 && !loading && (
        <div className="no-heroes">Персонажи не найдены</div>
      )}
    </div>
  );
}

export default HomePage;

