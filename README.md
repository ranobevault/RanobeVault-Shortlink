# ShortLink Manager - Ready to Deploy

## Files to Upload to GitHub

Download these 5 files and upload to your GitHub repository:

1. ✅ **index.html** - Dashboard
2. ✅ **server.js** - Backend (ALREADY RENAMED - use this, NOT server-supabase.js)
3. ✅ **package.json** - Dependencies
4. ✅ **vercel.json** - Vercel config
5. ✅ **.gitignore** - Ignore node_modules

That's all you need!

---

## Before Uploading to GitHub

Edit **index.html**:

Find this line (around line 350):
```javascript
const API_URL = 'https://your-api.com';
```

Change to (use your own name):
```javascript
const API_URL = 'https://shortlink-justin.vercel.app';
```

Save the file.

---

## Then Upload to GitHub

1. Create new repo at https://github.com/new
2. Name: **shortlink-manager**
3. Run these commands in your folder:

```bash
git init
git add .
git commit -m "Initial commit: shortlink service"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shortlink-manager.git
git push -u origin main
```

Replace YOUR_USERNAME with your GitHub username.

---

## Then Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Add Environment Variables:
   - **SUPABASE_URL** = (from Supabase)
   - **SUPABASE_KEY** = (from Supabase)
   - **DOMAIN** = https://shortlink-justin.vercel.app (same as in index.html)
5. Deploy!

Done! 🎉
