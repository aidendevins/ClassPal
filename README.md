# ClassPal

Teacher-first “daily driver” copilot for AP/IB high school teachers. Turns each class into actionable next steps: targeted reteach, quick checks, student recap, and gentle coaching — without surveillance or admin theater.

## Stack

- **Frontend:** React 18, Vite, Tailwind CSS (Vercel)
- **Backend:** Express, Node (Railway)

## Local setup

```bash
# Backend
cd backend && npm install && cp env.example .env && npm run dev

# Frontend (new terminal)
cd frontend && npm install && cp env.example .env.local && npm run dev
```

- Backend: http://localhost:8000  
- Frontend: http://localhost:5173  

## Deploy

- **Backend:** Railway, root directory `backend`, env: `PORT`, `NODE_ENV`, `FRONTEND_URL`
- **Frontend:** Vercel, root directory `frontend`, env: `VITE_API_URL` = Railway URL + `/api`

See `classpal-docs/01-SETUP-AND-BUILD-GUIDE.md` in the TowBotics repo (or copy into this repo) for full setup and build order.
