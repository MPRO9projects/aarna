const crypto = require('crypto');
const compression = require('compression');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const ENV_FILE_PATH = path.join(__dirname, '.env');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const envContent = fs.readFileSync(filePath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) return;

    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
}

loadEnvFile(ENV_FILE_PATH);

const app = express();
app.disable('x-powered-by');
const PORT = Number(process.env.PORT || 5010);
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const JSON_BODY_LIMIT = process.env.JSON_BODY_LIMIT || '1mb';
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || '').trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || '';
const ADMIN_TOKEN_TTL_MS = Math.max(
  Number(process.env.ADMIN_TOKEN_TTL_MS || 8 * 60 * 60 * 1000),
  5 * 60 * 1000
);
const NODE_ENV = (process.env.NODE_ENV || 'development').trim().toLowerCase();
const ENABLE_HSTS = String(process.env.ENABLE_HSTS || '').toLowerCase() === 'true';
const TRUST_PROXY = (process.env.TRUST_PROXY || '').trim();
const CONTACT_RATE_LIMIT_WINDOW_MS = Math.max(
  Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  60 * 1000
);
const CONTACT_RATE_LIMIT_MAX = Math.max(
  Number(process.env.CONTACT_RATE_LIMIT_MAX || 5),
  1
);
const ANALYTICS_RATE_LIMIT_WINDOW_MS = Math.max(
  Number(process.env.ANALYTICS_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  60 * 1000
);
const ANALYTICS_RATE_LIMIT_MAX = Math.max(
  Number(process.env.ANALYTICS_RATE_LIMIT_MAX || 300),
  1
);
const UPLOADS_CACHE_MAX_AGE_SECONDS = Math.max(
  Number(process.env.UPLOADS_CACHE_MAX_AGE_SECONDS || 31536000),
  3600
);
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;
const TOKEN_CLOCK_SKEW_MS = 15 * 1000;

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const CONTACTS_FILE = process.env.CONTACTS_DATA_FILE
  ? path.resolve(__dirname, process.env.CONTACTS_DATA_FILE)
  : path.join(DATA_DIR, 'contacts.json');
const ANALYTICS_FILE = process.env.ANALYTICS_DATA_FILE
  ? path.resolve(__dirname, process.env.ANALYTICS_DATA_FILE)
  : path.join(DATA_DIR, 'analytics.json');
const hasConfiguredAdminCredentials = Boolean(
  ADMIN_USERNAME && ADMIN_PASSWORD && ADMIN_SESSION_SECRET
);

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
]);

const DEV_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];

const PROD_DEFAULT_ORIGINS = [
  'https://aarna.net.in',
  'https://www.aarna.net.in',
];

const envOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...(NODE_ENV !== 'production' ? DEV_ORIGINS : []),
  ...(NODE_ENV === 'production' ? PROD_DEFAULT_ORIGINS : []),
  ...envOrigins,
]);

if (TRUST_PROXY) {
  app.set('trust proxy', TRUST_PROXY === 'true' ? 1 : TRUST_PROXY);
}

const isProduction = NODE_ENV === 'production';

const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    // CRA runtime and inline JSON-LD schema require unsafe-inline;
    // remove once migrated off CRA or nonces are introduced.
    "'unsafe-inline'",
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com',
    'https://cdnjs.cloudflare.com',
  ],
  fontSrc: [
    "'self'",
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com',
  ],
  imgSrc: ["'self'", 'data:', 'blob:'],
  mediaSrc: ["'self'", 'blob:'],
  frameSrc: ['https://www.google.com'],
  connectSrc: ["'self'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  reportUri: ['/csp-report'],
};

if (isProduction) {
  cspDirectives.upgradeInsecureRequests = [];
}

app.use(
  helmet({
    contentSecurityPolicy: { directives: cspDirectives },
    frameguard: { action: 'deny' },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: (ENABLE_HSTS || isProduction)
      ? {
          maxAge: 63072000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()'
  );
  next();
});
app.use(
  compression({
    threshold: 1024,
    filter(req, res) {
      const contentTypeHeader = res.getHeader('Content-Type');
      const contentType = Array.isArray(contentTypeHeader)
        ? contentTypeHeader.join(';')
        : String(contentTypeHeader || '');

      if (/^(image|video)\//i.test(contentType)) {
        return false;
      }

      return compression.filter(req, res);
    },
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);
app.use(express.json({ limit: JSON_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: JSON_BODY_LIMIT }));
app.use(
  '/uploads',
  express.static(UPLOADS_DIR, {
    etag: true,
    immutable: true,
    lastModified: true,
    maxAge: `${UPLOADS_CACHE_MAX_AGE_SECONDS}s`,
    setHeaders(res, filePath) {
      const ext = path.extname(filePath).toLowerCase();
      const isMediaAsset = [
        '.jpg',
        '.jpeg',
        '.png',
        '.webp',
        '.gif',
        '.mp4',
        '.webm',
        '.ogg',
        '.mov',
      ].includes(ext);

      res.setHeader(
        'Cache-Control',
        isMediaAsset
          ? `public, max-age=${UPLOADS_CACHE_MAX_AGE_SECONDS}, immutable`
          : 'public, max-age=3600'
      );
    },
  })
);

const createPublicRateLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => NODE_ENV !== 'production',
    handler: (req, res) => {
      res.status(429).json({ error: message });
    },
  });

const contactRateLimiter = createPublicRateLimiter({
  windowMs: CONTACT_RATE_LIMIT_WINDOW_MS,
  max: CONTACT_RATE_LIMIT_MAX,
  message: 'Too many contact requests. Please wait a few minutes and try again.',
});

const analyticsRateLimiter = createPublicRateLimiter({
  windowMs: ANALYTICS_RATE_LIMIT_WINDOW_MS,
  max: ANALYTICS_RATE_LIMIT_MAX,
  message: 'Too many analytics requests. Please try again later.',
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});

const imageUpload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
      return;
    }

    cb(null, true);
  },
});

const mediaUpload = multer({
  storage,
  limits: { fileSize: MAX_VIDEO_BYTES, files: 11 },
  fileFilter: (req, file, cb) => {
    const videoFieldNames = new Set(['heroVideoLandscape', 'heroVideoPortrait']);
    const isVideoField = videoFieldNames.has(file.fieldname);
    const allowedSet = isVideoField ? VIDEO_MIME_TYPES : IMAGE_MIME_TYPES;

    if (!allowedSet.has(file.mimetype)) {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
      return;
    }

    cb(null, true);
  },
});

const dataPath = (file) => path.join(DATA_DIR, file);

const resolveDataFilePath = (file) => {
  if (file === 'contacts.json') return CONTACTS_FILE;
  if (file === 'analytics.json') return ANALYTICS_FILE;
  return dataPath(file);
};

const ensureJsonDataFile = (file, fallbackValue = []) => {
  const resolvedPath = resolveDataFilePath(file);
  if (fs.existsSync(resolvedPath)) return;

  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
  fs.writeFileSync(resolvedPath, JSON.stringify(fallbackValue, null, 2));
};

const readData = (file) => {
  const resolvedPath = resolveDataFilePath(file);

  if (!fs.existsSync(resolvedPath)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));
};

const writeData = (file, data) => {
  const resolvedPath = resolveDataFilePath(file);
  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
  fs.writeFileSync(resolvedPath, JSON.stringify(data, null, 2));
};

ensureJsonDataFile('contacts.json');
ensureJsonDataFile('analytics.json');
ensureJsonDataFile('sections.json');
ensureJsonDataFile('services.json');
ensureJsonDataFile('gallery.json');
ensureJsonDataFile('settings.json');
ensureJsonDataFile('siteMedia.json');

if (!hasConfiguredAdminCredentials) {
  console.warn(
    '[security] Admin credentials are not fully configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET in backend/.env before using admin features.'
  );
}

const deleteUpload = (assetPath) => {
  if (typeof assetPath !== 'string' || !assetPath.startsWith('/uploads/')) {
    return;
  }

  const relativeUploadPath = assetPath.replace(/^\/+/, '');
  const fullPath = path.resolve(__dirname, relativeUploadPath);
  const uploadsRoot = path.resolve(UPLOADS_DIR);

  if (!fullPath.startsWith(`${uploadsRoot}${path.sep}`)) {
    return;
  }

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

const safeCompare = (left, right) => {
  const leftBuffer = Buffer.from(String(left || ''), 'utf8');
  const rightBuffer = Buffer.from(String(right || ''), 'utf8');

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const signTokenValue = (value) =>
  crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(value).digest('base64url');

const createAdminToken = () => {
  const payload = {
    role: 'admin',
    sub: ADMIN_USERNAME,
    exp: Date.now() + ADMIN_TOKEN_TTL_MS,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = signTokenValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
};

const verifyAdminToken = (token) => {
  if (!ADMIN_SESSION_SECRET) return null;
  if (typeof token !== 'string') return null;

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signTokenValue(encodedPayload);
  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.role !== 'admin' || payload.sub !== ADMIN_USERNAME) {
      return null;
    }

    if (typeof payload.exp !== 'number' || payload.exp < Date.now() - TOKEN_CLOCK_SKEW_MS) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
};

const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  const payload = verifyAdminToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired admin session.' });
    return;
  }

  req.admin = payload;
  next();
};

const requireConfiguredAdmin = (req, res, next) => {
  if (!hasConfiguredAdminCredentials) {
    res.status(503).json({
      error: 'Admin authentication is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET.',
    });
    return;
  }

  next();
};

const noStore = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
};

const cleanText = (value, { max = 4000, allowEmpty = true } = {}) => {
  if (value === undefined || value === null) {
    return allowEmpty ? '' : null;
  }

  const normalized = String(value)
    .replace(/\u0000/g, '')
    .replace(/\r\n/g, '\n')
    .trim();

  if (!allowEmpty && !normalized) {
    return null;
  }

  if (normalized.length > max) {
    return null;
  }

  return normalized;
};

const validateOptionalUrl = (value) => {
  const text = cleanText(value, { max: 2048 });
  if (!text) return '';

  try {
    const parsed = new URL(text);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol) ? text : null;
  } catch (error) {
    return null;
  }
};

const validateEmail = (value, { required = false } = {}) => {
  const text = cleanText(value, { max: 320, allowEmpty: !required });
  if (text === '') return '';
  if (!text) return null;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) ? text : null;
};

const validatePhone = (value, { required = false } = {}) => {
  const text = cleanText(value, { max: 30, allowEmpty: !required });
  if (text === '') return '';
  if (!text) return null;

  const digits = text.replace(/[^\d+]/g, '');
  return /^\+?[0-9]{7,15}$/.test(digits) ? text : null;
};

const validateIntegerString = (value, { min = 0, max = 100000, required = false } = {}) => {
  const text = cleanText(value, { max: 10, allowEmpty: !required });
  if (text === '') return '';
  if (!text) return null;
  if (!/^\d+$/.test(text)) return null;

  const numericValue = Number(text);
  if (numericValue < min || numericValue > max) {
    return null;
  }

  return String(numericValue);
};

const validateDateString = (value, { required = false } = {}) => {
  const text = cleanText(value, { max: 10, allowEmpty: !required });
  if (text === '') return '';
  if (!text) return null;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return null;
  }

  const date = new Date(`${text}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : text;
};

const parseArrayField = (value, { maxItems = 12, maxItemLength = 180 } = {}) => {
  if (!value) return [];

  let parsedItems;
  try {
    parsedItems = JSON.parse(value);
  } catch (error) {
    parsedItems = String(value)
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(parsedItems)) {
    return null;
  }

  const sanitized = parsedItems
    .map((item) => cleanText(item, { max: maxItemLength, allowEmpty: false }))
    .filter(Boolean);

  if (sanitized.length > maxItems) {
    return null;
  }

  return sanitized;
};

const parseStatsField = (value) => {
  if (!value) return [];

  let parsedStats;
  try {
    parsedStats = JSON.parse(value);
  } catch (error) {
    return null;
  }

  if (!Array.isArray(parsedStats) || parsedStats.length > 6) {
    return null;
  }

  const sanitized = parsedStats
    .map((stat) => {
      if (!stat || typeof stat !== 'object') return null;

      const label = cleanText(stat.label, { max: 60, allowEmpty: false });
      const valueText = cleanText(stat.value, { max: 120, allowEmpty: false });

      if (!label || !valueText) return null;

      return { label, value: valueText };
    })
    .filter(Boolean);

  return sanitized.length === parsedStats.length ? sanitized : null;
};

// Support both legacy numeric ids from seeded data and newer UUID ids.
const ensureValidId = (value) => {
  const normalized = String(value || '').trim();
  return /^\d+$/.test(normalized) || /^[a-f0-9-]{36}$/i.test(normalized);
};

const validateSectionPayload = (req, { isUpdate = false } = {}) => {
  const title = cleanText(req.body.title, { max: 120, allowEmpty: false });
  const description = cleanText(req.body.description, { max: 1200, allowEmpty: false });
  const longDescription = cleanText(req.body.longDescription, { max: 5000 });
  const location = cleanText(req.body.location, { max: 180 });
  const eyebrow = cleanText(req.body.eyebrow, { max: 80 });
  const highlights = parseArrayField(req.body.highlights, { maxItems: 12, maxItemLength: 180 });
  const stats = parseStatsField(req.body.stats);

  if (!title || !description || highlights === null || stats === null) {
    return null;
  }

  if (!isUpdate && !req.file) {
    return null;
  }

  return { title, description, longDescription, location, eyebrow, highlights, stats };
};

const validateServicePayload = (req) => {
  const title = cleanText(req.body.title, { max: 120, allowEmpty: false });
  const subtitle = cleanText(req.body.subtitle, { max: 180 });
  const description = cleanText(req.body.description, { max: 2400, allowEmpty: false });

  if (!title || !description) {
    return null;
  }

  return { title, subtitle, description };
};

const validateGalleryPayload = (req) => {
  const title = cleanText(req.body.title, { max: 120, allowEmpty: false });
  const category = cleanText(req.body.category, { max: 60 });

  if (!title || !req.file) {
    return null;
  }

  return { title, category };
};

const validateSettingsPayload = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return null;
  }

  const siteName = cleanText(body.siteName, { max: 120 });
  const phone = validatePhone(body.phone);
  const phoneSecondary = validatePhone(body.phoneSecondary);
  const email = validateEmail(body.email);
  const address = cleanText(body.address, { max: 500 });
  const openingHours = cleanText(body.openingHours, { max: 180 });
  const social = body.social && typeof body.social === 'object' ? body.social : {};

  const instagram = validateOptionalUrl(social.instagram);
  const facebook = validateOptionalUrl(social.facebook);
  const youtube = validateOptionalUrl(social.youtube);
  const whatsapp = validateOptionalUrl(social.whatsapp);

  if (
    [siteName, phone, phoneSecondary, email, address, openingHours, instagram, facebook, youtube, whatsapp].some(
      (value) => value === null
    )
  ) {
    return null;
  }

  return {
    siteName,
    phone,
    phoneSecondary,
    email,
    address,
    openingHours,
    social: {
      instagram,
      facebook,
      youtube,
      whatsapp,
    },
  };
};

const validateSiteMediaPayload = (body) => {
  const next = {};
  const fields = {
    heroTitle: 180,
    heroTagline: 180,
    heroSubtitle: 500,
    heroComingSoon: 220,
  };

  for (const [key, max] of Object.entries(fields)) {
    if (body[key] === undefined) continue;

    const value = cleanText(body[key], { max });
    if (value === null) {
      return null;
    }

    next[key] = value;
  }

  return next;
};

const validateContactPayload = (body) => {
  const eventType = cleanText(body.eventType, { max: 40 });
  const allowedEventTypes = new Set([
    '',
    'wedding',
    'reception',
    'engagement',
    'mehendi-sangeet',
    'haldi',
    'book-your-stay',
    'other',
  ]);

  if (!allowedEventTypes.has(eventType)) {
    return null;
  }

  const payload = {
    name: cleanText(body.name, { max: 120, allowEmpty: false }),
    email: validateEmail(body.email, { required: true }),
    phone: validatePhone(body.phone, { required: true }),
    eventType,
    eventDate: validateDateString(body.eventDate),
    guestCount: validateIntegerString(body.guestCount, { min: 0, max: 100000 }),
    message: cleanText(body.message, { max: 3000 }),
    checkIn: validateDateString(body.checkIn),
    checkOut: validateDateString(body.checkOut),
    adults: validateIntegerString(body.adults, { min: 1, max: 1000 }),
    children: validateIntegerString(body.children, { min: 0, max: 1000 }),
    stayQuery: cleanText(body.stayQuery, { max: 3000 }),
  };

  if (Object.values(payload).some((value) => value === null)) {
    return null;
  }

  if (payload.eventType === 'book-your-stay') {
    if (!payload.checkIn || !payload.checkOut || !payload.adults) {
      return null;
    }

    if (payload.checkOut < payload.checkIn) {
      return null;
    }
  }

  return payload;
};

const loginAttempts = new Map();

const getRequestIp = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';

const registerLoginAttempt = (key, wasSuccessful) => {
  if (wasSuccessful) {
    loginAttempts.delete(key);
    return;
  }

  const current = loginAttempts.get(key) || { count: 0, firstAttemptAt: Date.now() };
  const now = Date.now();
  const isWindowExpired = now - current.firstAttemptAt > 15 * 60 * 1000;
  const nextState = isWindowExpired
    ? { count: 1, firstAttemptAt: now }
    : { count: current.count + 1, firstAttemptAt: current.firstAttemptAt };

  loginAttempts.set(key, nextState);
};

const isLoginRateLimited = (key) => {
  const state = loginAttempts.get(key);
  if (!state) return false;

  if (Date.now() - state.firstAttemptAt > 15 * 60 * 1000) {
    loginAttempts.delete(key);
    return false;
  }

  return state.count >= 10;
};

app.post('/api/admin/login', noStore, requireConfiguredAdmin, (req, res) => {
  const ip = getRequestIp(req);
  if (isLoginRateLimited(ip)) {
    res.status(429).json({ error: 'Too many failed login attempts. Please try again later.' });
    return;
  }

  const username = cleanText(req.body.username, { max: 120, allowEmpty: false });
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!username || !password) {
    registerLoginAttempt(ip, false);
    res.status(400).json({ error: 'Username and password are required.' });
    return;
  }

  const isAuthorized =
    safeCompare(username, ADMIN_USERNAME) && safeCompare(password, ADMIN_PASSWORD);

  if (!isAuthorized) {
    registerLoginAttempt(ip, false);
    res.status(401).json({ error: 'Invalid admin credentials.' });
    return;
  }

  registerLoginAttempt(ip, true);
  res.json({
    success: true,
    token: createAdminToken(),
    admin: { username: ADMIN_USERNAME },
    expiresInMs: ADMIN_TOKEN_TTL_MS,
  });
});

app.get('/api/admin/session', noStore, requireConfiguredAdmin, requireAdminAuth, (req, res) => {
  res.json({
    authenticated: true,
    admin: { username: req.admin.sub },
    expiresAt: req.admin.exp,
  });
});

app.get('/api/sections', (req, res) => res.json(readData('sections.json')));

app.post('/api/sections', requireConfiguredAdmin, requireAdminAuth, noStore, imageUpload.single('image'), (req, res) => {
  const payload = validateSectionPayload(req);
  if (!payload) {
    res.status(400).json({ error: 'Invalid section payload.' });
    return;
  }

  const sections = readData('sections.json');
  const item = {
    id: uuidv4(),
    ...payload,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    createdAt: new Date().toISOString(),
  };

  sections.push(item);
  writeData('sections.json', sections);
  res.json(item);
});

app.put('/api/sections/:id', requireConfiguredAdmin, requireAdminAuth, noStore, imageUpload.single('image'), (req, res) => {
  if (!ensureValidId(req.params.id)) {
    res.status(400).json({ error: 'Invalid section id.' });
    return;
  }

  const payload = validateSectionPayload(req, { isUpdate: true });
  if (!payload) {
    res.status(400).json({ error: 'Invalid section payload.' });
    return;
  }

  const sections = readData('sections.json');
  const idx = sections.findIndex((section) => section.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  if (req.file) {
    deleteUpload(sections[idx].image);
  }

  sections[idx] = {
    ...sections[idx],
    ...payload,
    image: req.file ? `/uploads/${req.file.filename}` : sections[idx].image,
  };

  writeData('sections.json', sections);
  res.json(sections[idx]);
});

app.delete('/api/sections/:id', requireConfiguredAdmin, requireAdminAuth, noStore, (req, res) => {
  if (!ensureValidId(req.params.id)) {
    res.status(400).json({ error: 'Invalid section id.' });
    return;
  }

  const sections = readData('sections.json');
  const item = sections.find((section) => section.id === req.params.id);
  deleteUpload(item?.image);
  writeData(
    'sections.json',
    sections.filter((section) => section.id !== req.params.id)
  );
  res.json({ success: true });
});

app.get('/api/services', (req, res) => res.json(readData('services.json')));

app.post('/api/services', requireConfiguredAdmin, requireAdminAuth, noStore, imageUpload.single('image'), (req, res) => {
  const payload = validateServicePayload(req);
  if (!payload) {
    res.status(400).json({ error: 'Invalid service payload.' });
    return;
  }

  const services = readData('services.json');
  const item = {
    id: uuidv4(),
    ...payload,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    createdAt: new Date().toISOString(),
  };

  services.push(item);
  writeData('services.json', services);
  res.json(item);
});

app.put('/api/services/:id', requireConfiguredAdmin, requireAdminAuth, noStore, imageUpload.single('image'), (req, res) => {
  if (!ensureValidId(req.params.id)) {
    res.status(400).json({ error: 'Invalid service id.' });
    return;
  }

  const payload = validateServicePayload(req);
  if (!payload) {
    res.status(400).json({ error: 'Invalid service payload.' });
    return;
  }

  const services = readData('services.json');
  const idx = services.findIndex((service) => service.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  if (req.file) {
    deleteUpload(services[idx].image);
  }

  services[idx] = {
    ...services[idx],
    ...payload,
    image: req.file ? `/uploads/${req.file.filename}` : services[idx].image,
  };

  writeData('services.json', services);
  res.json(services[idx]);
});

app.delete('/api/services/:id', requireConfiguredAdmin, requireAdminAuth, noStore, (req, res) => {
  if (!ensureValidId(req.params.id)) {
    res.status(400).json({ error: 'Invalid service id.' });
    return;
  }

  const services = readData('services.json');
  const item = services.find((service) => service.id === req.params.id);
  deleteUpload(item?.image);
  writeData(
    'services.json',
    services.filter((service) => service.id !== req.params.id)
  );
  res.json({ success: true });
});

app.get('/api/gallery', (req, res) => res.json(readData('gallery.json')));

app.post('/api/gallery', requireConfiguredAdmin, requireAdminAuth, noStore, imageUpload.single('image'), (req, res) => {
  const payload = validateGalleryPayload(req);
  if (!payload) {
    res.status(400).json({ error: 'Invalid gallery payload.' });
    return;
  }

  const gallery = readData('gallery.json');
  const item = {
    id: uuidv4(),
    ...payload,
    image: `/uploads/${req.file.filename}`,
    createdAt: new Date().toISOString(),
  };

  gallery.push(item);
  writeData('gallery.json', gallery);
  res.json(item);
});

app.delete('/api/gallery/:id', requireConfiguredAdmin, requireAdminAuth, noStore, (req, res) => {
  if (!ensureValidId(req.params.id)) {
    res.status(400).json({ error: 'Invalid gallery id.' });
    return;
  }

  const gallery = readData('gallery.json');
  const item = gallery.find((entry) => entry.id === req.params.id);
  deleteUpload(item?.image);
  writeData(
    'gallery.json',
    gallery.filter((entry) => entry.id !== req.params.id)
  );
  res.json({ success: true });
});

app.post('/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  if (req.body) {
    console.warn('[CSP Violation]', JSON.stringify(req.body));
  }
  res.sendStatus(204);
});

app.post('/api/contact', contactRateLimiter, (req, res) => {
  const payload = validateContactPayload(req.body);
  if (!payload) {
    res.status(400).json({ error: 'Invalid contact enquiry.' });
    return;
  }

  const contacts = readData('contacts.json');
  const item = {
    id: uuidv4(),
    ...payload,
    read: false,
    createdAt: new Date().toISOString(),
  };

  contacts.push(item);
  writeData('contacts.json', contacts);
  res.json({ success: true, id: item.id });
});

app.get('/api/admin/contacts', noStore, requireConfiguredAdmin, requireAdminAuth, (req, res) => {
  const contacts = readData('contacts.json');
  res.json(contacts.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)));
});

app.put('/api/admin/contacts/:id/read', noStore, requireConfiguredAdmin, requireAdminAuth, (req, res) => {
  if (!ensureValidId(req.params.id)) {
    res.status(400).json({ error: 'Invalid contact id.' });
    return;
  }

  const contacts = readData('contacts.json');
  const idx = contacts.findIndex((contact) => contact.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  contacts[idx].read = true;
  writeData('contacts.json', contacts);
  res.json(contacts[idx]);
});

app.delete('/api/admin/contacts/:id', noStore, requireConfiguredAdmin, requireAdminAuth, (req, res) => {
  if (!ensureValidId(req.params.id)) {
    res.status(400).json({ error: 'Invalid contact id.' });
    return;
  }

  const contacts = readData('contacts.json');
  writeData(
    'contacts.json',
    contacts.filter((contact) => contact.id !== req.params.id)
  );
  res.json({ success: true });
});

app.get('/api/settings', (req, res) => res.json(readData('settings.json')));

app.put('/api/settings', requireConfiguredAdmin, requireAdminAuth, noStore, (req, res) => {
  const payload = validateSettingsPayload(req.body);
  if (!payload) {
    res.status(400).json({ error: 'Invalid settings payload.' });
    return;
  }

  writeData('settings.json', payload);
  res.json(payload);
});

app.post('/api/analytics/visit', analyticsRateLimiter, (req, res) => {
  const analytics = readData('analytics.json');
  const ua = req.headers['user-agent'] || '';
  const isMobile = /mobile|android|iphone|ipad|ipod/i.test(ua);
  const isTablet = /ipad|tablet/i.test(ua);
  const device = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';
  const page = cleanText(req.body.page, { max: 120, allowEmpty: false }) || '/';
  const pageTitle = cleanText(req.body.pageTitle, { max: 160, allowEmpty: false }) || 'Home';
  const referrer = cleanText(req.body.referrer, { max: 1024 });

  const item = {
    id: uuidv4(),
    page,
    pageTitle,
    referrer,
    device,
    userAgent: cleanText(ua, { max: 512 }) || '',
    timestamp: new Date().toISOString(),
  };

  analytics.push(item);
  if (analytics.length > 10000) {
    analytics.splice(0, analytics.length - 10000);
  }

  writeData('analytics.json', analytics);
  res.json({ success: true });
});

app.get('/api/analytics', noStore, requireConfiguredAdmin, requireAdminAuth, (req, res) => {
  const analytics = readData('analytics.json');
  const now = new Date();

  const total = analytics.length;
  const today = analytics.filter(
    (visit) => new Date(visit.timestamp).toDateString() === now.toDateString()
  ).length;
  const thisWeek = analytics.filter(
    (visit) => now - new Date(visit.timestamp) < 7 * 24 * 60 * 60 * 1000
  ).length;
  const thisMonth = analytics.filter(
    (visit) => now - new Date(visit.timestamp) < 30 * 24 * 60 * 60 * 1000
  ).length;

  const byPage = {};
  analytics.forEach((visit) => {
    byPage[visit.pageTitle] = (byPage[visit.pageTitle] || 0) + 1;
  });

  const pageStats = Object.entries(byPage)
    .map(([pageTitle, count]) => ({ page: pageTitle, count }))
    .sort((left, right) => right.count - left.count);

  const byDevice = {};
  analytics.forEach((visit) => {
    byDevice[visit.device] = (byDevice[visit.device] || 0) + 1;
  });

  const daily = {};
  for (let index = 13; index >= 0; index -= 1) {
    const date = new Date(now);
    date.setDate(date.getDate() - index);
    const key = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    daily[key] = 0;
  }

  analytics.forEach((visit) => {
    const visitDate = new Date(visit.timestamp);
    if (now - visitDate <= 14 * 24 * 60 * 60 * 1000) {
      const key = visitDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      if (daily[key] !== undefined) {
        daily[key] += 1;
      }
    }
  });

  const dailyStats = Object.entries(daily).map(([date, count]) => ({ date, count }));
  const recent = analytics
    .slice(-20)
    .reverse()
    .map((visit) => ({
      page: visit.pageTitle,
      device: visit.device,
      timestamp: visit.timestamp,
      referrer: visit.referrer,
    }));

  res.json({ total, today, thisWeek, thisMonth, pageStats, byDevice, dailyStats, recent });
});

app.get('/api/site-media', (req, res) => res.json(readData('siteMedia.json')));

app.put(
  '/api/site-media',
  requireConfiguredAdmin,
  requireAdminAuth,
  noStore,
  mediaUpload.fields([
    { name: 'heroVideoLandscape', maxCount: 1 },
    { name: 'heroVideoPortrait', maxCount: 1 },
    { name: 'eventMainImage', maxCount: 1 },
    { name: 'eventFloatImage', maxCount: 1 },
    { name: 'stayMainImage', maxCount: 1 },
    { name: 'stayFloatImage', maxCount: 1 },
    { name: 'aboutHeroImage', maxCount: 1 },
    { name: 'aboutIntroMainImage', maxCount: 1 },
    { name: 'aboutIntroFloatImage', maxCount: 1 },
    { name: 'aboutPromiseImage', maxCount: 1 },
    { name: 'contactHeroImage', maxCount: 1 },
  ]),
  (req, res) => {
    const uploadedPaths = [];
    const replacedPaths = [];

    if (req.files) {
      Object.values(req.files).forEach((files) => {
        if (!Array.isArray(files)) return;
        files.forEach((file) => {
          if (file?.filename) {
            uploadedPaths.push(`/uploads/${file.filename}`);
          }
        });
      });
    }

    const payload = validateSiteMediaPayload(req.body);
    if (!payload) {
      uploadedPaths.forEach(deleteUpload);
      res.status(400).json({ error: 'Invalid site media payload.' });
      return;
    }

    const media = readData('siteMedia.json');
    const updated = { ...media, ...payload };

    if (req.files) {
      Object.entries(req.files).forEach(([key, files]) => {
        if (!Array.isArray(files) || !files[0]) return;

        if (media[key]?.startsWith('/uploads/')) {
          replacedPaths.push(media[key]);
        }

        updated[key] = `/uploads/${files[0].filename}`;
      });
    }

    try {
      writeData('siteMedia.json', updated);
      replacedPaths.forEach(deleteUpload);
      res.json(updated);
    } catch (error) {
      uploadedPaths.forEach(deleteUpload);
      throw error;
    }
  }
);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'Uploaded file is too large.' });
      return;
    }

    res.status(400).json({ error: 'Unsupported or unexpected uploaded file.' });
    return;
  }

  if (error?.message === 'Origin not allowed by CORS') {
    res.status(403).json({ error: 'Request origin is not allowed.' });
    return;
  }

  next(error);
});

app.use((error, req, res, next) => {
  console.error('Unhandled backend error:', error);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
