const request = require('supertest');
const { Pool } = require('pg');
const app = require('../index');
const jwt = require('jsonwebtoken');

// Mock database
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

describe('Lore Service', () => {
  let pool;

  beforeEach(() => {
    pool = new Pool();
    jest.clearAllMocks();
  });

  describe('GET /api/lore/hero/:heroId/relationships', () => {
    it('should return relationships for a hero', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            hero_id_1: 1,
            hero_id_2: 2,
            relationship_type: 'ally',
            description: 'Test relationship',
            created_at: new Date()
          }
        ]
      });

      const response = await request(app).get('/api/lore/hero/1/relationships');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('relationship_type');
    });
  });

  describe('POST /api/lore/favorites', () => {
    it('should add hero to favorites with valid token', async () => {
      const token = jwt.sign(
        { id: 1, role: 'user' },
        process.env.JWT_SECRET || 'secret'
      );

      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          user_id: 1,
          hero_id: 1,
          created_at: new Date()
        }]
      });

      const response = await request(app)
        .post('/api/lore/favorites')
        .set('Authorization', `Bearer ${token}`)
        .send({ hero_id: 1 });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });
});

