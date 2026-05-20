// ============================================
// API CONFIGURATION - WORKS ON LOCAL & SERVER
// ============================================

// Auto-detect environment
const isDevelopment = process.env.NODE_ENV === 'development';
const ORIGIN =
  typeof window !== 'undefined' ? window.location.origin : '';
const SERVER_BASE_URL = isDevelopment ? 'http://localhost:5000' : 'https://backend.aarna.net.in';


// API URL - works everywhere!
const API_URL = `${SERVER_BASE_URL}/api`;

export const resolveMediaUrl = (path) => {
  if (!path) return path;
  return path.startsWith('/uploads') ? `${SERVER_BASE_URL}${path}` : path;
};

export const trackVisit = async (payload) => {
  try {
    await fetch(`${API_URL}/analytics/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (_) {
    // Ignore analytics failures so they never block the site.
  }
};

console.log(`🌐 Environment: ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`);
console.log(`🔗 API URL: ${API_URL}`);

// ============ SECTIONS API (Home Page) ============
export const fetchSections = async () => {
  const res = await fetch(`${API_URL}/sections`);
  return res.json();
};

export const addSection = async (formData) => {
  const res = await fetch(`${API_URL}/sections`, {
    method: 'POST',
    body: formData
  });
  return res.json();
};

export const updateSection = async (id, formData) => {
  const res = await fetch(`${API_URL}/sections/${id}`, {
    method: 'PUT',
    body: formData
  });
  return res.json();
};

export const deleteSection = async (id) => {
  const res = await fetch(`${API_URL}/sections/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

// ============ SERVICES API (About Page) ============
export const fetchServices = async () => {
  const res = await fetch(`${API_URL}/services`);
  return res.json();
};

export const addService = async (formData) => {
  const res = await fetch(`${API_URL}/services`, {
    method: 'POST',
    body: formData
  });
  return res.json();
};

export const deleteService = async (id) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const updateService = async (id, formData) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: 'PUT',
    body: formData
  });
  return res.json();
};

// ============ GALLERY API ============
export const fetchGallery = async () => {
  const res = await fetch(`${API_URL}/gallery`);
  return res.json();
};

export const addGalleryImage = async (formData) => {
  const res = await fetch(`${API_URL}/gallery`, {
    method: 'POST',
    body: formData
  });
  return res.json();
};

export const deleteGalleryImage = async (id) => {
  const res = await fetch(`${API_URL}/gallery/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

// ============ CONTACT API ============
export const submitContact = async (data) => {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const fetchContacts = async () => {
  const res = await fetch(`${API_URL}/admin/contacts`);
  return res.json();
};

export const markContactRead = async (id) => {
  const res = await fetch(`${API_URL}/admin/contacts/${id}/read`, {
    method: 'PUT'
  });
  return res.json();
};

export const deleteContact = async (id) => {
  const res = await fetch(`${API_URL}/admin/contacts/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

// ============ SETTINGS API ============
export const fetchSettings = async () => {
  const res = await fetch(`${API_URL}/settings`);
  return res.json();
};

export const updateSettings = async (settings) => {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  return res.json();
};

// ============ ANALYTICS API ============
export const fetchAnalytics = async () => {
  const res = await fetch(`${API_URL}/analytics`);
  return res.json();
};

// ============ SITE MEDIA API ============
export const fetchSiteMedia = async () => {
  const res = await fetch(`${API_URL}/site-media`);
  return res.json();
};

export const updateSiteMedia = async (formData) => {
  const res = await fetch(`${API_URL}/site-media`, { method: 'PUT', body: formData });
  return res.json();
};
