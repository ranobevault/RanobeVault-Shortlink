═══════════════════════════════════════════════════════════════════════════════
              DEPLOY SHORTLINK LIVE IN 15 MINUTES - KOFI READY
═══════════════════════════════════════════════════════════════════════════════

NO LOCAL TESTING. STRAIGHT TO ONLINE.

Your links will be live and accessible to Ko-fi members 24/7.

═══════════════════════════════════════════════════════════════════════════════
STEP 1: CREATE SUPABASE ACCOUNT (Database) - 3 MINUTES
═══════════════════════════════════════════════════════════════════════════════

Go to: https://supabase.com

Click: "Start your project"

Sign up:
  Option A: Click "Continue with GitHub" (easiest)
    → Authorize Supabase → Done
  
  Option B: Use email
    → Enter email → Verify → Create password

After signup, click: "New project"

Fill in:
  Project name: "shortlink"
  Database password: "SomethingSecure123!" (remember this!)
  Region: Singapore or Japan (closest to you)

Click: "Create new project"

Wait 2-3 minutes (it's creating your database)


✅ STEP 2: GET YOUR API KEYS - 1 MINUTE
═══════════════════════════════════════════════════════════════════════════════

When project loads:

Left sidebar → "Settings" → "API"

You see two things:

COPY THESE TWO VALUES - SAVE THEM SOMEWHERE SAFE:

Value 1: Project URL
  Example: https://xyzabc.supabase.co
  → Save as: SUPABASE_URL

Value 2: anon public key
  Example: eyJhbGc....(very long text)
  → Save as: SUPABASE_KEY

⚠️ DON'T SHARE THESE WITH ANYONE


✅ STEP 3: CREATE DATABASE TABLE - 1 MINUTE
═══════════════════════════════════════════════════════════════════════════════

Left sidebar → "SQL Editor"

Click: "New query"

Copy and paste this:

────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    title TEXT DEFAULT 'Untitled',
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_code ON links(code);
────────────────────────────────────────────────────────────────

Click: "Run" (blue button)

You see: "Success. No rows returned."

Perfect! Database is ready. ✅


═══════════════════════════════════════════════════════════════════════════════
STEP 4: PREPARE YOUR CODE - 2 MINUTES
═══════════════════════════════════════════════════════════════════════════════

You have these files:
  • index.html
  • server-supabase.js
  • package.json
  • Other files

Rename: server-supabase.js → server.js
(Delete the old server.js if you have it)

Open: index.html in notepad

Find this line (around line 350):
  const API_URL = 'https://your-api.com';

Change to:
  const API_URL = 'https://shortlink-justin.vercel.app';

(Use any name you want instead of "justin", e.g., "shortlink-anime", "link-vault")

Save and close


═══════════════════════════════════════════════════════════════════════════════
STEP 5: CREATE GITHUB ACCOUNT - 2 MINUTES
═══════════════════════════════════════════════════════════════════════════════

Go to: https://github.com

Click: "Sign up"

Email: your email
Password: strong password
Username: anything (e.g., your name)

Verify your email

Login to GitHub


═══════════════════════════════════════════════════════════════════════════════
STEP 6: UPLOAD YOUR CODE TO GITHUB - 3 MINUTES
═══════════════════════════════════════════════════════════════════════════════

In GitHub:

Go to: https://github.com/new

Repository name: shortlink-manager

Leave everything else as default

Click: "Create repository"

You see green box with commands. Copy all of them.

Open Command Prompt/PowerShell:

Windows:
  → Go to your shortlink-manager folder
  → Hold Shift + Right-click → "Open PowerShell here"

Mac:
  → Right-click folder → Services → New Terminal at Folder

Paste and run these commands:

  git init
  git add .
  git commit -m "Initial commit: shortlink service"
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/shortlink-manager.git
  git push -u origin main

Replace YOUR_USERNAME with your actual GitHub username

If it asks for password:
  → Go to GitHub Settings → Developer settings → Personal access tokens
  → Create new token (check "repo" box)
  → Use that token as password

Wait for upload to finish.

Refresh GitHub page - you see all your files uploaded! ✅


═══════════════════════════════════════════════════════════════════════════════
STEP 7: CREATE VERCEL ACCOUNT AND DEPLOY - 3 MINUTES
═══════════════════════════════════════════════════════════════════════════════

Go to: https://vercel.com

Click: "Sign up"

Click: "Continue with GitHub" (easiest)

Login with your GitHub account

Authorize Vercel

On your Vercel dashboard:

Click: "Add New" → "Project"

Click: "Import Git Repository"

Find "shortlink-manager" and click it

Click: "Import"

Vercel builds (wait 2-3 minutes for "Ready" status)


═══════════════════════════════════════════════════════════════════════════════
STEP 8: ADD ENVIRONMENT VARIABLES (IMPORTANT!) - 2 MINUTES
═══════════════════════════════════════════════════════════════════════════════

When deployment finishes, you see your project.

Click: "Settings" tab

Click: "Environment Variables" (left sidebar)

ADD 3 VARIABLES:

Variable 1:
  Name: SUPABASE_URL
  Value: (paste from STEP 2)
  Click "Add"

Variable 2:
  Name: SUPABASE_KEY
  Value: (paste from STEP 2)
  Click "Add"

Variable 3:
  Name: DOMAIN
  Value: https://shortlink-justin.vercel.app
  (Use YOUR name, same as STEP 4)
  Click "Add"

After adding all 3:

Click: "Deployments" tab

Click three dots (...) on latest deployment → "Redeploy"

Wait 1-2 minutes for "Ready" status

✅ YOUR APP IS LIVE!


═══════════════════════════════════════════════════════════════════════════════
STEP 9: TEST IT WORKS - 1 MINUTE
═══════════════════════════════════════════════════════════════════════════════

Open browser:

https://shortlink-justin.vercel.app

(Use your actual username/name)

You should see:
  • Purple dashboard
  • "ShortLink Manager" heading
  • Forms and buttons

Click "Create Link" and try:
  Title: Test
  URL: https://google.com
  
Click "Create Short Link"

You should see a green message! ✅


═══════════════════════════════════════════════════════════════════════════════
STEP 10: BULK IMPORT YOUR 15 CHAPTER LINKS - 2 MINUTES
═══════════════════════════════════════════════════════════════════════════════

On your dashboard: https://shortlink-justin.vercel.app

Scroll to: "Bulk Import" section

Click the text area

Paste ALL of this (your 15 chapter links):

────────────────────────────────────────────────────────────────
https://ranobevault.github.io/novels/chapter.html?h=YLdVeE4a6 - Prologue
https://ranobevault.github.io/novels/chapter.html?h=K8XsPQdR6 - Ch 1
https://ranobevault.github.io/novels/chapter.html?h=I2DoLm1sj&unlock=uk_G2WcdPawh7 - Ch 2
https://ranobevault.github.io/novels/chapter.html?h=sMvZmYhE7 - Ch 3
https://ranobevault.github.io/novels/chapter.html?h=u8SRb4eOV - Ch 4
https://ranobevault.github.io/novels/chapter.html?h=LnVu09qm3&unlock=uk_qgmMqpgR4u - Ch 5
https://ranobevault.github.io/novels/chapter.html?h=4yOZ717Wa - Ch 6
https://ranobevault.github.io/novels/chapter.html?h=JVIUSyE89 - Ch 7
https://ranobevault.github.io/novels/chapter.html?h=sXye6exNL&unlock=uk_2f2NkLHHFR - Ch 8
https://ranobevault.github.io/novels/chapter.html?h=HFQ8W1IgG - Ch 9
https://ranobevault.github.io/novels/chapter.html?h=xxTPnZhbF - Ch 10
https://ranobevault.github.io/novels/chapter.html?h=41tZn0Hj4&unlock=uk_6Qd9pBHVNE - Ch 11
https://ranobevault.github.io/novels/chapter.html?h=NDw9adkom - Ch 12
https://ranobevault.github.io/novels/chapter.html?h=PZGj0Cx7d - Ch 13
https://ranobevault.github.io/novels/chapter.html?h=Jd5IgBULI&unlock=uk_xp8z9tEDEV - Ch 14
https://ranobevault.github.io/novels/chapter.html?h=krZm9rJk4 - Ch 15
────────────────────────────────────────────────────────────────

Click: "Import Bulk URLs"

Wait 2 seconds

You see: "✓ Successfully imported 15 links"

Perfect! ✅


═══════════════════════════════════════════════════════════════════════════════
STEP 11: COPY LINKS TO KO-FI - 2 MINUTES
═══════════════════════════════════════════════════════════════════════════════

On your dashboard, scroll down to "Your Links"

You see all 15 with short codes like:
  
  shortlink-justin.vercel.app/aBc123 → Prologue
  shortlink-justin.vercel.app/XyZ789 → Ch 1
  shortlink-justin.vercel.app/DeF456 → Ch 2
  etc.

For each link:
  1. Click "Copy" button
  2. Go to Ko-fi
  3. Paste it

OR copy all at once and format like this:

Open Ko-fi: https://ko-fi.com/yourname

Click: Edit → Manage Content (or similar)

Paste your chapter section:

────────────────────────────────────────────────────────────────
📖 Chapter List

Prologue: shortlink-justin.vercel.app/aBc123
Ch 1: shortlink-justin.vercel.app/XyZ789
Ch 2: shortlink-justin.vercel.app/DeF456
Ch 3: shortlink-justin.vercel.app/GhI789
Ch 4: shortlink-justin.vercel.app/JkL012
Ch 5: shortlink-justin.vercel.app/MnO345
Ch 6: shortlink-justin.vercel.app/PqR678
Ch 7: shortlink-justin.vercel.app/StuV901
Ch 8: shortlink-justin.vercel.app/WxY234
Ch 9: shortlink-justin.vercel.app/ZaB567
Ch 10: shortlink-justin.vercel.app/CdE890
Ch 11: shortlink-justin.vercel.app/FgH123
Ch 12: shortlink-justin.vercel.app/IjK456
Ch 13: shortlink-justin.vercel.app/LmN789
Ch 14: shortlink-justin.vercel.app/OpQ012
Ch 15: shortlink-justin.vercel.app/RsT345
────────────────────────────────────────────────────────────────

Click: Save

✅ DONE! Your Ko-fi is updated!


═══════════════════════════════════════════════════════════════════════════════
✅ YOU'RE FINISHED! LIVE FOR YOUR KOFI MEMBERS!
═══════════════════════════════════════════════════════════════════════════════

Your shortlink service:
  ✅ Lives at: https://shortlink-justin.vercel.app (24/7 online)
  ✅ All 15 chapters linked
  ✅ Ko-fi members can click and read
  ✅ Click tracking to see which chapters are popular
  ✅ Works forever without your laptop on

That's it! 🎉


═══════════════════════════════════════════════════════════════════════════════
WHAT NOW?
═══════════════════════════════════════════════════════════════════════════════

Laptop can be OFF - links work 24/7! ✅

You can close everything and your Ko-fi links work forever.

If you add new chapters later:
  1. Go to: https://shortlink-justin.vercel.app
  2. Click "Create Link"
  3. Paste URL, add title
  4. Click "Create Short Link"
  5. Copy to Ko-fi

Takes 30 seconds!

═══════════════════════════════════════════════════════════════════════════════
