const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

function generateCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

app.post('/api/links', async (req, res) => {
    const { url, title } = req.body;

    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    const id = Date.now().toString();
    const code = generateCode();

    try {
        const { data, error } = await supabase
            .from('links')
            .insert({ id, code, url, title: title || 'Untitled' })
            .select();

        if (error) throw error;

        res.json({
            id,
            code,
            shortUrl: `${process.env.DOMAIN}/${code}`,
            url,
            title
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create link: ' + err.message });
    }
});

app.post('/api/links/bulk', async (req, res) => {
    const { links } = req.body;

    if (!Array.isArray(links) || links.length === 0) {
        return res.status(400).json({ error: 'Invalid links array' });
    }

    try {
        const linksToInsert = links
            .filter(link => link.url && link.url.startsWith('http'))
            .map(link => ({
                id: Date.now().toString() + Math.random(),
                code: generateCode(),
                url: link.url,
                title: link.title || 'Untitled'
            }));

        const { error } = await supabase.from('links').insert(linksToInsert);
        if (error) throw error;

        res.json({ count: linksToInsert.length });
    } catch (err) {
        res.status(500).json({ error: 'Failed to import links: ' + err.message });
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
        res.status(500).json({ error: 'Failed to fetch links: ' + err.message });
    }
});

app.delete('/api/links/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete link: ' + err.message });
    }
});

app.get('/:code', async (req, res) => {
    const { code } = req.params;

    if (code.includes('.') || code === 'api') {
        return res.sendFile(path.join(__dirname, 'index.html'));
    }

    try {
        const { data, error } = await supabase
            .from('links')
            .select('url, id')
            .eq('code', code)
            .single();

        if (error || !data) {
            return res.sendFile(path.join(__dirname, 'index.html'));
        }

        supabase
            .from('links')
            .update({ clicks: supabase.rpc('increment', { amount: 1 }) })
            .eq('id', data.id)
            .then();

        res.redirect(301, data.url);
    } catch (err) {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`ShortLink server running on port ${PORT}`);
});

module.exports = app;
