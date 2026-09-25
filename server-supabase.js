// Alternative server.js using Supabase (PostgreSQL)
// This version works better for Vercel/Railway deployment
// Sign up free at https://supabase.com

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY environment variables');
    console.error('Get these from https://supabase.com');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Initialize database table
async function initDb() {
    try {
        // Create table if it doesn't exist
        const { error } = await supabase.rpc('exec', {
            sql: `
                CREATE TABLE IF NOT EXISTS links (
                    id TEXT PRIMARY KEY,
                    code TEXT UNIQUE NOT NULL,
                    url TEXT NOT NULL,
                    title TEXT,
                    clicks INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE INDEX IF NOT EXISTS idx_code ON links(code);
            `
        }).catch(() => {
            // If rpc doesn't work, table already exists
            return { error: null };
        });
        
        console.log('Database initialized');
    } catch (err) {
        console.log('Using existing database');
    }
}

initDb();

// Generate short code (6 characters)
function generateCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Create single link
app.post('/api/links', async (req, res) => {
    const { url, title } = req.body;

    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    const id = crypto.randomUUID?.() || Date.now().toString();
    const code = generateCode();

    try {
        const { data, error } = await supabase
            .from('links')
            .insert({
                id,
                code,
                url,
                title: title || 'Untitled'
            })
            .select();

        if (error) throw error;

        res.json({
            id,
            code,
            shortUrl: `${process.env.DOMAIN || 'http://localhost:3000'}/${code}`,
            url,
            title
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create link: ' + err.message });
    }
});

// Bulk import links
app.post('/api/links/bulk', async (req, res) => {
    const { links } = req.body;

    if (!Array.isArray(links) || links.length === 0) {
        return res.status(400).json({ error: 'Invalid links array' });
    }

    try {
        const linksToInsert = links
            .filter(link => link.url && link.url.startsWith('http'))
            .map(link => ({
                id: crypto.randomUUID?.() || Date.now().toString(),
                code: generateCode(),
                url: link.url,
                title: link.title || 'Untitled'
            }));

        const { error } = await supabase
            .from('links')
            .insert(linksToInsert);

        if (error) throw error;

        res.json({ count: linksToInsert.length });
    } catch (err) {
        res.status(500).json({ error: 'Failed to import links: ' + err.message });
    }
});

// Get all links
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

// Delete link
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

// Get link and redirect
app.get('/api/redirect/:code', async (req, res) => {
    const { code } = req.params;

    try {
        // Update clicks
        await supabase
            .from('links')
            .update({ clicks: supabase.rpc('increment', { amount: 1, row_id: code }) })
            .eq('code', code);

        // Get URL
        const { data, error } = await supabase
            .from('links')
            .select('url')
            .eq('code', code)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'Link not found' });
        }

        res.redirect(301, data.url);
    } catch (err) {
        res.status(404).json({ error: 'Link not found' });
    }
});

// Redirect handler (root)
app.get('/:code', async (req, res) => {
    const { code } = req.params;

    // Skip if it's a file
    if (code.includes('.') || code === 'api') {
        return res.status(404).json({ error: 'Not found' });
    }

    try {
        // Get and redirect
        const { data, error } = await supabase
            .from('links')
            .select('url, id')
            .eq('code', code)
            .single();

        if (error || !data) {
            return res.sendFile(path.join(__dirname, 'index.html'));
        }

        // Update clicks in background
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

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`ShortLink server running on port ${PORT}`);
    console.log(`Using Supabase: ${supabaseUrl}`);
    console.log(`Update index.html API_URL to: ${process.env.DOMAIN || 'http://localhost:3000'}`);
});
