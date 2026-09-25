const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

function generateCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

app.post('/api/links', async (req, res) => {
    try {
        const { url, title } = req.body;
        if (!url || !url.startsWith('http')) return res.status(400).json({ error: 'Invalid URL' });

        const { error } = await supabase.from('links').insert({
            id: Date.now().toString(),
            code: generateCode(),
            url,
            title: title || 'Untitled'
        });

        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/links/bulk', async (req, res) => {
    try {
        const { links } = req.body;
        if (!Array.isArray(links)) return res.status(400).json({ error: 'Invalid links' });

        const toInsert = links
            .filter(l => l.url && l.url.startsWith('http'))
            .map((l, i) => ({
                id: Date.now().toString() + i,
                code: generateCode(),
                url: l.url,
                title: l.title || 'Untitled'
            }));

        const { error } = await supabase.from('links').insert(toInsert);
        if (error) throw error;

        res.json({ count: toInsert.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/links', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ links: data || [] });
    } catch (err) {
        console.error(err);
        res.json({ links: [] });
    }
});

app.delete('/api/links/:id', async (req, res) => {
    try {
        const { error } = await supabase.from('links').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;
        if (code.includes('.') || code === 'api') return res.sendFile(path.join(__dirname, 'index.html'));

        const { data, error } = await supabase.from('links').select('url').eq('code', code).single();
        if (error || !data) return res.sendFile(path.join(__dirname, 'index.html'));

        res.redirect(301, data.url);
    } catch (err) {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

module.exports = app;
