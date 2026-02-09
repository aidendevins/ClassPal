# ClassPal — Full handoff for new Cursor (no prior context)

**Use this as the single source of truth for repo state, stack, deploy steps, and next build order.**

---

## What this project is

**ClassPal** (working name) is a **teacher-first “daily driver” AI copilot for AP/IB high school teachers** (general education). The product turns each class into immediate, classroom-ready next steps: targeted reteach plans, exit tickets aligned to what was taught, student recaps, and one optional coaching insight. It is **teacher-owned and teacher-first**: no admin dashboards by default, nothing shared without explicit teacher action, not surveillance.

**Principles:** action over dashboards (usable in under 60 seconds), low friction (capture fits teacher rituals), coaching opt-in and kind (“glow + grow”), outputs specific to the teacher’s class (objectives, textbook refs, timestamps). **Target user:** high school AP/IB teachers; direct-to-teacher; institutional sales later without compromising teacher trust.

---

## Repo structure

```
ClassPal/
├── README.md
├── NEXT-STEPS.md
├── REPO-CONTENTS.md
├── .gitignore
├── backend/
│   ├── package.json       (name: classpal-backend)
│   ├── server.js          (Express, CORS, /api, /health)
│   ├── env.example        (PORT=8000, NODE_ENV, FRONTEND_URL)
│   ├── railway.toml
│   └── routes/api.js      (/, /status, /waitlist)
└── frontend/
    ├── package.json       (name: classpal-frontend; React 18, Vite, Tailwind; no Recharts)
    ├── index.html
    ├── vite.config.js     (optimizeDeps.include: ['tailwindcss'])
    ├── postcss.config.cjs (tailwindcss, autoprefixer)
    ├── tailwind.config.js
    ├── vercel.json        (rewrites to /index.html for SPA)
    ├── env.example        (VITE_API_URL)
    └── src/
        ├── main.jsx       (renders <App />)
        ├── App.jsx        (landing + waitlist form)
        └── index.css      (Tailwind base)
```

---

## Stack (reference only — same pattern as a previous React+Express project)

- **Frontend:** React 18, Vite, Tailwind CSS. Deploy: Vercel. Root directory: `frontend`. Env: `VITE_API_URL` = backend API base URL (e.g. `https://your-app.up.railway.app/api`).
- **Backend:** Express, Node 18+. Deploy: Railway. Root directory: `backend`. Env: `PORT`, `NODE_ENV`, `FRONTEND_URL` (Vercel origin for CORS).
- **Local:** Backend port 8000, frontend port 5173. Frontend calls backend via `VITE_API_URL`.

---

## Instructions for you (new Cursor)

### 1. Clone and run locally (if not already)

```bash
git clone https://github.com/aidendevins/ClassPal.git
cd ClassPal

# Backend
cd backend && npm install && cp env.example .env && npm run dev

# New terminal: Frontend
cd frontend && npm install && cp env.example .env.local && npm run dev
```

Open http://localhost:5173 — landing + waitlist should work. Header shows “Connected” when API is reachable.

### 2. Deploy if not already deployed

- **Railway:** New project from GitHub → ClassPal, root directory `backend`. Variables: `PORT=8000`, `NODE_ENV=production`, `FRONTEND_URL` = (Vercel URL after frontend deploy). Deploy and copy public URL.
- **Vercel:** New project from GitHub → ClassPal, root directory `frontend`. Env: `VITE_API_URL` = (Railway URL + `/api`). Deploy and copy URL.
- **Wire CORS:** In Railway set `FRONTEND_URL` to Vercel URL and redeploy backend.

### 3. Next product work (in order)

- **Phase 2:** Auth placeholder (e.g. email or simple magic link / “Continue”) + “logged-in” dashboard shell. Route or pathname for `/dashboard`; show a minimal dashboard only when “logged in”; backend `GET /api/me` or equivalent if using tokens. No real auth required for placeholder — can be a stub that sets a session/token.
- **Phase 3:** One end-to-end wedge: after-class outputs. Backend: e.g. `POST /api/lessons` (or `/api/sessions`) with minimal payload (course id, date, transcript or summary text, objectives); `POST /api/lessons/:id/generate` (or similar) to produce: (a) teacher summary + objectives, (b) student recap (objectives, vocab, what to study, 3 practice prompts, textbook refs), (c) 10-minute reteach plan (two options if possible). Frontend: “After class” flow — create/select session, optional paste transcript, “Generate” → results page with the three artifacts. Generation can be rule-based or LLM (e.g. OpenAI) using prompts aligned to the product spec; artifacts must cite course/unit/objectives and feel “specific to my class.”
- **Phase 4+:** Capture ritual (start class, attach transcript/materials); exit ticket generator; one coaching insight (opt-in, glow+grow); confusion moments + time map; assignment time estimator; “where did I leave off” task state; later: homework/quiz generator, talk ratio, PD export, community. See “Product scope” below for priorities.

### 4. Product scope (condensed)

- **MVP (first 4 weeks):** Landing + waitlist (done), auth + dashboard shell, one class session → teacher summary + student recap + 10-min reteach plan (input: manual transcript paste or upload). Optional: exit ticket (5 questions + answer key + misconception mapping), one coaching insight per lesson (opt-in), minimal “where did I leave off” (list of pending reteach/grading/objectives).
- **Out of MVP for now:** Live recording/ASR, full assignment time estimator, homework/quiz generator, talk ratio, PD export, community. Add after core wedge and task state are validated.
- **Non-negotiables:** Teacher-first, teacher-owned; no surveillance tone; low friction; action in under 60 seconds; one coaching insight default opt-in; outputs specific to class (objectives, textbook, timestamps).

### 5. Key paths

- **Backend API:** `backend/routes/api.js` — add new routes here; keep waitlist and status.
- **Frontend entry:** `frontend/src/main.jsx` — add routing here when you add `/dashboard` (e.g. pathname check or React Router).
- **Landing + waitlist:** `frontend/src/App.jsx`. Waitlist POST body: `{ email, name? }` to `VITE_API_URL/waitlist`.
- **Env:** backend `backend/.env` (never commit); frontend `frontend/.env.local`; production: Railway variables and Vercel env.

### 6. Gotchas

- Keep PostCSS as **`postcss.config.cjs`** (CommonJS); a `.js` ESM version can break the build on some Node versions.
- Keep **`optimizeDeps.include: ['tailwindcss']`** in `vite.config.js` for reliable dev server.
- **CORS:** backend must allow the exact frontend origin (`FRONTEND_URL` in production, `http://localhost:5173` in dev).

### 7. Do not

- Add TowBotics-specific features, copy, or branding. ClassPal only.
- Expose admin dashboards or non–teacher-owned sharing by default.
- Skip “specific to my class” in any generated artifact (objectives, textbook refs, timestamps where possible).

---

## Quick reference

| Item              | Value |
|-------------------|--------|
| GitHub            | https://github.com/aidendevins/ClassPal |
| Backend dev       | http://localhost:8000 |
| Frontend dev      | http://localhost:5173 |
| API base (frontend) | `VITE_API_URL` → e.g. `http://localhost:8000/api` |
| Backend CORS      | `FRONTEND_URL` (production frontend URL) |

---

*End of handoff.*
