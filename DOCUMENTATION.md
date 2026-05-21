# AARNA WEBSITE Documentation

## Project Overview

AARNA WEBSITE is a full-stack website project built for a hospitality and events brand. It contains:

- a React frontend in `client/`
- a Node.js + Express backend in `backend/`
- JSON-based content storage in `backend/data/`
- uploaded media storage in `backend/uploads/`
- an admin panel for managing sections, services, gallery items, settings, site media, contacts, and analytics

The project is designed so non-technical users can update much of the website content through the admin panel instead of editing code manually.

## GitHub Repository Details

- Repository name: `aarna`
- GitHub owner: `infompro9-maker`
- Repository URL: `https://github.com/infompro9-maker/aarna`
- Main branch: `main`

This repository is used to store the full project source code, documentation, backend files, frontend files, and project history.

## Tech Stack

### Frontend

- React `19.2.4`
- React Router DOM `7.13.1`
- React Scripts `5.0.1`
- Framer Motion `12.38.0`
- GSAP `3.14.2`
- AOS `2.3.4`
- Lucide React `1.7.0`

### Backend

- Node.js
- Express `4.18.2`
- Multer `1.4.5-lts.1`
- CORS `2.8.5`
- UUID `9.0.0`
- Nodemon `3.0.2` for development

## Main Project Structure

```text
AARNA-WEBISTE/
|-- backend/
|   |-- data/
|   |   |-- analytics.json
|   |   |-- contacts.json
|   |   |-- gallery.json
|   |   |-- sections.json
|   |   |-- services.json
|   |   |-- settings.json
|   |   `-- siteMedia.json
|   |-- uploads/
|   |-- package.json
|   `-- server.js
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- styles/
|   |-- package.json
|   `-- .gitignore
|-- .gitignore
`-- DOCUMENTATION.md
```

## Core Features

- Responsive brand website
- Home page powered by backend section data
- About and contact pages
- Privacy policy and terms pages
- Hash-based routing for frontend navigation
- Floating call-to-action button
- Gallery and services content management
- Contact form submission storage
- Site settings management
- Site media upload and replacement
- Visitor analytics tracking
- Admin panel for content operations

## Frontend Routes

The frontend uses `HashRouter`, so production/admin URLs commonly appear with `#/`.

### Public Routes

- `/`
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms-of-service`

### Admin Route

- `/admin`

Production examples:

- Website: `https://aarna.net.in/#/`
- Admin: `https://aarna.net.in/#/admin`

## Frontend Pages and Main UI Modules

### Pages Present in `client/src/pages/`

- `Home.js`
- `About.js`
- `Contact.js`
- `PrivacyPolicy.js`
- `TermsOfService.js`
- `Gallery.js`
- `Admin/AdminPanel.js`
- `DynamicPage.js`

### Shared Components Present in `client/src/components/`

- `Header.js`
- `Footer.js`
- `ScrollToTop.js`
- `FloatingContact.js`

### Hooks Present in `client/src/hooks/`

- `useGallery.js`
- `useSections.js`
- `useService.js`
- `useSettings.js`

### Important Note About Routing

Some page files exist in the codebase, such as `Gallery.js` and `DynamicPage.js`, but they are not currently wired into the active route list in [client/src/App.js](/d:/AARNA-WEBISTE/AARNA-WEBISTE/client/src/App.js). If those pages are intended to be public, routes still need to be added explicitly.

## Backend API Endpoints

### Sections

- `GET /api/sections`
- `POST /api/sections`
- `PUT /api/sections/:id`
- `DELETE /api/sections/:id`

### Services

- `GET /api/services`
- `POST /api/services`
- `PUT /api/services/:id`
- `DELETE /api/services/:id`

### Gallery

- `GET /api/gallery`
- `POST /api/gallery`
- `DELETE /api/gallery/:id`

### Contact

- `POST /api/contact`
- `GET /api/admin/contacts`
- `PUT /api/admin/contacts/:id/read`
- `DELETE /api/admin/contacts/:id`

### Settings

- `GET /api/settings`
- `PUT /api/settings`

### Analytics

- `POST /api/analytics/visit`
- `GET /api/analytics`

### Site Media

- `GET /api/site-media`
- `PUT /api/site-media`

## Data Files Used by the Backend

All primary site content is stored in JSON files under `backend/data/`.

- `sections.json`: home page sections and section-level content
- `services.json`: about/services entries
- `gallery.json`: gallery item records
- `contacts.json`: contact form submissions
- `settings.json`: shared site details like phone, email, address, social links
- `siteMedia.json`: hero and other major media references
- `analytics.json`: visit tracking data used in the admin dashboard

## Current Settings Data Shape

The current root backend settings file at [backend/data/settings.json](/d:/AARNA-WEBISTE/AARNA-WEBISTE/backend/data/settings.json) currently contains:

- `siteName`
- `phone`
- `email`
- `address`
- `socialLinks`

The frontend fallback hook in [client/src/hooks/useSettings.js](/d:/AARNA-WEBISTE/AARNA-WEBISTE/client/src/hooks/useSettings.js) also expects additional values such as:

- `phoneSecondary`
- `openingHours`
- `social`

Because of that, keeping the backend settings structure and frontend fallback structure aligned will make maintenance easier.

## Admin Panel Capabilities

The admin panel is implemented in [client/src/pages/Admin/AdminPanel.js](/d:/AARNA-WEBISTE/AARNA-WEBISTE/client/src/pages/Admin/AdminPanel.js).

It currently supports:

- analytics viewing with auto-refresh
- create, edit, and delete operations for home sections
- create, edit, and delete operations for services
- create and delete operations for gallery items
- contact list viewing, mark-as-read, and delete
- settings updates
- page media uploads and replacements

## Installation and Setup

### Prerequisites

- Node.js 18+ recommended
- npm

### Backend Setup

```sh
cd backend
npm install
npm run dev
```

Or for normal start:

```sh
cd backend
npm install
npm start
```

### Frontend Setup

```sh
cd client
npm install
npm start
```

## Local Development URLs

### Current Code-Based Defaults

- Frontend dev server: `http://localhost:3000`
- Backend server in `backend/server.js`: `http://localhost:5010`

### Important Note

The current frontend API config in [client/src/services/api.js](/d:/AARNA-WEBISTE/AARNA-WEBISTE/client/src/services/api.js) points to `http://localhost:5000` in development, while the backend currently listens on port `5010`.

Before local development, either:

1. change the backend port to `5000`, or
2. change the frontend API base URL and proxy to `5010`

Files involved:

- [backend/server.js](/d:/AARNA-WEBISTE/AARNA-WEBISTE/backend/server.js)
- [client/package.json](/d:/AARNA-WEBISTE/AARNA-WEBISTE/client/package.json)
- [client/src/services/api.js](/d:/AARNA-WEBISTE/AARNA-WEBISTE/client/src/services/api.js)

## Production API Behavior

In production, the frontend is configured to call:

- `https://backend.aarna.net.in/api`

This is defined in [client/src/services/api.js](/d:/AARNA-WEBISTE/AARNA-WEBISTE/client/src/services/api.js).

## Environment Variables

The frontend currently uses `.env` support and the documentation should preserve the existing development note:

```env
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

Use this only when required for development or proxy/network edge cases.

Do not commit secrets such as API keys, tokens, or private credentials.

## File Upload Behavior

The backend uses Multer for uploads.

- uploaded files are stored in `backend/uploads/`
- files are exposed through `/uploads/...`
- upload limit is currently `200 MB`

This project stores uploaded media in the repository-backed backend directory structure, so production deployments should preserve the `uploads/` folder.

### Site Media Upload Fields

The `PUT /api/site-media` endpoint supports these named upload fields:

- `heroVideoLandscape`
- `heroVideoPortrait`
- `eventMainImage`
- `eventFloatImage`
- `stayMainImage`
- `stayFloatImage`

Text-based media fields are also saved together with those uploads.

## Scripts Reference

### Root-Level Git Workflow

```sh
git status
git add .
git commit -m "Describe your changes"
git push
```

### GitHub Push Workflow for This Project

Use these commands from the project root when you want to push updated work to GitHub:

```sh
git status
git add .
git commit -m "Describe your update"
git push origin main
```

If you want to push only a specific file:

```sh
git add DOCUMENTATION.md
git commit -m "Update documentation"
git push origin main
```

If you want to push only a specific folder:

```sh
git add client/src/
git commit -m "Update frontend files"
git push origin main
```

### First-Time Remote Setup Reference

If the repository remote ever needs to be added again, use:

```sh
git remote add origin https://github.com/infompro9-maker/aarna.git
git branch -M main
git push -u origin main
```

### GitHub Good Practices

- always run `git status` before pushing
- review changed files before `git add .`
- do not push `.env` files or secrets
- use clear commit messages
- push to `main` only after checking that the changes are correct

### Backend Scripts

From `backend/package.json`:

- `npm start` - run backend with Node
- `npm run dev` - run backend with Nodemon

### Frontend Scripts

From `client/package.json`:

- `npm start` - start React development server
- `npm run build` - create production build
- `npm test` - run frontend tests
- `npm run eject` - eject React configuration

## Testing

Frontend testing is configured with React Testing Library.

Run tests with:

```sh
cd client
npm test
```

## Deployment Notes

### Frontend Deployment

Build the frontend first:

```sh
cd client
npm run build
```

Upload the generated `client/build/` output to your web host or static hosting target.

### Backend Deployment

Upload the full `backend/` folder, including:

- `server.js`
- `package.json`
- `package-lock.json`
- `data/`
- `uploads/`

Then install dependencies on the server:

```sh
cd backend
npm install
npm start
```

### Do Not Upload

- `node_modules/`
- local editor files
- temporary caches
- private `.env` secrets

## Troubleshooting

### If the Frontend Loads but API Data Does Not

Check:

- backend server is running
- frontend API base URL matches the backend port
- CORS is enabled on the backend
- `client/src/services/api.js` points to the intended environment

### If Uploaded Images or Videos Do Not Appear

Check:

- files exist in `backend/uploads/`
- backend static file serving for `/uploads` is working
- returned media paths begin with `/uploads/`
- production server keeps the `uploads/` directory between deployments

### If the Admin Panel Opens but Data Is Empty

Check:

- JSON files exist under `backend/data/`
- JSON files are valid and not malformed
- frontend can reach `/api/settings`, `/api/sections`, `/api/services`, `/api/gallery`, and `/api/analytics`

## Known Project Notes

### 1. Hash Routing Is In Use

The app uses `HashRouter`, so links and deployment behavior should account for `#/` paths rather than assuming clean server-side route handling.

### 2. Root `backend/` Is the Active Backend

This repository also contains a `client/backend/` folder, but the actively used backend for this repository is the root-level `backend/` folder.

If `client/backend/` is being kept for reference, archive, or backup purposes, document that clearly in future cleanup work. If not needed, it can be removed later to reduce confusion.

### 3. No Clear Admin Authentication Layer Is Present in Current Frontend Routing

The admin panel route exists and is rendered directly from the frontend route config. If authentication or access control is required, it should be documented and enforced explicitly.

### 4. Current Documentation Scope

This documentation describes the actively wired application behavior found in the current repository. If new pages, routes, authentication, or deployment tooling are added later, this file should be updated together with those changes.

## Recommended Additional Repository Files

- `README.md` at project root for quick-start info
- `LICENSE` if the project is to be shared publicly
- `CONTRIBUTING.md` if multiple developers will work on the repo

## Contact and Maintenance

- Author: Sahana B D
- Role: Backend Developer
- Support email: `sahanabd@mpro9.in`

## Last Updated

- Documentation updated on May 21, 2026
