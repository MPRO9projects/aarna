# AARNA Website
## Corporate Project Documentation

## 1. Executive Summary

The AARNA Website is a full-stack digital platform developed for a hospitality and wedding destination brand. The solution presents Aarna as a premium venue for weddings, celebrations, and guest stays, while also enabling internal content management through an administrative interface.

The project combines a React-based frontend with a Node.js and Express backend. It supports dynamic content presentation, media management, enquiry capture, visitor analytics, and operational updates without requiring frequent code changes for routine business content.

This document is intended as a formal project submission and provides a business-level and technical overview of the delivered solution, its architecture, key capabilities, deployment model, current limitations, and recommendations for future enhancement.

## 2. Project Objective

The primary objective of this project is to provide Aarna with:

- a professional digital presence aligned with its premium brand positioning
- a responsive website for prospective customers across desktop and mobile devices
- a structured enquiry flow for weddings, events, and stays
- an internal content management capability through an admin panel
- a maintainable architecture for future content and feature expansion

## 3. Business Scope

The implemented website supports the following business functions:

- present Aarna as a wedding destination and hospitality brand
- showcase venue identity, service offerings, and brand storytelling
- allow visitors to contact the business and submit enquiries
- support internal administrators in updating major website content
- store and organize media assets used across the site
- capture visitor activity for basic analytics and reporting

## 4. Solution Overview

The delivered application is a full-stack website consisting of:

- a frontend web application built in React
- a backend API built with Node.js and Express
- JSON-based file storage for content and administrative records
- file-based media upload handling for site imagery and video references

The solution is designed to reduce dependency on direct source-code edits for regular content updates. Administrative users can manage sections, services, gallery items, settings, and media through the admin interface.

## 5. Technology Stack

### Frontend

- React `19.2.4`
- React DOM `19.2.4`
- React Router DOM `7.13.2`
- React Scripts `5.0.1`
- Framer Motion `12.38.0`
- GSAP `3.14.2`
- AOS `2.3.4`
- Lucide React `1.7.0`
- ColorThief `3.3.1`
- Web Vitals `2.1.4`
- React Testing Library DOM `10.4.1`
- React Testing Library Jest DOM `6.9.1`
- React Testing Library React `16.3.2`
- React Testing Library User Event `13.5.0`

### Backend

- Node.js `18.20.8`
- Express `4.22.1`
- CORS `2.8.6`
- Multer `1.4.5-lts.2`
- UUID `9.0.1`
- Nodemon `3.1.14` for development

### Data and Storage

- JSON file storage under `backend/data/`
- uploaded media storage under `backend/uploads/`

## 6. Application Architecture

The application follows a simple client-server architecture:

1. The React frontend renders public-facing pages and the admin interface.
2. The frontend consumes backend APIs for sections, services, settings, gallery, contact records, analytics, and site media.
3. The Express backend handles API requests, file uploads, and JSON-based persistence.
4. Uploaded media files are stored in the backend uploads directory and served through static file routing.

### Architectural Characteristics

- lightweight full-stack implementation
- no relational or document database dependency
- suitable for low-to-moderate administrative data volume
- easy to deploy in environments where file-based storage is acceptable

## 7. Project Structure

```text
AARNA-WEBISTE/
|-- .gitignore
|-- DOCUMENTATION.md
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
|   |   `-- uploaded media assets used by the live/admin-managed website
|   |-- package-lock.json
|   |-- package.json
|   `-- server.js
|-- client/
|   |-- ANIMATION_ENHANCEMENTS.md
|   |-- README.md
|   |-- backend/
|   |   |-- data/
|   |   |   |-- analytics.json
|   |   |   |-- master.json
|   |   |   `-- siteMedia.json
|   |   |-- node_modules/
|   |   |   `-- local dependency folder for the legacy nested backend
|   |   |-- package-lock.json
|   |   |-- package.json
|   |   `-- server.js
|   |-- package-lock.json
|   |-- package.json
|   |-- public/
|   |   |-- about-hero.jpg
|   |   |-- all_services.png
|   |   |-- catering.png
|   |   |-- contact.png
|   |   |-- event_planning.png
|   |   |-- first.png
|   |   |-- index.html
|   |   |-- lighting_sound.png
|   |   |-- logo.png
|   |   |-- logo192.png
|   |   |-- logo512.png
|   |   |-- luxury_resort_hero_bg_1773044541440.png
|   |   |-- manifest.json
|   |   |-- our_signature_services.png
|   |   |-- ourspace_dining.png
|   |   |-- ourspace_grandcelebration_hall.png
|   |   |-- ourspace_guest_accommodation_room.png
|   |   |-- ourspace_kalyani.png
|   |   |-- ourspace_outdoor_lawn.png
|   |   |-- ourspace_temple.png
|   |   |-- ourspace_wellequiped_kitchen.png
|   |   |-- ourspce_well_equiped_kitchen.png
|   |   |-- robots.txt
|   |   |-- room_booking.png
|   |   |-- second.png
|   |   |-- site.webmanifest
|   |   |-- sitemap.xml
|   |   |-- venue_arrangement.png
|   |   `-- wedding_decor.png
|   |-- src/
|   |   |-- App.css
|   |   |-- App.js
|   |   |-- App.test.js
|   |   |-- index.css
|   |   |-- index.js
|   |   |-- logo.svg
|   |   |-- reportWebVitals.js
|   |   |-- setupTests.js
|   |   |-- Assets/
|   |   |   |-- fonts/
|   |   |   |   `-- Samarkan.ttf
|   |   |   `-- video/
|   |   |       |-- landscape.mp4
|   |   |       |-- logo animation.mp4
|   |   |       `-- portrait.mp4
|   |   |-- components/
|   |   |   |-- FloatingContact.css
|   |   |   |-- FloatingContact.js
|   |   |   |-- Footer.css
|   |   |   |-- Footer.js
|   |   |   |-- Header.css
|   |   |   |-- Header.js
|   |   |   `-- ScrollToTop.js
|   |   |-- hooks/
|   |   |   |-- useGallery.js
|   |   |   |-- usePageSeo.js
|   |   |   |-- useSections.js
|   |   |   |-- useService.js
|   |   |   `-- useSettings.js
|   |   |-- pages/
|   |   |   |-- About.js
|   |   |   |-- Contact.js
|   |   |   |-- DynamicPage.js
|   |   |   |-- Gallery.js
|   |   |   |-- Home.js
|   |   |   |-- PrivacyPolicy.js
|   |   |   |-- TermsOfService.js
|   |   |   `-- Admin/
|   |   |       |-- AdminPanel.css
|   |   |       `-- AdminPanel.js
|   |   |-- services/
|   |   |   `-- api.js
|   |   |-- styles/
|   |   |   |-- About.css
|   |   |   |-- Contact.css
|   |   |   |-- DynamicPage.css
|   |   |   |-- Gallery.css
|   |   |   |-- Home.css
|   |   |   |-- PrivacyTerms.css
|   |   |   `-- variables.css
|   |   `-- utils/
|   |       `-- mediaOptimization.js
```

Note:

- The structure above reflects the current repository contents relevant to application behavior and maintenance.
- Dependency folders such as root/frontend `node_modules` are intentionally not expanded in this document because they are generated installation artifacts rather than authored project source.
- The `client/backend/` directory exists as a secondary or legacy backend structure inside the frontend workspace and should be treated separately from the active root-level `backend/`.

## 8. Delivered Functional Modules

### 8.1 Public Website

The public website currently includes:

- Home page
- About page
- Contact page
- Privacy Policy page
- Terms of Service page

The website uses `HashRouter`, so production routes use the `#/` pattern.

### 8.2 Brand and Experience Presentation

The public-facing experience includes:

- animated hero and content presentation
- visually rich storytelling sections
- responsive layouts
- floating call-to-action support
- premium wedding and hospitality brand positioning

### 8.3 Enquiry and Contact Management

The Contact page supports structured enquiry capture. Submitted records are stored by the backend and are retrievable through admin endpoints.

The current backend supports:

- `POST /api/contact`
- `GET /api/admin/contacts`
- `PUT /api/admin/contacts/:id/read`
- `DELETE /api/admin/contacts/:id`

### 8.4 Content Administration

The admin panel supports management of:

- sections
- services
- gallery items
- contact submissions
- settings
- site media
- analytics data visibility

### 8.5 Media Management

The system supports upload and replacement of major site media assets, including hero and page-specific images.

### 8.6 Analytics

The backend records page visits and returns summary analytics for reporting purposes, including:

- total visits
- recent visits
- page-level visit counts
- device distribution
- daily trend data

## 9. Frontend Routing

### Public Routes

- `/`
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms-of-service`

### Admin Route

- `/admin`

### Production Route Examples

- Website: `https://aarna.net.in/#/`
- Admin: `https://aarna.net.in/#/admin`

## 10. Backend API Coverage

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

## 11. Data Storage Model

The backend stores application data in JSON files located in `backend/data/`.

Primary files include:

- `sections.json`
- `services.json`
- `gallery.json`
- `contacts.json`
- `settings.json`
- `siteMedia.json`
- `analytics.json`

This design simplifies deployment and maintenance for small-scale administrative workloads, but it should be treated as a lightweight content store rather than an enterprise-grade database solution.

## 12. Settings and Media Notes

The current settings model in the backend is smaller than the fallback model expected by the frontend. The frontend hook merges API data with defaults, which keeps the site functional, but long-term maintainability would improve if both structures were standardized.

The backend also supports named media upload fields for key pages, including:

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

## 13. Environment and Runtime Configuration

### Local Development

Verified current local development configuration:

- Node.js runtime: `18.20.8`
- frontend development server: `http://localhost:3000`
- backend server port: `5010`
- frontend proxy: `http://localhost:5010`
- frontend development API base: `http://localhost:5010`

### Production API Behavior

The frontend is configured to call the production backend at:

- `https://backend.aarna.net.in/api`

## 14. Deployment Model

### Frontend

The frontend is built using:

```sh
cd client
npm run build
```

The generated `client/build/` output is intended for deployment to a static hosting or web hosting environment.

### Backend

The backend requires deployment of:

- `server.js`
- `package.json`
- `package-lock.json`
- `data/`
- `uploads/`

Backend start commands:

```sh
cd backend
npm install
npm start
```

### Production Consideration

Because uploads are stored in `backend/uploads/`, production deployment must preserve that directory and its contents across releases.

## 15. Security and Governance Notes

The current implementation is functionally effective, but the following security and governance observations are important:

- the admin route is exposed from frontend routing without a clear authentication layer
- backend data is stored in editable JSON files rather than a secured database-backed admin system
- uploads are file-based and therefore require operational controls on hosting infrastructure
- no explicit role-based access control is currently documented

These points should be treated as project limitations and potential next-phase improvements rather than defects in the current scope.

## 16. Limitations and Current Risks

### 16.1 Admin Access Control

The current frontend route configuration renders the admin panel directly through `/admin`. If controlled access is required, authentication and authorization should be added.

### 16.2 File-Based Data Persistence

The system currently uses JSON files instead of a database. This is suitable for lightweight administration, but it may become difficult to manage under heavier concurrent usage.

### 16.3 Media Persistence

Uploaded files depend on server-side file retention. Environments with ephemeral storage or container rebuilds require careful upload persistence planning.

### 16.4 Route Scope

Some codebase pages exist but are not currently wired into the active route list. For example, `Gallery.js` and `DynamicPage.js` exist in the repository, but are not currently active public routes in [App.js](D:\AARNA-WEBISTE\AARNA-WEBISTE\client\src\App.js:1).

### 16.5 Duplicate/Legacy Structure

The repository includes a `client/backend/` directory in addition to the active root-level `backend/`. This may create confusion for maintenance and should be reviewed in future cleanup work.

## 17. Quality and Maintainability Observations

The project demonstrates several strong maintainability qualities:

- modular page and component structure
- clear frontend/backend separation
- reusable hooks for settings and data retrieval
- centralized API service layer
- admin-driven content operations

At the same time, the following improvements would strengthen enterprise readiness:

- add authentication for admin access
- align backend and frontend settings schema
- replace JSON storage with a database-backed content model
- formalize environment variable handling
- add clearer production operational documentation

## 18. Testing and Verification

Frontend testing support is configured with React Testing Library.

Run tests with:

```sh
cd client
npm test
```

Production builds can be created with:

```sh
cd client
npm run build
```

## 19. Recommendations for Next Phase

Recommended enhancements for a future project phase:

- implement admin authentication and session protection
- migrate JSON content storage to a database
- formalize upload/media management for production durability
- expand public route coverage if Gallery or Dynamic Page features are intended to be live
- add structured error logging and operational monitoring
- prepare a root `README.md` for quick-start onboarding

## 20. Conclusion

The AARNA Website project delivers a working full-stack brand website with administrative content management, enquiry handling, analytics support, and a visually rich public-facing experience aligned to a premium wedding destination brand.

From a delivery perspective, the project successfully meets the core objectives of:

- digital brand presentation
- enquiry capture
- internal update flexibility
- maintainable content operations

While there are areas for improvement in authentication, persistence strategy, and operational hardening, the current implementation provides a strong functional foundation for business use and future expansion.

## 21. Project Ownership

- Project: AARNA Website
- Repository: `https://github.com/infompro9-maker/aarna`
- Primary branch: `main`
- Author: Sahana B D
- Role: Backend Developer
- Support email: `sahanabd@mpro9.in`

## 22. Document Control

- Document type: Corporate Project Documentation
- Last updated: May 22, 2026
