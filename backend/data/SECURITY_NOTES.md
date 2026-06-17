Security handling notes for this project:

- Never commit a real `backend/.env` file. Keep only `backend/.env.example` in source control.
- Real admin credentials must be stored only in the live/server `backend/.env`.
- Rotate `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` immediately if they were ever committed, shared, or uploaded insecurely.

Private data storage:

- Contact enquiries should be stored outside tracked source files by setting:
  - `CONTACTS_DATA_FILE=./private-data/contacts.json`
- Analytics/visitor logs should be stored outside tracked source files by setting:
  - `ANALYTICS_DATA_FILE=./private-data/analytics.json`
- The `backend/private-data/` directory is ignored by Git and is intended for local or server-private runtime data.
- The committed `backend/data/contacts.json` and `backend/data/analytics.json` files should remain sanitized placeholders only.

Production environment variables required:

- `NODE_ENV`
- `PORT`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `ADMIN_TOKEN_TTL_MS`
- `TRUST_PROXY` (set to `1` when production runs behind a reverse proxy / hosting proxy)
- `CORS_ALLOWED_ORIGINS`
- `CONTACTS_DATA_FILE`
- `ANALYTICS_DATA_FILE`
- `ENABLE_HSTS`
- `UPLOADS_CACHE_MAX_AGE_SECONDS`
- `CONTACT_RATE_LIMIT_WINDOW_MS`
- `CONTACT_RATE_LIMIT_MAX`
- `ANALYTICS_RATE_LIMIT_WINDOW_MS`
- `ANALYTICS_RATE_LIMIT_MAX`

Recommended credential rotation steps:

1. Generate a new strong `ADMIN_PASSWORD` using a password manager.
2. Generate a long random `ADMIN_SESSION_SECRET` of at least 32 characters.
3. Update the live/server `backend/.env`.
4. Restart the backend service.
5. Verify admin login and protected API access.

Data migration notes:

- Before sanitizing tracked JSON files, archive existing real contact and analytics data into `backend/private-data/` or another private server-only path.
- If this repository was previously pushed with real secrets or PII, clean Git history separately after confirming backups exist.

Backend security middleware notes:

- `helmet` is enabled with conservative defaults suitable for this project.
- `Content-Security-Policy` is intentionally disabled in this phase to avoid breaking the existing React app, CDN assets, uploads, videos, and third-party resources. Add CSP in a later dedicated phase after compatibility testing.
- `Cross-Origin-Resource-Policy` is set to `cross-origin` so uploaded images/videos and current frontend assets remain compatible.
- `Referrer-Policy` is set to `strict-origin-when-cross-origin`.
- `X-Powered-By` is disabled.
- HSTS is environment-controlled through `ENABLE_HSTS`. Only enable it when production HTTPS is fully confirmed.
- Text/JSON responses are compressed when the server has the `compression` package installed. Images and videos are intentionally not recompressed by the backend.
- Uploaded media is served with long-lived cache headers because admin-managed replacements use unique filenames under `/uploads/`.

Public API abuse controls:

- `/api/contact` is rate limited with env-configurable limits to reduce spam.
- `/api/analytics/visit` is rate limited with env-configurable limits to reduce abuse.
- Public endpoint rate limiting is skipped outside production so local development remains smooth.
- Admin login keeps its existing dedicated in-memory login throttling.

Production deployment notes:

- Production should run with `NODE_ENV=production` so public rate limiting is active.
- Set `TRUST_PROXY=1` if the backend is deployed behind a reverse proxy, load balancer, or hosting platform proxy so rate limits and request IP detection work correctly.
- Only set `ENABLE_HSTS=true` after HTTPS is fully working on the live domain.
- Keep `CONTACTS_DATA_FILE` and `ANALYTICS_DATA_FILE` pointed at private server paths outside tracked source control.
- After dependency changes, run `npm install` inside `backend/` so `package-lock.json` and installed modules stay in sync.

Recommended production verification:

1. Start backend with the production `.env`.
2. Confirm admin login succeeds and protected APIs return `401` without a token.
3. Submit a normal contact form request and verify it is stored in the configured private contacts path.
4. Trigger repeated contact requests and confirm rate limiting returns HTTP `429`.
5. Trigger repeated analytics requests and confirm rate limiting returns HTTP `429`.
6. Confirm `/uploads/...` responses include cache headers and media still renders normally.
7. Confirm HTTPS works before enabling HSTS.
