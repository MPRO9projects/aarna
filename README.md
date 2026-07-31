# Aarna Website

A full-stack website for Aarna, an event venue and stay property. The project uses a React frontend and a Node.js/Express backend, with a password-protected admin panel for managing site content, gallery media, contacts, settings, and analytics.

## Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Admin Panel](#admin-panel)
- [Docker Deployment](#docker-deployment)
- [Data Storage](#data-storage)
- [Security Notes](#security-notes)

## Project Structure

```text
AARNA-WEBISTE/
|-- backend/                  # Express API server
|   |-- server.js             # Main entry point
|   |-- data/                 # Public JSON data files
|   |   |-- gallery.json
|   |   |-- sections.json
|   |   |-- services.json
|   |   |-- settings.json
|   |   `-- siteMedia.json
|   |-- private-data/         # Recommended private storage for contacts and analytics
|   |   |-- contacts.json
|   |   `-- analytics.json
|   |-- uploads/              # Uploaded media files
|   |-- .env                  # Runtime environment variables (not committed)
|   `-- .env.example          # Environment variable template
|-- client/                   # React SPA (Create React App)
|   |-- src/
|   |   |-- pages/            # Home, About, Contact, Gallery, policies, admin
|   |   |-- components/       # Header, Footer, ScrollToTop, etc.
|   |   |-- hooks/            # Custom React hooks
|   |   |-- services/         # API client
|   |   `-- App.js
|   `-- package.json
|-- Dockerfile                # Multi-stage production Docker build
|-- docker-compose.yml        # Single-container deployment
|-- .dockerignore
`-- DOCKER.md                 # Docker deployment guide
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Framer Motion, GSAP, AOS |
| Backend | Node.js, Express 4 |
| Auth | Custom HMAC-SHA256 signed tokens |
| Storage | JSON flat files |
| Media | Multer disk storage with UUID filenames |
| Security | Helmet, CORS, express-rate-limit, compression |
| Static pre-rendering | react-snap with Chromium |
| Container | Docker multi-stage build on Node 20 Alpine |

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Engine 24+ and Docker Compose v2 for container deployment

## Local Development

### 1. Install dependencies

```bash
cd backend
npm install

cd ../client
npm install
```

### 2. Configure environment

Create `backend/.env` from `backend/.env.example`.

Example:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set at least:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

### 3. Start the backend

```bash
cd backend
npm run dev
```

Or:

```bash
cd backend
npm start
```

The API runs at `http://localhost:5010`.

### 4. Start the frontend

```bash
cd client
npm start
```

The frontend runs at `http://localhost:3000`.

In development, the frontend API client targets `http://localhost:5010`, which matches the backend default.

## Environment Variables

All variables are read from `backend/.env`.

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | Use `production` for deployed environments |
| `PORT` | `5010` | Backend port |
| `ADMIN_USERNAME` | none | Admin login username |
| `ADMIN_PASSWORD` | none | Admin login password |
| `ADMIN_SESSION_SECRET` | none | Secret used to sign admin tokens |
| `ADMIN_TOKEN_TTL_MS` | `28800000` | Admin session lifetime in milliseconds |
| `TRUST_PROXY` | empty | Set to `true` behind a reverse proxy |
| `CORS_ALLOWED_ORIGINS` | empty | Comma-separated allowed origins |
| `ENABLE_HSTS` | `false` | Enables HSTS outside production; in production HSTS is enabled by the server code regardless |
| `CONTACTS_DATA_FILE` | `./data/contacts.json` | Contact submissions storage path |
| `ANALYTICS_DATA_FILE` | `./data/analytics.json` | Analytics storage path |
| `CLIENT_BUILD_DIR` | `../client/build` | Frontend build directory served by the backend |
| `JSON_BODY_LIMIT` | `1mb` | Max JSON body size |
| `CONTACT_RATE_LIMIT_WINDOW_MS` | `900000` | Contact form rate-limit window |
| `CONTACT_RATE_LIMIT_MAX` | `5` | Max contact submissions per window |
| `ANALYTICS_RATE_LIMIT_WINDOW_MS` | `900000` | Analytics rate-limit window |
| `ANALYTICS_RATE_LIMIT_MAX` | `300` | Max analytics events per window |
| `UPLOADS_CACHE_MAX_AGE_SECONDS` | `31536000` | Cache max-age for uploaded media |

Public request rate limits are skipped in development (`NODE_ENV !== 'production'`).

## API Reference

### Public endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/sections` | List all content sections |
| `GET` | `/api/services` | List all services |
| `GET` | `/api/gallery` | List all gallery items |
| `GET` | `/api/settings` | Get site settings |
| `GET` | `/api/site-media` | Get hero and page media config |
| `POST` | `/api/contact` | Submit a contact or booking enquiry |
| `POST` | `/api/analytics/visit` | Record a page visit |
| `POST` | `/csp-report` | Receive CSP violation reports |

### `POST /api/contact`

```json
{
  "name": "string (required, max 120)",
  "email": "string (required, valid email)",
  "phone": "string (required, 7-15 digits)",
  "eventType": "wedding | reception | engagement | mehendi-sangeet | haldi | book-your-stay | other | ''",
  "eventDate": "YYYY-MM-DD (optional)",
  "guestCount": "integer string (optional, 0-100000)",
  "message": "string (optional, max 3000)",
  "checkIn": "YYYY-MM-DD (required if book-your-stay)",
  "checkOut": "YYYY-MM-DD (required if book-your-stay, must be on or after checkIn)",
  "adults": "integer string (required if book-your-stay, min 1)",
  "children": "integer string (optional)",
  "stayQuery": "string (optional, max 3000)"
}
```

Rate-limited to 5 requests per 15 minutes per IP in production.

### Admin endpoints

All admin endpoints require a `Bearer <token>` header obtained from `/api/admin/login`.

#### Authentication

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Login and receive a signed token |
| `GET` | `/api/admin/session` | Validate the current token |

Login is rate-limited after repeated failed attempts.

#### Sections

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/sections` | Create a section |
| `PUT` | `/api/sections/:id` | Update a section |
| `DELETE` | `/api/sections/:id` | Delete a section and its image |

Fields: `title`, `description`, `longDescription`, `location`, `eyebrow`, `highlights`, `stats`, `image`.

#### Services

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/services` | Create a service |
| `PUT` | `/api/services/:id` | Update a service |
| `DELETE` | `/api/services/:id` | Delete a service |

Fields: `title`, `subtitle`, `description`, `image`.

#### Gallery

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/gallery` | Upload a gallery image |
| `DELETE` | `/api/gallery/:id` | Delete a gallery item and its image |

Fields: `title`, `category`, `image`.

#### Contacts

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/contacts` | List all contact submissions |
| `PUT` | `/api/admin/contacts/:id/read` | Mark a contact as read |
| `DELETE` | `/api/admin/contacts/:id` | Delete a contact submission |

#### Settings

| Method | Path | Description |
|---|---|---|
| `PUT` | `/api/settings` | Update site settings |

Fields: `siteName`, `phone`, `phoneSecondary`, `email`, `address`, `openingHours`, `social.instagram`, `social.facebook`, `social.youtube`, `social.whatsapp`.

#### Site Media

| Method | Path | Description |
|---|---|---|
| `PUT` | `/api/site-media` | Update hero text and media assets |

Supported file fields:

- `heroVideoLandscape`
- `heroVideoPortrait`
- `eventMainImage`
- `eventFloatImage`
- `stayMainImage`
- `stayFloatImage`
- `aboutHeroImage`
- `aboutIntroMainImage`
- `aboutIntroFloatImage`
- `aboutPromiseImage`
- `contactHeroImage`

Text fields:

- `heroTitle`
- `heroTagline`
- `heroSubtitle`
- `heroComingSoon`

Video upload limit: 200 MB. Image upload limit: 25 MB.

#### Analytics

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/analytics` | Get analytics summary |

## Admin Panel

The admin panel is available at `/admin`.

Features include:

- Managing contact and booking enquiries
- Uploading and managing gallery images
- Editing sections and services
- Updating site settings
- Updating hero and page media
- Viewing analytics

## Docker Deployment

See [DOCKER.md](DOCKER.md) for full instructions.

Quick summary:

1. Create `backend/.env` from `backend/.env.example`.
2. For production, point `CONTACTS_DATA_FILE` and `ANALYTICS_DATA_FILE` to `./private-data/...` if you want those files kept separate from `backend/data`.
3. Run `docker compose up -d --build`.
4. The app listens on port `5010`.

### Container layout

- `./backend/data` is mounted to `/app/backend/data`
- `./backend/uploads` is mounted to `/app/backend/uploads`
- `./backend/private-data` is mounted to `/app/backend/private-data`

### Dockerfile summary

The Dockerfile uses two stages:

1. `client-builder`: installs Chromium, installs frontend dependencies, and builds the React app with `react-snap`.
2. `server`: installs backend production dependencies, copies `server.js`, bundled data files, and the built frontend, then starts `npm start`.

## Data Storage

There is no database. Data is stored as JSON files on disk.

Default backend file paths:

| File | Default Location | Contents |
|---|---|---|
| `sections.json` | `backend/data/` | Content sections |
| `services.json` | `backend/data/` | Service cards |
| `gallery.json` | `backend/data/` | Gallery metadata |
| `settings.json` | `backend/data/` | Site settings |
| `siteMedia.json` | `backend/data/` | Hero and page media/text |
| `contacts.json` | `backend/data/` by default, or `backend/private-data/` when configured | Contact submissions |
| `analytics.json` | `backend/data/` by default, or `backend/private-data/` when configured | Analytics events |

All JSON files are auto-created if missing. IDs are UUIDs.

## Security Notes

- Change all credentials before deploying.
- Admin tokens are HMAC-SHA256 signed and expire by default after 8 hours.
- Login attempts are rate-limited after repeated failures.
- Helmet is configured with CSP, frame protection, referrer policy, and permissions policy.
- CORS is restricted to the origins listed in `CORS_ALLOWED_ORIGINS`, with localhost support in development.
- Uploaded file paths are validated before deletion to avoid path traversal.
- `private-data/` is recommended for sensitive JSON files when deploying.