require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const heroesRoutes = require('./routes/heroes');
const { authenticateToken, requireAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4002;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'heroes_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'dev',
});

// Initialize database
pool.query(`
  CREATE TABLE IF NOT EXISTS heroes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    bio_text TEXT,
    bio_image_url VARCHAR(500),
    attribute VARCHAR(10) CHECK (attribute IN ('STR', 'AGI', 'INT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error('Database initialization error:', err));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));

// Routes
app.use('/api/heroes', heroesRoutes(pool, { authenticateToken, requireAdmin }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'heroes-service' });
});

app.listen(PORT, () => {
  console.log(`Heroes Service running on port ${PORT}`);
});

module.exports = app;

