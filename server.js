const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '.')));

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_KEY || ''
);

function generateCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * 62)];
    return code;
}

app.post('/api/links', async (req, res) => {
    try {
        const body = req.body || {};
        const url = body.url || '';
        const title = body.title || 'Link';

        if (!url || !url.includes('http')) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        const result = await supabase.from('links').insert({
            id: Date.now().toString(),
            code: generateCode(),
            url: url,
            title: title
        }).select();

        res.json({ success: true, data: result.data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

app.post('/api/links/bulk', async (req, res) => {
    try {
        const body = req.body || {};
        const links = body.links || [];

        if (!Array.isArray(links) || links.length === 0) {
            return res.status(400).json({ error: 'No links provided' });
        }

        const toInsert = [];
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            if (link && link.url && link.url.includes('http')) {
                toInsert.push({
                    id: (Date.now() + i).toString(),
                    code: generateCode(),
                    url: link.url,
                    title: link.title || 'Link'
                });
            }
        }

        if (toInsert.length === 0) {
            return res.status(400).json({ error: 'No valid URLs' });
        }

        const result = await supabase.from('links').insert(toInsert).select();
        res.json({ count: toInsert.length, data: result.data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

app.get('/api/links', async (req, res) => {
    try {
        const result = await supabase.from('links').select('*').order('created_at', { ascending: false });
        res.json({ links: result.data || [] });
    } catch (err) {
        res.json({ links: [] });
    }
});

app.delete('/api/links/:id', async (req, res) => {
    try {
        await supabase.from('links').delete().eq('id', req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;
        if (code.includes('.') || code === 'api' || code.length < 3) {
            return res.sendFile(path.join(__dirname, 'index.html'));
        }

        const result = await supabase.from('links').select('url').eq('code', code).single();
        
        if (!result.data) {
            return res.sendFile(path.join(__dirname, 'index.html'));
        }

        res.redirect(301, result.data.url);
    } catch (err) {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
