// server/index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// pool.connect()
//   .then(() => console.log('Connected to Neon DB!'))
//   .catch(err => console.error('Connection failed:', err));


app.get('/api/comments', async (req, res) => {
  const { slug } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM comments WHERE article_slug = $1 ORDER BY timestamp DESC',
      [slug]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching comments');
  }
});

app.post('/api/comments', async (req, res) => {
  const { author, text, parent_id, article_slug } = req.body;

  console.log('Incoming POST:', req.body);

  if (!author || !text || !article_slug) {
    console.warn('Missing fields:', { author, text, article_slug });
    return res.status(400).send('Missing required fields');
  }

  try {
    const result = await pool.query(
      'INSERT INTO comments (author, text, parent_id, article_slug) VALUES ($1, $2, $3, $4) RETURNING *',
      [author, text, parent_id || null, article_slug]
    );
    console.log('Saved comment:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('DB Error:', err.message, err.stack);
    res.status(500).send('Error saving comment');
  }
});

app.post('/api/comments/:id/unlike', async (req, res) => {
  const commentId = req.params.id;
  try {
    await pool.query('UPDATE comments SET likes = GREATEST(likes - 1, 0) WHERE id = $1', [commentId]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Unlike error:', err);
    res.status(500).send('Error unliking comment');
  }
});


app.delete('/api/comments/:id', async (req, res) => {
  const { id } = req.params;
  const adminSecret = req.headers['x-admin-secret'];

  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).send('Unauthorized');
  }

  try {
    await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    res.status(204).send(); // success, no content
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).send('Error deleting comment');
  }
});

app.post('/api/comments/:id/like', async (req, res) => {
  const commentId = req.params.id;
  try {
    await pool.query('UPDATE comments SET likes = likes + 1 WHERE id = $1', [commentId]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).send('Error liking comment');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});