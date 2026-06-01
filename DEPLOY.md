# Aevum Deployment Guide

## Overview

Aevum is a full-stack application. The backend (Node.js + Hono) serves **both** the API and the static frontend files. You only need to deploy **one server**.

```
Your Domain (e.g., aevum.onrender.com)
    ├── /api/trpc/*     ← tRPC API endpoints
    ├── /api/oauth/*    ← OAuth authentication
    ├── /sw.js          ← Service worker
    ├── /*              ← Static frontend (SPA)
```

## Architecture Options

### Option A: Unified (Recommended — Easiest)
Backend serves API + static frontend. One deployment, one URL.

### Option B: Split (Advanced)
Frontend on a CDN (Vercel/Netlify/Cloudflare) + Backend on Render.
Set `VITE_API_URL=https://your-backend.com/api/trpc` in the frontend build.

---

## Method 1: Render.com (Recommended — Free Tier)

### Step 1: Push Code to GitHub

You need your project on GitHub first. From your local machine:

```bash
# If you downloaded the project folder:
cd aevum-project-folder
git init
git add .
git commit -m "Initial Aevum deployment"

# Create a new repo on GitHub (don't initialize with README)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/aevum.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com) and sign up (free)
2. Click "New +" → "Blueprint" 
3. Connect your GitHub account and select the `aevum` repo
4. Render will read the `render.yaml` file and auto-configure

### Step 3: Set Environment Variables

In the Render dashboard, go to your service → "Environment" tab.

Add these variables from your `.env` file:

| Variable | What It Is | Where to Find |
|----------|-----------|---------------|
| `DATABASE_URL` | Your TiDB/MySQL connection string | `.env` file or TiDB Cloud console |
| `OPENAI_API_KEY` | Your OpenAI API key | `.env` file or [platform.openai.com](https://platform.openai.com) |
| `APP_SECRET` | App secret for JWT signing | `.env` file |
| `APP_ID` | Your Kimi app ID | `.env` file |
| `VITE_APP_ID` | Same as APP_ID | `.env` file |
| `VITE_KIMI_AUTH_URL` | Kimi auth URL | `.env` file |
| `KIMI_AUTH_URL` | Same as above | `.env` file |
| `KIMI_OPEN_URL` | Kimi open platform URL | `.env` file |
| `OWNER_UNION_ID` | Your Kimi union ID | `.env` file |

### Step 4: Deploy

Render auto-deploys on every git push. Your app will be live at:
```
https://aevum-[random-string].onrender.com
```

### Step 5: Update OAuth Redirect URL

In the Kimi portal, update your app's OAuth redirect URL:
```
https://aevum-[random-string].onrender.com/api/oauth/callback
```

---

## Method 2: Railway (Free Tier + $5 Credit)

### Step 1: Push to GitHub
Same as Step 1 above.

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `aevum` repo
4. Railway auto-detects Node.js and sets build/start commands

### Step 3: Add Environment Variables

Go to your project → Variables tab → "Raw Editor"

Paste the contents of your `.env` file.

### Step 4: Generate Domain

Go to Settings → Public Networking → Generate Domain

Your URL will be: `https://aevum-[random].up.railway.app`

### Step 5: Update OAuth Redirect

Same as Render Step 5 — update the callback URL in Kimi portal.

---

## Method 3: Fly.io (Free Tier — Requires CLI)

### Step 1: Install Fly CLI

```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

### Step 2: Create App

```bash
cd aevum-project-folder
fly apps create aevum
```

### Step 3: Set Secrets

```bash
fly secrets set DATABASE_URL="your-db-url"
fly secrets set OPENAI_API_KEY="sk-your-key"
fly secrets set APP_SECRET="your-secret"
# ... set all other .env variables
```

### Step 4: Deploy

```bash
fly deploy
```

Your app will be at: `https://aevum.fly.dev`

---

## How the Static Frontend is Served

### Option A: Backend Serves Everything (Recommended)

The Hono server (`dist/boot.js`) already serves static files:

```typescript
// In production mode, boot.ts does this:
serveStaticFiles(app);  // Serves dist/public/
```

When a user visits `/`, the server:
1. Serves `index.html` from `dist/public/`
2. The React SPA loads client-side
3. API calls go to `/api/trpc/*` on the same domain

**Why this is best:**
- No CORS issues (same domain)
- Cookies work automatically (same domain)
- Simpler deployment (one server)
- Works with OAuth callbacks

### Option B: CDN + Separate Backend

If you want the frontend on a CDN for faster global loading:

**1. Build with backend URL:**
```bash
VITE_API_URL=https://api.yourdomain.com/api/trpc npm run build
```

**2. Deploy frontend to CDN:**
- **Vercel:** `vercel --prod dist/public`
- **Netlify:** Drag `dist/public/` to Netlify deploy UI
- **Cloudflare Pages:** Connect GitHub repo

**3. Deploy backend separately:**
Render/Railway/Fly with just the API.

**4. Configure CORS on backend:**
Add CORS headers to allow your CDN domain.

**Why you might want this:**
- Faster page loads worldwide (CDN edge caching)
- Frontend and backend can scale independently
- Common for high-traffic apps

**Trade-offs:**
- More complex setup
- Need to handle CORS
- OAuth callbacks need explicit domain configuration
- For a new app, the unified approach is simpler

---

## Cost Breakdown (Approximate Monthly)

### Free Tier Setup (Good for Start)

| Service | Platform | Cost |
|---------|----------|------|
| Backend hosting | Render Starter | **$0** (sleeps after 15min idle) |
| Database | TiDB Cloud Serverless | **$0** (5GB storage free) |
| AI (OpenAI) | Pay per use | **~$0.01/message** |
| Images (DALL-E) | Pay per use | **~$0.04/image** |
| Domain | Cloudflare/porkbun | **~$10/year** |
| **Total** | | **$0 + usage** |

### Production Setup (When you have users)

| Service | Platform | Cost |
|---------|----------|------|
| Backend hosting | Render Starter | **$7/month** (always on) |
| Database | TiDB Cloud | **$0-$20/month** |
| AI + Images | OpenAI | **Depends on usage** |
| Domain | Any registrar | **$10/year** |
| **Total** | | **~$7-30/month + AI usage** |

---

## After Deployment Checklist

- [ ] App loads at your URL
- [ ] Login works (OAuth redirects correctly)
- [ ] AI chat responds with real GPT answers
- [ ] Image generation produces real DALL-E images
- [ ] Partner linking works (generate code + accept)
- [ ] Check-ins save to database
- [ ] Push notifications toggle works (test notification arrives)
- [ ] Rate limiting active (credits show in Settings)

## Troubleshooting

**"Database connection refused"**
→ Check `DATABASE_URL` is correct. TiDB Cloud URLs must include `?ssl={"rejectUnauthorized":true}`

**"AI not responding"**
→ Check `OPENAI_API_KEY` is set. Verify at [platform.openai.com/usage](https://platform.openai.com/usage)

**"OAuth login fails"**
→ Check `VITE_KIMI_AUTH_URL` and `APP_ID`. Update redirect URL in Kimi portal.

**"Images not generating"**
→ Your OpenAI account needs billing enabled. Add a payment method.

**"Push notifications don't work"**
→ Need proper VAPID keys. Run `npx web-push generate-vapid-keys` and update the push router.
