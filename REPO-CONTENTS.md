# What’s in this repo

Everything you need to run ClassPal locally and deploy (same stack as TowBotics).

## Structure

```
ClassPal/
├── README.md                 # Project overview + local setup + deploy
├── REPO-CONTENTS.md          # This file
├── .gitignore
├── backend/
│   ├── package.json          # classpal-backend
│   ├── server.js             # Express + CORS
│   ├── env.example           # PORT, NODE_ENV, FRONTEND_URL
│   ├── railway.toml          # (optional) Railway config
│   └── routes/
│       └── api.js            # GET /status, POST /waitlist
└── frontend/
    ├── package.json          # classpal-frontend, React 18 + Vite
    ├── index.html            # Title + meta for ClassPal
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vercel.json           # SPA rewrite for Vercel
    ├── env.example           # VITE_API_URL
    ├── public/               # (optional) favicon, images
    └── src/
        ├── main.jsx          # Renders <App />
        ├── App.jsx           # Landing + waitlist form
        └── index.css         # Tailwind base
```

## Backend

- **Endpoints:** `GET /api/status`, `POST /api/waitlist` (email required, name optional).
- **Env:** Copy `backend/env.example` to `backend/.env` and set `PORT`, `NODE_ENV`, `FRONTEND_URL`.

## Frontend

- **Landing:** Hero, value props, waitlist form. Form POSTs to `VITE_API_URL/waitlist`.
- **Env:** Copy `frontend/env.example` to `frontend/.env.local` and set `VITE_API_URL=http://localhost:8000/api` (or your Railway API URL + `/api` in production).

## Push to GitHub (first time)

From the **ClassPal** folder (not towbotics):

```bash
cd /Users/aiden/Documents/GitHub/ClassPal

# If you haven’t already
git init
git branch -M main
git remote add origin https://github.com/aidendevins/ClassPal.git

# Stage and commit
git add .
git commit -m "Initial ClassPal: React + Express, landing + waitlist"

# Push (will prompt for auth if needed)
git push -u origin main
```

If the repo already had a README and you created a first commit on GitHub, do a pull first:

```bash
git pull origin main --allow-unrelated-histories
# Resolve any conflicts, then:
git add .
git commit -m "Merge with GitHub initial commit"
git push -u origin main
```

## Next steps

- Run backend and frontend locally (see README).
- Deploy backend to Railway (root: `backend`), frontend to Vercel (root: `frontend`).
- Set `FRONTEND_URL` and `VITE_API_URL` in production.
- Use the full build order in **classpal-docs/01-SETUP-AND-BUILD-GUIDE.md** (in the TowBotics repo or copy into this one) for Phase 2+ (auth, post-class outputs, etc.).
