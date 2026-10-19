# Portfolio backend

Express + MongoDB (Mongoose) + Zod API for the portfolio's guest wall and contact form.

## Endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/api/health` | liveness + DB state |
| GET | `/api/guestbook` | latest 30 notes (in-memory cache, cleared on every write) |
| POST | `/api/guestbook` | `{name?, message}`, rate-limited 5 per 10 min per IP |
| DELETE | `/api/guestbook/:id` | moderation, header `x-admin-token` |
| POST | `/api/contact` | `{name, email, message}`, stored privately |
| GET | `/api/contact` | read messages, header `x-admin-token` |

Protections: Zod validation, helmet, CORS allow-list, rate limits, 10kb body cap, honeypot field `website`.

## Run locally
```bash
cp .env.example .env     # fill in MONGODB_URI, ADMIN_TOKEN
npm install
npm run dev
curl localhost:3000/api/health
curl -X POST localhost:3000/api/guestbook -H 'content-type: application/json' -d '{"name":"Test","message":"hello"}'
```

## Deploy
1. **MongoDB Atlas**: create a free cluster, add a database user, allow network access (0.0.0.0/0 for Render's free tier), copy the connection string.
2. **Render**: New → Web Service → connect this repo. Build `npm install`, Start `npm start`. Add env vars `MONGODB_URI`, `ADMIN_TOKEN`, `ALLOWED_ORIGINS` (your frontend URL).
3. **Frontend**: in `aditya-portfolio-selfhost.html`, set `API` near the top of the script to your Render URL, then deploy the file on Vercel (or any static host). Add that Vercel URL to `ALLOWED_ORIGINS` on Render.

Render's free tier sleeps when idle, so the first request can take ~30s. The page shows a "waking server" status while it waits.

## Moderate
```bash
curl -X DELETE https://YOUR-API/api/guestbook/<id> -H "x-admin-token: $ADMIN_TOKEN"
curl https://YOUR-API/api/contact -H "x-admin-token: $ADMIN_TOKEN"
```
