# Docker Deployment Guide

This project runs as a single Dockerized Node application. The React frontend is built during the image build, and the Express backend serves the compiled frontend and API from the same container.

## What this setup does

- Builds the React client with `react-snap`
- Serves the built frontend from the Node backend
- Exposes the app on port `5010`
- Persists `backend/data`, `backend/uploads`, and `backend/private-data` on the host through bind mounts

## Files involved

- `Dockerfile`: multi-stage build for frontend and backend
- `docker-compose.yml`: single-service deployment definition
- `backend/.env`: runtime environment variables loaded by the container

## 1. Create the backend environment file

Create `backend/.env` on the machine where you will run Docker. You can start from:

```bash
cp backend/.env.example backend/.env
```

Then set at least:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `CORS_ALLOWED_ORIGINS`
- `TRUST_PROXY`

Recommended production example:

```env
NODE_ENV=production
PORT=5010
TRUST_PROXY=true
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
CONTACTS_DATA_FILE=./private-data/contacts.json
ANALYTICS_DATA_FILE=./private-data/analytics.json
```

Notes:

- If `CONTACTS_DATA_FILE` and `ANALYTICS_DATA_FILE` are not set, the server defaults them to `./data/contacts.json` and `./data/analytics.json`.
- In production, the current backend code enables HSTS automatically.

## 2. Build and start with Docker Compose

```bash
docker compose up -d --build
```

This builds the Docker image from the local project and starts the `aarna-web` container defined in `docker-compose.yml`.

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

## Volumes and persistence

The Compose file mounts these host directories into the container:

| Host path | Container path | Purpose |
|---|---|---|
| `./backend/data` | `/app/backend/data` | Public JSON content |
| `./backend/uploads` | `/app/backend/uploads` | Uploaded media |
| `./backend/private-data` | `/app/backend/private-data` | Sensitive JSON data |

## Dockerfile behavior

The Dockerfile has two stages:

1. `client-builder`
   Installs Chromium, installs frontend dependencies, and runs the production build for the React app.
2. `server`
   Installs backend production dependencies, copies `backend/server.js`, copies `backend/data`, copies the built frontend output, and starts `npm start`.

Important detail:

- The image does not bake in `backend/uploads` or `backend/private-data`; those are expected to come from mounted host directories at runtime.

## Optional: Build and run without Compose

Build:

```bash
docker build -t aarna-web .
```

Run on Linux or macOS:

```bash
docker run -d \
  --name aarna-web \
  --env-file backend/.env \
  -p 5010:5010 \
  -v "$(pwd)/backend/data:/app/backend/data" \
  -v "$(pwd)/backend/uploads:/app/backend/uploads" \
  -v "$(pwd)/backend/private-data:/app/backend/private-data" \
  aarna-web
```

Run on PowerShell:

```powershell
docker run -d `
  --name aarna-web `
  --env-file backend/.env `
  -p 5010:5010 `
  -v "${PWD}/backend/data:/app/backend/data" `
  -v "${PWD}/backend/uploads:/app/backend/uploads" `
  -v "${PWD}/backend/private-data:/app/backend/private-data" `
  aarna-web
```