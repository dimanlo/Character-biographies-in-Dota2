const express = require('express');

const router = express.Router();

module.exports = (pool, { authenticateToken, requireAdmin }) => {
  // Get all heroes
  router.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 20, attribute } = req.query;
      const offset = (page - 1) * limit;

      let query = 'SELECT * FROM heroes';
      const params = [];
      
      if (attribute) {
        query += ' WHERE attribute = $1';
        params.push(attribute);
        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), offset);
      } else {
        query += ` ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
        params.push(parseInt(limit), offset);
      }

      const result = await pool.query(query, params);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.json(result.rows);
    } catch (error) {
      console.error('Get heroes error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get hero by ID
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM heroes WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Hero not found' });
      }

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Get hero error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create hero (Admin only)
  router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { name, title, bio_text, bio_image_url, attribute } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const result = await pool.query(
        `INSERT INTO heroes (name, title, bio_text, bio_image_url, attribute)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, title || null, bio_text || null, bio_image_url || null, attribute || null]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Create hero error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update hero (Admin only)
  router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, title, bio_text, bio_image_url, attribute } = req.body;

      const result = await pool.query(
        `UPDATE heroes 
         SET name = COALESCE($1, name),
             title = COALESCE($2, title),
             bio_text = COALESCE($3, bio_text),
             bio_image_url = COALESCE($4, bio_image_url),
             attribute = COALESCE($5, attribute)
         WHERE id = $6
         RETURNING *`,
        [name, title, bio_text, bio_image_url, attribute, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Hero not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Update hero error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete hero (Admin only)
  router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM heroes WHERE id = $1 RETURNING id', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Hero not found' });
      }

      res.json({ message: 'Hero deleted successfully' });
    } catch (error) {
      console.error('Delete hero error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};

