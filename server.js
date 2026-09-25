const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

let supabase = null;

try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
        supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    }
} catch (e) {
    console.log('Supabase error:', e.message);
}

function generateCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * 62)];
    return code;
}

app.post('/api/links', async (req, res) => {
    if (!supabase) return res.status(500).json({ error: 'DB not ready' });
    
    const { url, title } = req.body || {};
    if (!url) return res.status(400).json({ error: 'No URL' });

    try {
        const { error } = await supabase.from('links').insert({
            id: Date.now().toString(),
            code: generateCode(),
            url,
            title: title || 'Link'
        });
        if (error) return res.status(400).json({ error: error.message });
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/links/bulk', async (req, res) => {
    if (!supabase) return res.status(500).json({ error: 'DB not ready' });
    
    const { links } = req.body || {};
    if (!Array.isArray(links)) return res.status(400).json({ error: 'Invalid' });

    try {
        const rows = links.filter(l => l.url).map((l, i) => ({
            id: Date.now() + i,
            code: generateCode(),
            url: l.url,
            title: l.title || 'Link'
        }));

        const { error } = await supabase.from('links').insert(rows);
        if (error) return res.status(400).json({ error: error.message });
        res.json({ count: rows.length });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/links', async (req, res) => {
    if (!supabase) return res.json({ links: [] });
    
    try {
        const { data } = await supabase.from('links').select('*');
        res.json({ links: data || [] });
    } catch (e) {
        res.json({ links: [] });
    }
});

app.delete('/api/links/:id', async (req, res) => {
    if (!supabase) return res.status(500).json({ error: 'DB not ready' });
    
    try {
        await supabase.from('links').delete().eq('id', req.params.id);
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/:code', async (req, res) => {
    try {
        if (req.params.code.includes('.')) return res.sendFile(path.join(__dirname, 'index.html'));
        if (!supabase) return res.sendFile(path.join(__dirname, 'index.html'));

        const { data } = await supabase.from('links').select('url').eq('code', req.params.code).single();
        if (!data) return res.sendFile(path.join(__dirname, 'index.html'));
        
        res.redirect(301, data.url);
    } catch (e) {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

module.exports = app;
