# Docker Deployment Guide

This project can run as a single Docker container in production.

## What this setup does

- Builds the React client
- Serves the built frontend from the Node backend
- Exposes the app on port `5010`
- Persists `backend/data`, `backend/uploads`, and `backend/private-data` on the server host

## 1. Create the backend environment file

Create `backend/.env` on the server. You can start from:

```bash
cp backend/.env.example backend/.env
```

Then update the important values:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `CORS_ALLOWED_ORIGINS`
- `TRUST_PROXY`

For a single-container deployment behind a reverse proxy, a typical value is:

```env
NODE_ENV=production
PORT=5010
TRUST_PROXY=true
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

## 2. Build and start with Docker Compose

```bash
docker compose up -d --build
```

## 3. Check logs

```bash
docker compose logs -f
```

You should see the backend start on port `5010`.

## 4. Stop or restart

```bash
docker compose down
docker compose up -d
```

## 5. Rebuild after code changes

```bash
docker compose up -d --build
```

## Optional: Build and run without Compose

Build:

```bash
docker build -t aarna-web .
```

Run:

```bash
docker run -d \
  --name aarna-web \
  --env-file backend/.env \
  -p 5010:5010 \
  -v $(pwd)/backend/data:/app/backend/data \
  -v $(pwd)/backend/uploads:/app/backend/uploads \
  -v $(pwd)/backend/private-data:/app/backend/private-data \
  aarna-web
```
