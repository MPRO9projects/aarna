# Aarna Website

A full-stack website for Aarna — an event venue and stay property. Built with a React frontend and a Node.js/Express backend. Includes a password-protected admin panel for managing content, gallery, contacts, and site media.

---

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

---

## Project Structure

```
AARNA-WEBISTE/
├── backend/                  # Express API server
│   ├── server.js             # Main entry point
│   ├── data/                 # Public JSON data files
│   │   ├── gallery.json
│   │   ├── sections.json
│   │   ├── services.json
│   │   ├── settings.json
│   │   └── siteMedia.json
│   ├── private-data/         # Sensitive data (contacts, analytics)
│   │   ├── contacts.json
│   │   └── analytics.json
│   ├── uploads/              # Uploaded media files (images/videos)
│   ├── .env                  # Runtime environment variables (not committed)
│   └── .env.example          # Environment variable template
├── client/                   # React SPA (Create React App)
│   ├── src/
│   │   ├── pages/            # Home, About, Contact, Gallery, PrivacyPolicy, TermsOfService, Admin
│   │   ├── components/       # Header, Footer, ScrollToTop, etc.
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client (api.js)
│   │   └── App.js
│   └── package.json
├── Dockerfile                # Multi-stage production Docker build
├── docker-compose.yml        # Single-container production deployment
├── .dockerignore
└── DOCKER.md                 # Docker deployment guide
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Framer Motion, GSAP, AOS |
| Backend | Node.js, Express 4 |
| Auth | Custom HMAC-SHA256 signed tokens (no JWT library) |
| Storage | JSON flat files (no database) |
| Media | Multer (disk storage), UUID filenames |
| Security | Helmet, CORS, express-rate-limit, gzip compression |
| Static pre-rendering | react-snap (Puppeteer/Chromium, postbuild) |
| Container | Docker multi-stage, Alpine base |

---

## Prerequisites

- **Node.js** 20+
- **npm** 10+
- For Docker: Docker Engine 24+ and Docker Compose v2

---

## Local Development

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` — at minimum set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`.

### 3. Start the backend

```bash
cd backend
npm run dev        # nodemon with auto-reload
# or
npm start          # plain node
```

The API runs at `http://localhost:5010`.

### 4. Start the frontend

```bash
cd client
npm start
```

The React dev server runs at `http://localhost:3000` and proxies all `/api/*` calls to the backend at port 5010.

---

## Environment Variables

All variables are read from `backend/.env`. The server loads this file manually at startup — no `dotenv` package is used.

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | Set to `production` in Docker |
| `PORT` | `5010` | Port the backend listens on |
| `ADMIN_USERNAME` | — | Admin login username |
| `ADMIN_PASSWORD` | — | Admin login password |
| `ADMIN_SESSION_SECRET` | — | Secret used to sign admin tokens (HMAC-SHA256) |
| `ADMIN_TOKEN_TTL_MS` | `28800000` | Admin session lifetime in ms (default 8 hours, min 5 min) |
| `TRUST_PROXY` | — | Set to `true` when behind a reverse proxy (Nginx, Caddy, etc.) |
| `CORS_ALLOWED_ORIGINS` | — | Comma-separated list of allowed origins, e.g. `https://aarna.net.in` |
| `ENABLE_HSTS` | `false` | Enable HSTS header (auto-enabled in production) |
| `CONTACTS_DATA_FILE` | `./data/contacts.json` | Path to contacts storage file |
| `ANALYTICS_DATA_FILE` | `./data/analytics.json` | Path to analytics storage file |
| `CLIENT_BUILD_DIR` | `../client/build` | Path to the React build to serve |
| `JSON_BODY_LIMIT` | `1mb` | Max JSON body size |
| `CONTACT_RATE_LIMIT_WINDOW_MS` | `900000` | Contact form rate-limit window (15 min) |
| `CONTACT_RATE_LIMIT_MAX` | `5` | Max contact submissions per window |
| `ANALYTICS_RATE_LIMIT_WINDOW_MS` | `900000` | Analytics rate-limit window (15 min) |
| `ANALYTICS_RATE_LIMIT_MAX` | `300` | Max analytics events per window |
| `UPLOADS_CACHE_MAX_AGE_SECONDS` | `31536000` | Cache-Control max-age for uploaded media (1 year) |

> Rate limits are skipped in development (`NODE_ENV !== 'production'`).

---

## API Reference

### Public endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/sections` | List all content sections |
| `GET` | `/api/services` | List all services |
| `GET` | `/api/gallery` | List all gallery items |
| `GET` | `/api/settings` | Get site settings (name, phone, email, address, social links) |
| `GET` | `/api/site-media` | Get hero/page media config (videos, images, text) |
| `POST` | `/api/contact` | Submit a contact/booking enquiry |
| `POST` | `/api/analytics/visit` | Record a page visit |
| `POST` | `/csp-report` | Receive CSP violation reports |

#### `POST /api/contact` — Contact/Booking form

```json
{
  "name": "string (required, max 120)",
  "email": "string (required, valid email)",
  "phone": "string (required, 7–15 digits)",
  "eventType": "wedding | reception | engagement | mehendi-sangeet | haldi | book-your-stay | other | ''",
  "eventDate": "YYYY-MM-DD (optional)",
  "guestCount": "integer string (optional, 0–100000)",
  "message": "string (optional, max 3000)",
  "checkIn": "YYYY-MM-DD (required if book-your-stay)",
  "checkOut": "YYYY-MM-DD (required if book-your-stay, must be after checkIn)",
  "adults": "integer string (required if book-your-stay, min 1)",
  "children": "integer string (optional)",
  "stayQuery": "string (optional, max 3000)"
}
```

Rate-limited to **5 requests per 15 minutes** per IP in production.

---

### Admin endpoints

All admin endpoints require a `Bearer <token>` header obtained from `/api/admin/login`.

#### Authentication

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Login — returns a signed token |
| `GET` | `/api/admin/session` | Validate current token |

Login is rate-limited to **10 failed attempts per 15 minutes** per IP.

#### Sections (About/Home content blocks)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/sections` | Create a section (multipart, `image` field required) |
| `PUT` | `/api/sections/:id` | Update a section (multipart, `image` optional) |
| `DELETE` | `/api/sections/:id` | Delete a section and its image |

Section fields: `title`, `description`, `longDescription`, `location`, `eyebrow`, `highlights` (JSON array), `stats` (JSON array of `{label, value}`), `image` (file upload).

#### Services

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/services` | Create a service (multipart, `image` optional) |
| `PUT` | `/api/services/:id` | Update a service |
| `DELETE` | `/api/services/:id` | Delete a service |

Service fields: `title`, `subtitle`, `description`, `image`.

#### Gallery

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/gallery` | Upload a gallery image (`image` field required) |
| `DELETE` | `/api/gallery/:id` | Delete a gallery item and its image |

Gallery fields: `title`, `category`, `image`.

#### Contacts

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/contacts` | List all contact submissions (newest first) |
| `PUT` | `/api/admin/contacts/:id/read` | Mark a contact as read |
| `DELETE` | `/api/admin/contacts/:id` | Delete a contact submission |

#### Settings

| Method | Path | Description |
|---|---|---|
| `PUT` | `/api/settings` | Update site settings |

Settings fields: `siteName`, `phone`, `phoneSecondary`, `email`, `address`, `openingHours`, `social.instagram`, `social.facebook`, `social.youtube`, `social.whatsapp`.

#### Site Media

| Method | Path | Description |
|---|---|---|
| `PUT` | `/api/site-media` | Update hero text and/or media assets (multipart) |

Supported file fields: `heroVideoLandscape`, `heroVideoPortrait`, `eventMainImage`, `eventFloatImage`, `stayMainImage`, `stayFloatImage`, `aboutHeroImage`, `aboutIntroMainImage`, `aboutIntroFloatImage`, `aboutPromiseImage`, `contactHeroImage`.

Text fields: `heroTitle`, `heroTagline`, `heroSubtitle`, `heroComingSoon`.

Video upload limit: **200 MB**. Image upload limit: **25 MB**.

#### Analytics

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/analytics` | Get analytics summary (totals, by-page, by-device, daily 14-day chart, 20 recent visits) |

---

## Admin Panel

The admin panel is available at `/admin`. It is a client-side-only route — no server-side rendering or separate auth layer. Authentication uses the `POST /api/admin/login` endpoint.

Features:
- View and manage contact/booking enquiries
- Upload and manage gallery images
- Edit content sections and services
- Update site settings (contact info, social links)
- Update hero media (videos and images for each page)
- View analytics dashboard (page views, devices, 14-day chart)

---

## Docker Deployment

See [DOCKER.md](DOCKER.md) for full instructions. Quick start:

### 1. Create the environment file

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with production values:

```env
NODE_ENV=production
PORT=5010
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=a-strong-password
ADMIN_SESSION_SECRET=a-long-random-secret
TRUST_PROXY=true
CORS_ALLOWED_ORIGINS=https://your-domain.com
ENABLE_HSTS=false
CONTACTS_DATA_FILE=./private-data/contacts.json
ANALYTICS_DATA_FILE=./private-data/analytics.json
```

### 2. Build and start

```bash
docker compose up -d --build
```

The app runs on port `5010`. Put Nginx or Caddy in front of it for TLS termination.

### 3. Persisted volumes

Three directories are bind-mounted so data survives container rebuilds:

| Host path | Container path | Contains |
|---|---|---|
| `./backend/data` | `/app/backend/data` | Sections, services, gallery, settings, site-media |
| `./backend/uploads` | `/app/backend/uploads` | Uploaded images and videos |
| `./backend/private-data` | `/app/backend/private-data` | Contacts and analytics |

### Build details (Dockerfile)

The build uses two stages:

1. **`client-builder`** — Installs Chromium (required by `react-snap` for static pre-rendering), runs `npm ci` and `npm run build`. This produces pre-rendered HTML for all 6 routes.
2. **`server`** — Installs only production backend dependencies, copies backend source and the client build artifact, starts with `node server.js`.

---

## Data Storage

There is no database. All data is stored as JSON files on disk.

| File | Location | Contents |
|---|---|---|
| `sections.json` | `backend/data/` | Content sections (About/Home blocks) |
| `services.json` | `backend/data/` | Service cards |
| `gallery.json` | `backend/data/` | Gallery image metadata |
| `settings.json` | `backend/data/` | Site settings (name, contact info, socials) |
| `siteMedia.json` | `backend/data/` | Hero/page media paths and text |
| `contacts.json` | `backend/private-data/` | Contact form submissions |
| `analytics.json` | `backend/private-data/` | Page visit logs (capped at 10,000 entries) |

All JSON files are auto-created on first start if they do not exist. IDs are UUIDs.

---

## Security Notes

- **Change all credentials before deploying.** The `.env.example` file contains placeholder values — never use them in production.
- Admin tokens are HMAC-SHA256 signed, expire after 8 hours by default, and are verified with timing-safe comparison.
- Login brute-force protection: 10 failed attempts per IP locks login for 15 minutes.
- Helmet is configured with CSP, `X-Frame-Options: DENY`, `Referrer-Policy`, and `Permissions-Policy`.
- HSTS is auto-enabled in production. Set `ENABLE_HSTS=false` if TLS is terminated upstream (e.g. Cloudflare).
- CORS is restricted to origins listed in `CORS_ALLOWED_ORIGINS` (plus localhost in development).
- Uploaded file paths are validated to prevent path traversal before deletion.
- The `private-data/` directory should not be web-accessible — it is never served as static files.
