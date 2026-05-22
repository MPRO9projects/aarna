const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5010;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } }); // 200MB for videos

const dataPath = (file) => path.join(__dirname, 'data', file);
const readData = (file) => JSON.parse(fs.readFileSync(dataPath(file), 'utf-8'));
const writeData = (file, data) => fs.writeFileSync(dataPath(file), JSON.stringify(data, null, 2));

const deleteUpload = (imagePath) => {
  if (imagePath?.startsWith('/uploads')) {
    const full = path.join(__dirname, imagePath);
    if (fs.existsSync(full)) fs.unlinkSync(full);
  }
};

// ============ SECTIONS ============
app.get('/api/sections', (req, res) => res.json(readData('sections.json')));

const parseArrayField = (val) => {
  if (!val) return [];
  try { return JSON.parse(val); } catch { return val.split('\n').map(s => s.trim()).filter(Boolean); }
};

const parseStatsField = (val) => {
  if (!val) return [];
  try { return JSON.parse(val); } catch { return []; }
};

app.post('/api/sections', upload.single('image'), (req, res) => {
  const sections = readData('sections.json');
  const item = {
    id: uuidv4(), ...req.body,
    highlights: parseArrayField(req.body.highlights),
    stats: parseStatsField(req.body.stats),
    image: req.file ? `/uploads/${req.file.filename}` : null,
    createdAt: new Date().toISOString()
  };
  sections.push(item);
  writeData('sections.json', sections);
  res.json(item);
});

app.put('/api/sections/:id', upload.single('image'), (req, res) => {
  const sections = readData('sections.json');
  const idx = sections.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  if (req.file) deleteUpload(sections[idx].image);
  sections[idx] = {
    ...sections[idx], ...req.body,
    highlights: parseArrayField(req.body.highlights),
    stats: parseStatsField(req.body.stats),
    image: req.file ? `/uploads/${req.file.filename}` : sections[idx].image
  };
  writeData('sections.json', sections);
  res.json(sections[idx]);
});

app.delete('/api/sections/:id', (req, res) => {
  let sections = readData('sections.json');
  const item = sections.find(s => s.id === req.params.id);
  deleteUpload(item?.image);
  writeData('sections.json', sections.filter(s => s.id !== req.params.id));
  res.json({ success: true });
});

// ============ SERVICES ============
app.get('/api/services', (req, res) => res.json(readData('services.json')));

app.post('/api/services', upload.single('image'), (req, res) => {
  const services = readData('services.json');
  const item = { id: uuidv4(), ...req.body, image: req.file ? `/uploads/${req.file.filename}` : null, createdAt: new Date().toISOString() };
  services.push(item);
  writeData('services.json', services);
  res.json(item);
});

app.put('/api/services/:id', upload.single('image'), (req, res) => {
  const services = readData('services.json');
  const idx = services.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  if (req.file) deleteUpload(services[idx].image);
  services[idx] = { ...services[idx], ...req.body, image: req.file ? `/uploads/${req.file.filename}` : services[idx].image };
  writeData('services.json', services);
  res.json(services[idx]);
});

app.delete('/api/services/:id', (req, res) => {
  let services = readData('services.json');
  const item = services.find(s => s.id === req.params.id);
  deleteUpload(item?.image);
  writeData('services.json', services.filter(s => s.id !== req.params.id));
  res.json({ success: true });
});

// ============ GALLERY ============
app.get('/api/gallery', (req, res) => res.json(readData('gallery.json')));

app.post('/api/gallery', upload.single('image'), (req, res) => {
  const gallery = readData('gallery.json');
  const item = { id: uuidv4(), ...req.body, image: req.file ? `/uploads/${req.file.filename}` : null, createdAt: new Date().toISOString() };
  gallery.push(item);
  writeData('gallery.json', gallery);
  res.json(item);
});

app.delete('/api/gallery/:id', (req, res) => {
  let gallery = readData('gallery.json');
  const item = gallery.find(g => g.id === req.params.id);
  deleteUpload(item?.image);
  writeData('gallery.json', gallery.filter(g => g.id !== req.params.id));
  res.json({ success: true });
});

// ============ CONTACT ============
app.post('/api/contact', (req, res) => {
  const contacts = readData('contacts.json');
  const item = { id: uuidv4(), ...req.body, read: false, createdAt: new Date().toISOString() };
  contacts.push(item);
  writeData('contacts.json', contacts);
  res.json({ success: true, id: item.id });
});

app.get('/api/admin/contacts', (req, res) => {
  const contacts = readData('contacts.json');
  res.json(contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.put('/api/admin/contacts/:id/read', (req, res) => {
  const contacts = readData('contacts.json');
  const idx = contacts.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  contacts[idx].read = true;
  writeData('contacts.json', contacts);
  res.json(contacts[idx]);
});

app.delete('/api/admin/contacts/:id', (req, res) => {
  const contacts = readData('contacts.json');
  writeData('contacts.json', contacts.filter(c => c.id !== req.params.id));
  res.json({ success: true });
});

// ============ SETTINGS ============
app.get('/api/settings', (req, res) => res.json(readData('settings.json')));
app.put('/api/settings', (req, res) => { writeData('settings.json', req.body); res.json(req.body); });

// ============ ANALYTICS ============
app.post('/api/analytics/visit', (req, res) => {
  const analytics = readData('analytics.json');
  const ua = req.headers['user-agent'] || '';
  const isMobile = /mobile|android|iphone|ipad|ipod/i.test(ua);
  const isTablet = /ipad|tablet/i.test(ua);
  const device = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';

  const item = {
    id: uuidv4(),
    page: req.body.page || '/',
    pageTitle: req.body.pageTitle || 'Home',
    referrer: req.body.referrer || '',
    device,
    userAgent: ua,
    timestamp: new Date().toISOString()
  };
  analytics.push(item);
  // Keep only last 10000 entries to avoid huge file
  if (analytics.length > 10000) analytics.splice(0, analytics.length - 10000);
  writeData('analytics.json', analytics);
  res.json({ success: true });
});

app.get('/api/analytics', (req, res) => {
  const analytics = readData('analytics.json');
  const now = new Date();

  // Total visits
  const total = analytics.length;
  const today = analytics.filter(v => new Date(v.timestamp).toDateString() === now.toDateString()).length;
  const thisWeek = analytics.filter(v => (now - new Date(v.timestamp)) < 7 * 24 * 60 * 60 * 1000).length;
  const thisMonth = analytics.filter(v => (now - new Date(v.timestamp)) < 30 * 24 * 60 * 60 * 1000).length;

  // Visits by page
  const byPage = {};
  analytics.forEach(v => { byPage[v.pageTitle] = (byPage[v.pageTitle] || 0) + 1; });
  const pageStats = Object.entries(byPage).map(([page, count]) => ({ page, count })).sort((a, b) => b.count - a.count);

  // Devices
  const byDevice = {};
  analytics.forEach(v => { byDevice[v.device] = (byDevice[v.device] || 0) + 1; });

  // Daily visits for last 14 days
  const daily = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    daily[key] = 0;
  }
  analytics.forEach(v => {
    const d = new Date(v.timestamp);
    if ((now - d) <= 14 * 24 * 60 * 60 * 1000) {
      const key = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      if (daily[key] !== undefined) daily[key]++;
    }
  });
  const dailyStats = Object.entries(daily).map(([date, count]) => ({ date, count }));

  // Recent 20 visits
  const recent = analytics.slice(-20).reverse().map(v => ({
    page: v.pageTitle,
    device: v.device,
    timestamp: v.timestamp,
    referrer: v.referrer
  }));

  res.json({ total, today, thisWeek, thisMonth, pageStats, byDevice, dailyStats, recent });
});

// ============ SITE MEDIA (hero, feature images, videos) ============
app.get('/api/site-media', (req, res) => res.json(readData('siteMedia.json')));

app.put('/api/site-media', upload.fields([
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
]), (req, res) => {
  const media = readData('siteMedia.json');
  const updated = { ...media, ...req.body };
  // Handle uploaded files
  if (req.files) {
    Object.entries(req.files).forEach(([key, files]) => {
      if (files[0]) {
        if (media[key]?.startsWith('/uploads')) deleteUpload(media[key]);
        updated[key] = `/uploads/${files[0].filename}`;
      }
    });
  }
  writeData('siteMedia.json', updated);
  res.json(updated);
});

app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
