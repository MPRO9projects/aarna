import React from 'react';
import ReactDOM from 'react-dom/client';

import './styles/variables.css';
import './index.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ============================================
// SERVICE WORKER DISABLED - Prevents caching issues
// ============================================
// Service worker removed to ensure fresh content on every visit
// Your website works perfectly without caching
// ============================================