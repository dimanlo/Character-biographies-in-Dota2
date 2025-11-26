const express = require('express');

const router = express.Router();

module.exports = (pool, { authenticateToken, requireAdmin }) => {
  // Get relationships for a hero
  router.get('/hero/:heroId/relationships', async (req, res) => {
    try {
      const { heroId } = req.params;
      const result = await pool.query(
        `SELECT * FROM relationships 
         WHERE hero_id_1 = $1 OR hero_id_2 = $1
         ORDER BY created_at DESC`,
        [heroId]
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Get relationships error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create relationship (Admin only)
  router.post('/relationships', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { hero_id_1, hero_id_2, relationship_type, description } = req.body;

      if (!hero_id_1 || !hero_id_2 || !relationship_type) {
        return res.status(400).json({ 
          error: 'hero_id_1, hero_id_2, and relationship_type are required' 
        });
      }

      if (!['ally', 'enemy', 'related'].includes(relationship_type)) {
        return res.status(400).json({ 
          error: 'relationship_type must be one of: ally, enemy, related' 
        });
      }

      const result = await pool.query(
        `INSERT INTO relationships (hero_id_1, hero_id_2, relationship_type, description)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [hero_id_1, hero_id_2, relationship_type, description || null]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ error: 'Relationship already exists' });
      }
      console.error('Create relationship error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Add hero to favorites
  router.post('/favorites', authenticateToken, async (req, res) => {
    try {
      const { hero_id } = req.body;
      const user_id = req.user.id;

      if (!hero_id) {
        return res.status(400).json({ error: 'hero_id is required' });
      }

      const result = await pool.query(
        `INSERT INTO favorites (user_id, hero_id)
         VALUES ($1, $2)
         RETURNING *`,
        [user_id, hero_id]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ error: 'Hero already in favorites' });
      }
      console.error('Add favorite error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get user favorites
  router.get('/favorites', authenticateToken, async (req, res) => {
    try {
      const user_id = req.user.id;
      const result = await pool.query(
        `SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC`,
        [user_id]
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Get favorites error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Remove from favorites
  router.delete('/favorites/:heroId', authenticateToken, async (req, res) => {
    try {
      const { heroId } = req.params;
      const user_id = req.user.id;

      const result = await pool.query(
        `DELETE FROM favorites WHERE user_id = $1 AND hero_id = $2 RETURNING id`,
        [user_id, heroId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Favorite not found' });
      }

      res.json({ message: 'Favorite removed successfully' });
    } catch (error) {
      console.error('Remove favorite error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};

