// ============================================
// API CONFIGURATION - WORKS ON LOCAL & SERVER
// ============================================

const isDevelopment = process.env.NODE_ENV === 'development';
const configuredBaseUrl = (process.env.REACT_APP_API_BASE_URL || '').trim().replace(/\/+$/, '');
const SERVER_BASE_URL = configuredBaseUrl || (isDevelopment ? 'http://localhost:5010' : '');
const API_URL = SERVER_BASE_URL ? `${SERVER_BASE_URL}/api` : '/api';
const ADMIN_TOKEN_KEY = 'aarna_admin_token';
const requestCache = new Map();
const inFlightRequests = new Map();

let adminAuthToken = '';

if (typeof window !== 'undefined') {
  adminAuthToken = window.sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

const toError = async (response) => {
  let message = `Request failed with status ${response.status}`;

  try {
    const payload = await response.json();
    if (payload?.error) {
      message = payload.error;
    }
  } catch (error) {
    // Ignore JSON parse failures for error payloads.
  }

  const error = new Error(message);
  error.status = response.status;
  error.code = response.status === 401 ? 'UNAUTHORIZED' : response.status === 403 ? 'FORBIDDEN' : 'REQUEST_FAILED';
  return error;
};

const request = async (path, options = {}, { admin = false } = {}) => {
  const headers = new Headers(options.headers || {});

  if (admin && adminAuthToken) {
    headers.set('Authorization', `Bearer ${adminAuthToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await toError(response);

    if (admin && (response.status === 401 || response.status === 403)) {
      clearAdminAuthToken();
    }

    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const readCachedRequest = async (cacheKey, path) => {
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }

  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const pendingRequest = request(path)
    .then((data) => {
      requestCache.set(cacheKey, data);
      inFlightRequests.delete(cacheKey);
      return data;
    })
    .catch((error) => {
      inFlightRequests.delete(cacheKey);
      throw error;
    });

  inFlightRequests.set(cacheKey, pendingRequest);
  return pendingRequest;
};

const invalidateRequestCache = (...cacheKeys) => {
  cacheKeys.forEach((cacheKey) => {
    requestCache.delete(cacheKey);
    inFlightRequests.delete(cacheKey);
  });
};

const LEGACY_PUBLIC_IMAGE_PATHS = new Set([
  'about-hero.jpg',
  'all_services.png',
  'catering.png',
  'contact-hero.png',
  'event_planning.png',
  'first.png',
  'lighting_sound.png',
  'logo.png',
  'logo192.png',
  'logo512.png',
  'luxury_resort_hero_bg_1773044541440.png',
  'our_signature_services.png',
  'ourspace_dining.png',
  'ourspace_grandcelebration_hall.png',
  'ourspace_guest_accommodation_room.png',
  'ourspace_kalyani.png',
  'ourspace_outdoor_lawn.png',
  'ourspace_temple.png',
  'ourspace_wellequiped_kitchen.png',
  'ourspce_well_equiped_kitchen.png',
  'room_booking.png',
  'second.png',
  'venue_arrangement.png',
  'wedding_decor.png',
]);

export const resolveMediaUrl = (path) => {
  if (!path) return path;

  const normalizedInput = String(path).trim().replace(/\\/g, '/');

  if (
    /^https?:\/\//i.test(normalizedInput) ||
    normalizedInput.startsWith('data:') ||
    normalizedInput.startsWith('blob:')
  ) {
    return normalizedInput;
  }

  if (normalizedInput.startsWith('/uploads')) {
    return `${SERVER_BASE_URL}${normalizedInput}`;
  }

  const normalizedPath = normalizedInput.replace(/^\/+/, '');

  if (normalizedPath.startsWith('uploads/')) {
    return `${SERVER_BASE_URL}/${normalizedPath}`;
  }

  if (normalizedPath.startsWith('images/')) {
    return `/${normalizedPath}`;
  }

  if (LEGACY_PUBLIC_IMAGE_PATHS.has(normalizedPath)) {
    return `/images/${normalizedPath}`;
  }

  return normalizedInput;
};

export const setAdminAuthToken = (token) => {
  adminAuthToken = token || '';

  if (typeof window === 'undefined') return;

  if (adminAuthToken) {
    window.sessionStorage.setItem(ADMIN_TOKEN_KEY, adminAuthToken);
  } else {
    window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  }
};

export const clearAdminAuthToken = () => {
  setAdminAuthToken('');
};

export const trackVisit = async (payload) => {
  try {
    await request('/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // Ignore analytics failures so they never block the site.
  }
};

export const loginAdmin = async ({ username, password }) => {
  const payload = await request('/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (payload?.token) {
    setAdminAuthToken(payload.token);
  }

  return payload;
};

export const fetchAdminSession = async () => request('/admin/session', {}, { admin: true });

// ============ SECTIONS API (Home Page) ============
export const fetchSections = async () => readCachedRequest('sections', '/sections');

export const addSection = async (formData) =>
  request('/sections', { method: 'POST', body: formData }, { admin: true }).then((data) => {
    invalidateRequestCache('sections');
    return data;
  });

export const updateSection = async (id, formData) =>
  request(`/sections/${id}`, { method: 'PUT', body: formData }, { admin: true }).then((data) => {
    invalidateRequestCache('sections');
    return data;
  });

export const deleteSection = async (id) =>
  request(`/sections/${id}`, { method: 'DELETE' }, { admin: true }).then((data) => {
    invalidateRequestCache('sections');
    return data;
  });

// ============ SERVICES API (About Page) ============
export const fetchServices = async () => readCachedRequest('services', '/services');

export const addService = async (formData) =>
  request('/services', { method: 'POST', body: formData }, { admin: true }).then((data) => {
    invalidateRequestCache('services');
    return data;
  });

export const deleteService = async (id) =>
  request(`/services/${id}`, { method: 'DELETE' }, { admin: true }).then((data) => {
    invalidateRequestCache('services');
    return data;
  });

export const updateService = async (id, formData) =>
  request(`/services/${id}`, { method: 'PUT', body: formData }, { admin: true }).then((data) => {
    invalidateRequestCache('services');
    return data;
  });

// ============ GALLERY API ============
export const fetchGallery = async () => readCachedRequest('gallery', '/gallery');

export const addGalleryImage = async (formData) =>
  request('/gallery', { method: 'POST', body: formData }, { admin: true }).then((data) => {
    invalidateRequestCache('gallery');
    return data;
  });

export const deleteGalleryImage = async (id) =>
  request(`/gallery/${id}`, { method: 'DELETE' }, { admin: true }).then((data) => {
    invalidateRequestCache('gallery');
    return data;
  });

// ============ CONTACT API ============
export const submitContact = async (data) =>
  request('/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const fetchContacts = async () => request('/admin/contacts', {}, { admin: true });

export const markContactRead = async (id) =>
  request(`/admin/contacts/${id}/read`, { method: 'PUT' }, { admin: true });

export const deleteContact = async (id) =>
  request(`/admin/contacts/${id}`, { method: 'DELETE' }, { admin: true });

// ============ SETTINGS API ============
export const fetchSettings = async () => readCachedRequest('settings', '/settings');

export const updateSettings = async (settings) =>
  request(
    '/settings',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    },
    { admin: true }
  ).then((data) => {
    invalidateRequestCache('settings');
    return data;
  });

// ============ ANALYTICS API ============
export const fetchAnalytics = async () => request('/analytics', {}, { admin: true });

// ============ SITE MEDIA API ============
export const fetchSiteMedia = async () => readCachedRequest('site-media', '/site-media');

export const updateSiteMedia = async (formData) =>
  request('/site-media', { method: 'PUT', body: formData }, { admin: true }).then((data) => {
    invalidateRequestCache('site-media');
    return data;
  });
