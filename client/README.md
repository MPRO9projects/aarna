# AARNA Frontend

## Overview

This folder contains the React frontend for the AARNA WEBSITE project.

It is responsible for:

- rendering the public website
- handling page navigation
- showing the admin panel UI
- calling backend APIs for sections, services, gallery, settings, contacts, analytics, and site media
- displaying animations, branded visuals, and responsive layouts

## Tech Stack

- React `19.2.4`
- React DOM `19.2.4`
- React Router DOM `7.13.1`
- React Scripts `5.0.1`
- Framer Motion `12.38.0`
- GSAP `3.14.2`
- AOS `2.3.4`
- Lucide React `1.7.0`
- ColorThief `3.3.1`
- Web Vitals `2.1.4`

## Available Routes

The frontend uses `HashRouter`, so deployed URLs commonly use `#/`.

### Public Routes

- `/`
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms-of-service`

### Admin Route

- `/admin`

Production examples:

- `https://aarna.net.in/#/`
- `https://aarna.net.in/#/admin`

## Project Structure

```text
client/
|-- public/
|-- src/
|   |-- Assets/
|   |   |-- fonts/
|   |   `-- video/
|   |-- components/
|   |-- hooks/
|   |-- pages/
|   |   `-- Admin/
|   |-- services/
|   `-- styles/
|-- package.json
|-- package-lock.json
`-- README.md
```

## Key Frontend Files

- `src/App.js` - main app routing and shared layout handling
- `src/components/` - reusable UI elements like header, footer, and helpers
- `src/pages/` - main page screens
- `src/pages/Admin/AdminPanel.js` - admin dashboard UI
- `src/hooks/` - frontend data and settings hooks
- `src/services/api.js` - backend API communication layer
- `src/styles/` - page and shared styles

## Installation

From the `client` folder:

```sh
npm install
```

## Run in Development

From the `client` folder:

```sh
npm start
```

This starts the frontend on:

- `http://localhost:3000`

## Build for Production

```sh
npm run build
```

This creates the production output in:

- `client/build/`

## Run Tests

```sh
npm test
```

## Available Scripts

- `npm start` - starts the React development server using `react-scripts start --no-cache`
- `npm run build` - creates a production build
- `npm test` - runs the frontend test runner
- `npm run eject` - ejects the React configuration

## Backend Connection

The frontend communicates with the backend API through:

- local development proxy in `client/package.json`
- API helper functions in `src/services/api.js`

### Current Local Development Note

The frontend currently expects backend requests to go to:

- `http://localhost:5000`

But the root backend server file currently runs on:

- `http://localhost:5010`

Because of that, local development may require one of these fixes:

1. change the backend port to `5000`, or
2. update the frontend proxy and API base URL to `5010`

## Production API

In production, the frontend is configured to use:

- `https://backend.aarna.net.in/api`

## Main Frontend Features

- branded landing page experience
- animated UI sections
- responsive layouts
- contact page
- about page
- privacy policy page
- terms of service page
- admin panel UI
- analytics display in admin
- gallery, services, settings, contacts, and media management through the admin interface

## Libraries Used and Purpose

- React
  Used to build reusable UI components and page layouts.
- React Router DOM
  Used for frontend navigation and route management.
- Framer Motion
  Used for page transitions and motion effects.
- GSAP
  Used for more advanced animation control.
- AOS
  Used for scroll-triggered animation behavior.
- Lucide React
  Used for icons in the frontend UI.
- ColorThief
  Used where image-based color extraction is needed.
- Web Vitals
  Used for frontend performance reporting support.

## Testing Support

The frontend includes Testing Library packages for component testing:

- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `@testing-library/dom`

## Important Notes

- This frontend uses `HashRouter`, not `BrowserRouter`.
- The admin route currently exists in the frontend route config.
- Some page files exist in the codebase without active route wiring and may require future integration if they are meant to be public.
- The frontend depends on backend JSON-driven content and media responses.

## Related Project Files

- Main project documentation: [DOCUMENTATION.md](../DOCUMENTATION.md)
- Root backend: `../backend/`

## GitHub Repository

- Repository: `https://github.com/infompro9-maker/aarna`
- Branch: `main`

## Last Updated

- Frontend README updated on May 21, 2026
