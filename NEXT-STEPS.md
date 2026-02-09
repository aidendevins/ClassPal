# ClassPal — Step-by-step: what to do next

Use this checklist in order. Your landing page is working locally; the goal is to get it on GitHub, deployed, and then move to Phase 2.

---

## Step 1 — Get GitHub up to date

You have uncommitted changes (the PostCSS/Vite fix that made the frontend run). Push them:

```bash
cd /Users/aiden/Documents/GitHub/ClassPal

git add .
git status   # Should show: deleted postcss.config.js, new postcss.config.cjs, modified vite.config.js, new frontend/package-lock.json
git commit -m "Fix frontend: PostCSS .cjs config + Vite optimizeDeps for Tailwind"
git push origin main
```

After this, **everything that should be in GitHub is there**: backend, frontend (landing + waitlist), README, .gitignore, and the frontend fix.

---

## Step 2 — Deploy backend (Railway)

1. Go to [railway.app](https://railway.app) and sign in.
2. **New Project** → **Deploy from GitHub repo** → select **aidendevins/ClassPal**.
3. Set **Root Directory** to `backend`.
4. Add **Variables**:
   - `PORT` = 8000  
   - `NODE_ENV` = production  
   - `FRONTEND_URL` = leave blank for now (set after Step 3).
5. Deploy. When it’s live, copy the **public URL** (e.g. `https://classpal-production.up.railway.app`).

---

## Step 3 — Deploy frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in.
2. **Add New** → **Project** → Import **aidendevins/ClassPal**.
3. Set **Root Directory** to `frontend`.
4. Add **Environment Variable**:
   - Name: `VITE_API_URL`  
   - Value: `https://YOUR_RAILWAY_URL/api` (the URL from Step 2 + `/api`)
5. Deploy. Copy the **Vercel URL** (e.g. `https://classpal.vercel.app`).

---

## Step 4 — Wire backend to frontend

1. In **Railway**, open your ClassPal backend service → **Variables**.
2. Set `FRONTEND_URL` to your **Vercel URL** from Step 3 (e.g. `https://classpal.vercel.app`).
3. Redeploy the backend so CORS allows your frontend.

---

## Step 5 — Verify production

- Open your **Vercel URL** in the browser. You should see the ClassPal landing page.
- Submit the waitlist form. It should succeed and the backend should log the signup (check Railway logs if you want).
- Header should show “Connected” when the frontend can reach the API.

---

## Step 6 — Optional: custom domain

- In Vercel: **Project** → **Settings** → **Domains** → add your domain.
- In Railway: add a custom domain for the API if you want (e.g. `api.classpal.com`).
- Update `FRONTEND_URL` and `VITE_API_URL` to use the new domains and redeploy.

---

## Step 7 — What’s next (product build)

After the app is live and GitHub is up to date:

- **Phase 2** (from the build guide): Auth placeholder + “logged-in” dashboard shell.
- **Phase 3**: One end-to-end wedge (e.g. “After class” → teacher summary, student recap, 10-min reteach plan).

The full order is in **TowBotics repo** → `classpal-docs/01-SETUP-AND-BUILD-GUIDE.md` (Section E: Phased Build Order). You can copy that folder into ClassPal or keep it in TowBotics and reference it when you’re ready for Phase 2+.

---

## Quick reference

| Done? | Task |
|-------|------|
| ☐ | Step 1: Commit + push (PostCSS fix, vite.config, package-lock) |
| ☐ | Step 2: Deploy backend on Railway (root: backend) |
| ☐ | Step 3: Deploy frontend on Vercel (root: frontend, set VITE_API_URL) |
| ☐ | Step 4: Set FRONTEND_URL in Railway, redeploy |
| ☐ | Step 5: Test live site + waitlist |
| ☐ | Step 6 (optional): Custom domain |
| ☐ | Step 7: Start Phase 2 (auth + dashboard) from build guide |
