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

describe('Heroes Service', () => {
  let pool;

  beforeEach(() => {
    pool = new Pool();
    jest.clearAllMocks();
  });

  describe('GET /api/heroes', () => {
    it('should return list of heroes', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: 'Invoker',
            title: 'Arcane Genius',
            attribute: 'INT',
            bio_text: 'Test bio',
            bio_image_url: '/images/invoker.jpg',
            created_at: new Date()
          }
        ]
      });

      const response = await request(app).get('/api/heroes');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('name');
    });
  });

  describe('GET /api/heroes/:id', () => {
    it('should return hero by id', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          name: 'Invoker',
          title: 'Arcane Genius',
          attribute: 'INT',
          bio_text: 'Test bio',
          bio_image_url: '/images/invoker.jpg',
          created_at: new Date()
        }]
      });

      const response = await request(app).get('/api/heroes/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Invoker');
    });

    it('should return 404 if hero not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app).get('/api/heroes/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/heroes', () => {
    it('should create hero with admin token', async () => {
      const token = jwt.sign(
        { id: 1, role: 'admin' },
        process.env.JWT_SECRET || 'secret'
      );

      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          name: 'New Hero',
          title: 'Test Title',
          attribute: 'STR',
          bio_text: 'Test bio',
          bio_image_url: null,
          created_at: new Date()
        }]
      });

      const response = await request(app)
        .post('/api/heroes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'New Hero',
          title: 'Test Title',
          attribute: 'STR',
          bio_text: 'Test bio'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });
});

