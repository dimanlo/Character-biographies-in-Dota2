import React, { useState, useEffect } from 'react';
import { getHeroes, createHero, updateHero, deleteHero } from '../api/heroes';
import { createRelationship } from '../api/lore';
import './AdminPage.css';

function AdminPage() {
  const [heroes, setHeroes] = useState([]);
  const [allHeroes, setAllHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingHero, setEditingHero] = useState(null);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [showRelationshipForm, setShowRelationshipForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio_text: '',
    bio_image_url: '',
    attribute: 'STR'
  });
  const [relationshipData, setRelationshipData] = useState({
    hero_id_1: '',
    hero_id_2: '',
    relationship_type: 'ally',
    description: ''
  });

  useEffect(() => {
    loadHeroes();
  }, []);

  const loadHeroes = async () => {
    try {
      setLoading(true);
      // Загружаем всех персонажей несколькими запросами, если нужно
      let allHeroesData = [];
      let page = 1;
      let hasMore = true;
      const limit = 1000;
      let maxPages = 10; // Защита от бесконечного цикла
      
      while (hasMore && page <= maxPages) {
        const response = await getHeroes({ page, limit });
        console.log(`Загрузка страницы ${page}: получено ${response.data?.length || 0} персонажей`);
        
        if (response.data && response.data.length > 0) {
          allHeroesData = [...allHeroesData, ...response.data];
          // Если получили меньше чем лимит, значит это последняя страница
          if (response.data.length < limit) {
            hasMore = false;
          } else {
            page++;
          }
        } else {
          hasMore = false;
        }
      }
      
      setAllHeroes(allHeroesData);
      console.log('Всего загружено персонажей:', allHeroesData.length);
      if (allHeroesData.length > 0) {
        console.log('Примеры загруженных персонажей:', allHeroesData.slice(0, 5).map(h => h.name));
      }
    } catch (err) {
      console.error('Failed to load heroes:', err);
      console.error('Ошибка детали:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allHeroes.length > 0) {
      filterHeroes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, allHeroes]);

  const filterHeroes = () => {
    if (!searchQuery.trim()) {
      setHeroes(allHeroes);
      return;
    }
    
    // Простая нормализация: убираем лишние пробелы и приводим к нижнему регистру
    const normalizeString = (str) => {
      if (!str) return '';
      return str.toLowerCase().trim().replace(/\s+/g, ' ');
    };
    
    const query = normalizeString(searchQuery);
    
    const filtered = allHeroes.filter(hero => {
      if (!hero || !hero.name) return false;
      
      // Нормализуем имя и титул
      const name = normalizeString(hero.name);
      const title = hero.title ? normalizeString(hero.title) : '';
      
      // Проверяем совпадение в имени или титуле (без удаления апострофов)
      const nameMatch = name.includes(query);
      const titleMatch = title.includes(query);
      
      return nameMatch || titleMatch;
    });
    
    console.log(`Поиск "${searchQuery}": найдено ${filtered.length} из ${allHeroes.length} персонажей`);
    if (filtered.length === 0 && allHeroes.length > 0) {
      console.log('Примеры имен персонажей:', allHeroes.slice(0, 10).map(h => h.name));
      console.log('Запрос для поиска:', query);
      // Показываем первые несколько имен для отладки
      const sampleNames = allHeroes.slice(0, 5).map(h => ({
        original: h.name,
        normalized: normalizeString(h.name),
        matches: normalizeString(h.name).includes(query)
      }));
      console.log('Примеры нормализованных имен:', sampleNames);
    }
    setHeroes(filtered);
  };

  const handleCreateHero = async (e) => {
    e.preventDefault();
    try {
      await createHero(formData);
      setShowHeroForm(false);
      setFormData({
        name: '',
        title: '',
        bio_text: '',
        bio_image_url: '',
        attribute: 'STR'
      });
      await loadHeroes();
    } catch (err) {
      console.error('Failed to create hero:', err);
      alert('Ошибка при создании персонажа');
    }
  };

  const handleUpdateHero = async (e) => {
    e.preventDefault();
    try {
      await updateHero(editingHero.id, formData);
      setEditingHero(null);
      setShowHeroForm(false);
      setFormData({
        name: '',
        title: '',
        bio_text: '',
        bio_image_url: '',
        attribute: 'STR'
      });
      await loadHeroes();
    } catch (err) {
      console.error('Failed to update hero:', err);
      alert('Ошибка при обновлении персонажа');
    }
  };

  const handleDeleteHero = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого персонажа?')) {
      return;
    }
    try {
      await deleteHero(id);
      await loadHeroes();
    } catch (err) {
      console.error('Failed to delete hero:', err);
      alert('Ошибка при удалении персонажа');
    }
  };

  const handleCreateRelationship = async (e) => {
    e.preventDefault();
    try {
      await createRelationship({
        ...relationshipData,
        hero_id_1: parseInt(relationshipData.hero_id_1),
        hero_id_2: parseInt(relationshipData.hero_id_2)
      });
      setShowRelationshipForm(false);
      setRelationshipData({
        hero_id_1: '',
        hero_id_2: '',
        relationship_type: 'ally',
        description: ''
      });
      alert('Связь создана успешно');
    } catch (err) {
      console.error('Failed to create relationship:', err);
      alert('Ошибка при создании связи');
    }
  };

  const startEdit = (hero) => {
    setEditingHero(hero);
    setFormData({
      name: hero.name || '',
      title: hero.title || '',
      bio_text: hero.bio_text || '',
      bio_image_url: hero.bio_image_url || '',
      attribute: hero.attribute || 'STR'
    });
    setShowHeroForm(true);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Административная панель</h1>

      <div className="admin-section">
        <div className="section-header">
          <h2>Управление персонажами</h2>
          <button
            className="btn-primary"
            onClick={() => {
              setEditingHero(null);
              setFormData({
                name: '',
                title: '',
                bio_text: '',
                bio_image_url: '',
                attribute: 'STR'
              });
              setShowHeroForm(true);
            }}
          >
            Создать персонажа
          </button>
        </div>

        <div className="admin-search-container">
          <input
            type="text"
            id="admin-search"
            name="admin-search"
            placeholder="Поиск персонажа по имени или титулу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
        </div>

        {showHeroForm && (
          <form
            className="admin-form"
            onSubmit={editingHero ? handleUpdateHero : handleCreateHero}
          >
            <h3>{editingHero ? 'Редактировать' : 'Создать'} персонажа</h3>
            <div className="form-group">
              <label htmlFor="hero-name">Имя *</label>
              <input
                type="text"
                id="hero-name"
                name="hero-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="hero-title">Титул</label>
              <input
                type="text"
                id="hero-title"
                name="hero-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="hero-bio">Биография</label>
              <textarea
                id="hero-bio"
                name="hero-bio"
                value={formData.bio_text}
                onChange={(e) => setFormData({ ...formData, bio_text: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="hero-image-url">URL изображения</label>
              <input
                type="text"
                id="hero-image-url"
                name="hero-image-url"
                value={formData.bio_image_url}
                onChange={(e) => setFormData({ ...formData, bio_image_url: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="hero-attribute">Атрибут</label>
              <select
                id="hero-attribute"
                name="hero-attribute"
                value={formData.attribute}
                onChange={(e) => setFormData({ ...formData, attribute: e.target.value })}
              >
                <option value="STR">Сила</option>
                <option value="AGI">Ловкость</option>
                <option value="INT">Интеллект</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingHero ? 'Сохранить' : 'Создать'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowHeroForm(false);
                  setEditingHero(null);
                }}
              >
                Отмена
              </button>
            </div>
          </form>
        )}

        <div className="heroes-list">
          {heroes.length === 0 && searchQuery && (
            <div className="no-results">
              Персонажи не найдены по запросу "{searchQuery}"
            </div>
          )}
          {heroes.map((hero) => (
            <div key={hero.id} className="admin-hero-item">
              <div className="hero-info">
                <h3>{hero.name}</h3>
                {hero.title && <p>{hero.title}</p>}
                {hero.attribute && <span className="attribute-badge">{hero.attribute}</span>}
              </div>
              <div className="hero-actions">
                <button className="btn-secondary" onClick={() => startEdit(hero)}>
                  Редактировать
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDeleteHero(hero.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <div className="section-header">
          <h2>Управление связями</h2>
          <button
            className="btn-primary"
            onClick={() => setShowRelationshipForm(true)}
          >
            Создать связь
          </button>
        </div>

        {showRelationshipForm && (
          <form className="admin-form" onSubmit={handleCreateRelationship}>
            <h3>Создать связь</h3>
            <div className="form-group">
              <label htmlFor="relationship-hero-1">ID первого героя *</label>
              <input
                type="number"
                id="relationship-hero-1"
                name="relationship-hero-1"
                value={relationshipData.hero_id_1}
                onChange={(e) =>
                  setRelationshipData({ ...relationshipData, hero_id_1: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="relationship-hero-2">ID второго героя *</label>
              <input
                type="number"
                id="relationship-hero-2"
                name="relationship-hero-2"
                value={relationshipData.hero_id_2}
                onChange={(e) =>
                  setRelationshipData({ ...relationshipData, hero_id_2: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="relationship-type">Тип связи *</label>
              <select
                id="relationship-type"
                name="relationship-type"
                value={relationshipData.relationship_type}
                onChange={(e) =>
                  setRelationshipData({ ...relationshipData, relationship_type: e.target.value })
                }
              >
                <option value="ally">Союзник</option>
                <option value="enemy">Враг</option>
                <option value="related">Связан</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="relationship-description">Описание</label>
              <textarea
                id="relationship-description"
                name="relationship-description"
                value={relationshipData.description}
                onChange={(e) =>
                  setRelationshipData({ ...relationshipData, description: e.target.value })
                }
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Создать
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowRelationshipForm(false);
                  setRelationshipData({
                    hero_id_1: '',
                    hero_id_2: '',
                    relationship_type: 'ally',
                    description: ''
                  });
                }}
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminPage;

