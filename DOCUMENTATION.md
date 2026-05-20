## Testing

The project uses React Testing Library for frontend tests.

To run tests (from the client directory):
```sh
cd client
npm test
```
This will launch the test runner and execute all tests in the `src/` directory.

## Environment Variables

The client uses a `.env` file for configuration. Example:

```
DANGEROUSLY_DISABLE_HOST_CHECK=true
```
This disables host checking in development (useful for certain proxy setups). For production, review security implications before using this setting.

If you add more environment variables (e.g., API URLs, keys), document them here.

## Scripts Reference

### Client Scripts (in `client/package.json`)
- `npm start` — Start the React development server
- `npm run build` — Build the app for production
- `npm test` — Run tests
- `npm run eject` — Eject configuration (irreversible)

### Backend Scripts (in `backend/package.json`)
- `npm start` — Start the backend server
- `npm run dev` — Start backend with nodemon (auto-restart on changes)

## Animation & Responsiveness Enhancements

For advanced UI/UX and performance optimizations, see the detailed guide in `client/ANIMATION_ENHANCEMENTS.md`.
This document covers GPU acceleration, animation smoothing, mobile responsiveness, and more.

## Recommended Additional Files

- **LICENSE** — Add a LICENSE file (MIT License) to the project root for open-source compliance.
- **README.md** — Add a root README.md with a summary and links to this documentation.
- **CONTRIBUTING.md** — Add a CONTRIBUTING.md file for detailed contribution guidelines.
## How to Access the Admin Panel

1. Start both the backend and frontend servers as described in the Installation & Setup section (for local development).
2. To access the website or admin panel:
  - **Production Website:** Open [https://aarna.net.in](https://aarna.net.in)
  - **Production Admin Panel:** Open [https://aarna.net.in/#/admin](https://aarna.net.in/#/admin)
  - **Local Development:**
    - Website: `http://localhost:3000`
    - Admin Panel: `http://localhost:3000/admin` or `http://localhost:3000/#/admin` (depending on your router setup)
3. If authentication is enabled, log in with your admin credentials (see your implementation for default credentials or user setup).
4. Once logged in, you will see the Admin Panel dashboard.

## Admin Panel Features

The Admin Panel provides a secure dashboard for managing all dynamic content on the website. Features include:

- **Dashboard Overview:** Quick stats and summary of site content.
- **Sections Management:**
  - Add, edit, or delete homepage and other dynamic sections.
- **Gallery Management:**
  - Upload new images/videos to the gallery
  - Edit or remove existing gallery items
- **Services Management:**
  - Add, edit, or delete services offered
- **Site Media Management:**
  - Manage images, videos, and other media used across the site
- **Contact Submissions:**
  - View messages submitted via the contact form
- **Settings Management:**
  - Update site-wide settings (from `settings.json`)
- **Analytics:**
  - View basic analytics data (from `analytics.json`)
- **User Authentication:**
  - (If implemented) Secure login/logout for admin users

All changes made in the Admin Panel are reflected live on the website, as data is updated in the backend JSON files.

## Libraries & Packages Used

### Frontend (client)
- **react**: UI library for building user interfaces
- **react-dom**: DOM bindings for React
- **react-router-dom**: Routing and navigation
- **axios**: HTTP client for API requests
- **classnames**: Utility for conditionally joining classNames
- **Other**: Custom CSS, possible animation libraries (see `client/package.json` for full list)

### Backend (backend)
- **express**: Web server framework
- **cors**: Enable Cross-Origin Resource Sharing
- **body-parser**: Parse incoming request bodies
- **multer**: Handle file uploads
- **fs (Node.js built-in)**: File system operations
- **path (Node.js built-in)**: File path utilities
- **Other**: See `backend/package.json` for all dependencies

## Additional Information

- The project is modular and easy to extend. You can add new pages or features by creating new React components and updating backend JSON files or endpoints as needed.
- All data is stored in JSON files for simplicity, making it easy to back up or migrate content.
- The admin panel is designed for non-technical users to manage site content without editing code.

For any questions, refer to the Contact/Support section or reach out to the project maintainer.
## Deployment: Uploading Files with FileZilla

To deploy your project using FileZilla (or any FTP client), you need to upload the correct build and server files to your web server. Here’s what to upload:

### 1. Frontend (React App)
- First, build the frontend:
  ```sh
  cd client
  npm run build
  ```
- This creates a `build/` folder inside the `client` directory.
- **Upload only the contents of the `client/build/` folder** to your web server’s public HTML directory (often called `public_html`, `www`, or similar).

### 2. Backend (Node.js/Express Server)
- Upload the entire `backend/` folder to your server (outside the public HTML directory, for security).
- Make sure to include:
  - `backend/server.js`
  - `backend/package.json` and `package-lock.json`
  - The entire `backend/data/` folder (all JSON files)
  - The entire `backend/uploads/` folder (all media files)
- After uploading, connect to your server via SSH and run:
  ```sh
  cd backend
  npm install
  node server.js
  ```

### 3. Environment Variables & Configuration
- If your backend uses environment variables (e.g., `.env`), upload that file as well (do not upload `.env.example` or sensitive files to public directories).

### 4. What NOT to Upload
- Do NOT upload `node_modules/` folders (they are re-installed on the server).
- Do NOT upload source files from `client/src/` or `client/public/` (only the `build/` output is needed for frontend).

**Summary Table:**

| Folder/File                | Upload? | Destination                |
|----------------------------|---------|----------------------------|
| client/build/              | Yes     | public_html or www         |
| backend/                   | Yes     | Server app directory       |
| backend/data/              | Yes     | Inside backend/            |
| backend/uploads/           | Yes     | Inside backend/            |
| node_modules/              | No      | (Reinstall on server)      |
| client/src/, client/public/| No      | (Not needed for deploy)    |
| .env (if used)             | Yes     | Inside backend/            |

This ensures your deployed site works correctly and securely.

# Project Documentation: AARNA WEBSITE (Version 1.0)



## Overview (Project Introduction)
AARNA WEBSITE is a full-stack web application designed to provide a seamless user experience for both end-users and administrators. The project consists of a React-based frontend and a Node.js/Express backend, with JSON files used for data storage. The website features dynamic content, an admin panel, and a modern, responsive design.

**This is Version 1.0 of the project.**

This documentation is written to be clear and beginner-friendly, so anyone can understand the project structure and run it easily by following the provided steps. All commands and setup instructions are straightforward, ensuring a smooth experience for new developers or users.

- **Project Start Date:** March 21, 2026
- **Development Completed:** April 20, 2026
- **Final Submission:** May 23, 2026
- **Author:** Sahana B D (Backend Developer)


## Technologies & Versions Used

### Frontend (client)
- **React.js** (18.x)
- **JavaScript** (ES6+)
- **CSS** (custom styles, modular CSS)

### Backend (backend)
- **Node.js** (18.20.8)
- **Express.js** (4.x)
- **JSON** for data storage

### Other Tools
- **NPM** (9.x)
- **Git** (version control)

### Version Details
- Node.js: 18.20.8 (use `nvm use 18.20.8` to switch)
- NPM: 9.x (use `npm -v` to check)
- React: 18.x (see `client/package.json`)
- Express: 4.x (see `backend/package.json`)

## Running Commands

### Backend
```sh
cd backend
npm install
node server.js
```
Backend runs by default on [http://localhost:5000](http://localhost:5000)

### Frontend
```sh
cd client
npm install
npm start
```
Frontend runs by default on [http://localhost:3000](http://localhost:3000)

### Node Version Management
If using nvm (Node Version Manager):
```sh
nvm use 18.20.8
```


## Features
- Responsive and modern UI/UX
- Dynamic content rendering from backend JSON
- **Admin panel** for content management (add/edit/delete sections, gallery, services, site media)
- Gallery, Services, Contact, About, Home, Privacy Policy, Terms of Service, and Dynamic pages
- Floating contact widget for quick user access
- Data-driven sections (services, gallery, analytics, etc.)
- File uploads for media management (images, videos)
- SEO-friendly structure

## Number of Pages & Structure

### Main Pages
1. **Home** (`/`): Dynamic landing page with sections from backend
2. **About** (`/about`): Organization details
3. **Contact** (`/contact`): Contact form and info
4. **Gallery** (`/gallery`): Media gallery with uploads
5. **Services** (`/services`): List of services
6. **Admin Panel** (`/admin`): Content management (protected)
7. **Privacy Policy** (`/privacy-policy`)
8. **Terms of Service** (`/terms-of-service`)
9. **Dynamic Pages**: Rendered based on backend data (e.g., custom sections)

**Total:** 8+ pages (plus any dynamic pages generated from backend data)

### Admin Panel Details
- **Location:** `/admin` (see `src/pages/Admin/AdminPanel.js`)
- **Features:**
  - Login authentication (if implemented)
  - Add/Edit/Delete: Sections, Gallery items, Services, Site Media
  - Upload images/videos to gallery and sections
  - Manage site settings (from `settings.json`)
  - View analytics (from `analytics.json`)
- **Access:** Only authorized users (see implementation for authentication details)
- **UI:** Responsive dashboard with forms, tables, and upload controls

### Data Management
- All content (sections, gallery, services, etc.) is stored in backend JSON files under `backend/data/`
- Media files are stored in `backend/uploads/`

## Folder Structure
```
backend/
  package.json
  server.js
  data/
    analytics.json
    contacts.json
    gallery.json
    sections.json
    services.json
    settings.json
    siteMedia.json
  uploads/

client/
  package.json
  README.md
  public/
    index.html
    ...
  src/
    App.js
    index.js
    components/
      Header.js
      Footer.js
      FloatingContact.js
      ...
    hooks/
      useGallery.js
      useSections.js
      ...
    pages/
      Home.js
      About.js
      Contact.js
      Gallery.js
      Admin/
        AdminPanel.js
    services/
      api.js
    styles/
      variables.css
      ...
```

## Installation & Setup

### Prerequisites
- Node.js (v18.20.8 recommended)
- NPM

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   node server.js
   ```

### Frontend Setup
1. Navigate to the client folder:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm start
   ```

## Usage
- Access the frontend at `http://localhost:3000` (default React port).
- The backend API runs at `http://localhost:5000` (or as configured in server.js).
- Use the admin panel for content management (login details/configuration as per implementation).


## Pages (Detailed)

- **Home:** Landing page with dynamic sections (data-driven)
- **About:** Organization and team information
- **Contact:** Contact form, address, and map
- **Gallery:** Media gallery with upload and filter features
- **Services:** List and details of services offered
- **Admin Panel:** Dashboard for managing all site content
- **Dynamic Pages:** Created from backend data (e.g., new sections)
- **Privacy Policy & Terms of Service:** Legal and compliance information


## API Reference (Key Endpoints)

- **GET /api/sections** — Fetch all sections
- **GET /api/gallery** — Fetch gallery items
- **GET /api/services** — Fetch services data
- **POST /api/contact** — Submit contact form
- **POST /api/upload** — Upload media files
- **GET /api/settings** — Fetch site settings
- **GET /api/analytics** — Fetch analytics data
- *(See backend/server.js for full API details and additional endpoints)*

## Contribution Guidelines
1. Fork the repository and create a new branch for your feature or bugfix.
2. Write clear, concise commit messages.
3. Ensure code follows the existing style and conventions.
4. Test your changes locally before submitting a pull request.
5. Submit a pull request with a detailed description of your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.


## Contact/Support
- **Author:** Sahana B D (Backend Developer)
- For questions or support, please contact: sahanabd@mpro9.in
- Issues and feature requests can be submitted via the project repository's issue tracker.

---
*This documentation was generated on May 20, 2026.*
