require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const loreRoutes = require('./routes/lore');
const { authenticateToken, requireAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4003;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'lore_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'dev',
});

// Initialize database
pool.query(`
  CREATE TABLE IF NOT EXISTS relationships (
    id SERIAL PRIMARY KEY,
    hero_id_1 INTEGER NOT NULL,
    hero_id_2 INTEGER NOT NULL,
    relationship_type VARCHAR(50) CHECK (relationship_type IN ('ally', 'enemy', 'related')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hero_id_1, hero_id_2)
  )
`).catch(err => console.error('Database initialization error:', err));

pool.query(`
  CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    hero_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, hero_id)
  )
`).catch(err => console.error('Database initialization error:', err));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/lore', loreRoutes(pool, { authenticateToken, requireAdmin }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'lore-service' });
});

app.listen(PORT, () => {
  console.log(`Lore Service running on port ${PORT}`);
});

module.exports = app;

