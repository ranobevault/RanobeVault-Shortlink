const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY exists:', !!process.env.SUPABASE_KEY);

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_KEY || 'placeholder'
);

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
        const { data, error } = await supabase
            .from('links')
            .insert({ id, code, url, title: title || 'Link' })
            .select();

        console.log('Supabase response:', { data, error });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({ error: error.message });
        }

        res.json({ success: true, code, id });
    } catch (err) {
        console.error('Catch error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/links/bulk', async (req, res) => {
    const { links } = req.body;
    console.log('Bulk import:', links?.length || 0, 'links');

    if (!Array.isArray(links) || links.length === 0) {
        return res.status(400).json({ error: 'No links' });
    }

    const toInsert = links.map((l, i) => ({
        id: (Date.now() + i).toString(),
        code: generateCode(),
        url: l.url,
        title: l.title || 'Link'
    }));

    try {
        const { data, error } = await supabase
            .from('links')
            .insert(toInsert)
            .select();

        console.log('Bulk response:', { data, error });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({ error: error.message });
        }

        res.json({ count: toInsert.length });
    } catch (err) {
        console.error('Catch error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/links', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .order('created_at', { ascending: false });

        console.log('Load links:', { count: data?.length, error });

        res.json({ links: data || [] });
    } catch (err) {
        console.error('Error:', err);
        res.json({ links: [] });
    }
});

app.delete('/api/links/:id', async (req, res) => {
    const { error } = await supabase.from('links').delete().eq('id', req.params.id);
    res.json({ success: !error });
});

app.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;
        if (code.includes('.') || code === 'api') return res.sendFile(path.join(__dirname, 'index.html'));

        const { data } = await supabase.from('links').select('url').eq('code', code).single();
        if (!data) return res.sendFile(path.join(__dirname, 'index.html'));

        res.redirect(301, data.url);
    } catch (err) {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

module.exports = app;
