const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Neon connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

console.log('Connected to Neon');

function generateCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * 62)];
    return code;
}

app.post('/api/links', async (req, res) => {
    const { url, title } = req.body;
    console.log('Creating link:', { url, title });

    if (!url) {
        console.log('No URL provided');
        return res.status(400).json({ error: 'No URL' });
    }

    const id = Date.now().toString();
    const code = generateCode();

    try {
        const result = await pool.query(
            'INSERT INTO links (id, code, url, title, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [id, code, url, title || 'Link']
        );

        console.log('Link created:', result.rows[0]);
        res.json({ success: true, code, id });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/links/bulk', async (req, res) => {
    const { links } = req.body;
    console.log('Bulk import:', links?.length || 0, 'links');

    if (!Array.isArray(links) || links.length === 0) {
        return res.status(400).json({ error: 'No links' });
    }

    try {
        const values = links.map((l, i) => [
            (Date.now() + i).toString(),
            generateCode(),
            l.url,
            l.title || 'Link'
        ]);

        const placeholders = values.map((_, i) => 
            `($${i*4+1}, $${i*4+2}, $${i*4+3}, $${i*4+4})`
        ).join(',');

        const flatValues = values.flat();

        await pool.query(
            `INSERT INTO links (id, code, url, title, created_at) 
             VALUES ${placeholders}`,
            flatValues
        );

        res.json({ count: links.length });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/links', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM links ORDER BY created_at DESC'
        );

        console.log('Load links:', { count: result.rows.length });
        res.json({ links: result.rows });
    } catch (err) {
        console.error('Error:', err);
        res.json({ links: [] });
    }
});

app.delete('/api/links/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM links WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error:', err);
        res.json({ success: false });
    }
});

app.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;
        if (code.includes('.') || code === 'api') {
            return res.sendFile(path.join(__dirname, 'index.html'));
        }

        const result = await pool.query(
            'SELECT url FROM links WHERE code = $1 LIMIT 1',
            [code]
        );

        if (!result.rows[0]) {
            return res.sendFile(path.join(__dirname, 'index.html'));
        }

        // Increment clicks
        await pool.query(
            'UPDATE links SET clicks = clicks + 1 WHERE code = $1',
            [code]
        );

        res.redirect(301, result.rows[0].url);
    } catch (err) {
        console.sendFile(path.join(__dirname, 'index.html'));
    }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

module.exports = app;
