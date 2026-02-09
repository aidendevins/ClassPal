# Phase 2 — Auth placeholder + dashboard shell

**Goal:** A minimal “logged-in” experience: placeholder auth (e.g. “Continue” / email stub) and a dashboard only visible when “logged in.” No real auth yet — stub session/token is fine.

---

## Step 2.1 — Add routing (frontend)

- [ ] Install React Router: `cd frontend && npm install react-router-dom`
- [ ] In `frontend/src/main.jsx`: wrap the app in `<BrowserRouter>` and render routes:
  - `/` → landing (current `App` content: hero + waitlist)
  - `/dashboard` → dashboard shell (new component)
- [ ] Keep `App.jsx` as the landing page; create `Dashboard.jsx` (or similar) for the dashboard shell.

**Result:** Visiting `/` shows landing; visiting `/dashboard` shows the dashboard (no auth gate yet).

---

## Step 2.2 — Auth placeholder (backend)

- [ ] In `backend/routes/api.js` add:
  - **POST `/api/auth/continue`** (or `/api/auth/login`) — accepts e.g. `{ email }` (or nothing). Returns a stub “token” (e.g. a random string or `"stub-" + Date.now()`). No DB yet; just return a token in JSON.
  - **GET `/api/me`** — accepts `Authorization: Bearer <token>` (or a simple header). If token is present and “valid” (e.g. starts with `stub-` or matches a single in-memory stub), return stub user: `{ id, email, name }`. Otherwise 401.
- [ ] Optionally store the stub token in memory on the backend so `/api/me` can validate it (or keep it stateless and accept any `stub-*` token for now).

**Result:** Frontend can “log in” by calling POST and get a token; backend can “validate” it with GET /api/me.

---

## Step 2.3 — Auth placeholder (frontend)

- [ ] On the **landing page**: add a “Continue” or “Get started” entry point (button/link) that:
  - Calls `POST /api/auth/continue` (optionally with email from a field, or empty body).
  - Receives the stub token and stores it (e.g. `localStorage.setItem('token', data.token)`).
  - Redirects to `/dashboard` (e.g. `navigate('/dashboard')`).
- [ ] Create a simple auth context or hook (e.g. `useAuth`) that:
  - Reads token from `localStorage`.
  - Calls `GET /api/me` with `Authorization: Bearer <token>`.
  - Exposes `{ user, loading, loggedIn, login, logout }` (logout = clear token and optionally call a backend logout if you add it later).

**Result:** User can click “Continue”, get a stub token, and land on `/dashboard`.

---

## Step 2.4 — Dashboard shell + auth gate

- [ ] **Dashboard page** (`/dashboard`):
  - If not “logged in” (no token or `/api/me` fails), redirect to `/` (or show a “Log in to continue” message and link back).
  - If logged in, show a minimal shell: e.g. “Dashboard” heading, welcome message with user email/name, and a “Log out” button that clears the token and redirects to `/`.
- [ ] Optional: use the same auth check in the router (e.g. protected route component) so `/dashboard` always redirects when not logged in.

**Result:** `/dashboard` is only useful when “logged in”; otherwise user is sent back to landing.

---

## Step 2.5 — Header updates

- [ ] On **landing** (`/`): show “Continue” / “Get started” in the header (and keep “Connected” or move it).
- [ ] On **dashboard** (`/dashboard`): show user identity (e.g. email) and “Log out” in the header; link “ClassPal” to `/dashboard` or `/`.

**Result:** Clear entry to auth from landing and clear exit on dashboard.

---

## Step 2.6 — Verify and deploy

- [ ] Run backend and frontend locally; test: landing → Continue → dashboard → Log out → landing.
- [ ] Test with invalid/missing token: `/dashboard` should redirect or show “log in” message.
- [ ] Commit, push, and let Railway + Vercel deploy. Smoke-test production the same way.

---

## Quick reference

| Item | Where |
|------|--------|
| Add routes | `frontend/src/main.jsx` (React Router) |
| Landing | `frontend/src/App.jsx` (add “Continue” button) |
| Dashboard UI | New `frontend/src/Dashboard.jsx` (or `pages/Dashboard.jsx`) |
| Auth API | `backend/routes/api.js`: POST `/api/auth/continue`, GET `/api/me` |
| Token storage | Frontend: `localStorage`; send as `Authorization: Bearer <token>` |

---

After Phase 2 is done, you’re ready for **Phase 3** (one end-to-end wedge: after-class outputs — lessons, generate summary/recap/reteach).
