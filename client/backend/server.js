const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ============ CREATE ALL REQUIRED FOLDERS ============
const folders = ['uploads/sections', 'uploads/gallery', 'uploads/services', 'data'];
folders.forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// ============ MASTER DATA FILE ============
const masterFile = './data/master.json';

if (!fs.existsSync(masterFile)) {
  const initialData = {
    sections: [],
    gallery: [],
    services: [],
    contacts: [],
    settings: {
      siteName: "Aarna",
      phone: "+91 9845122100",
      phoneSecondary: "+91 9880942101",
      email: "destinations@aarna.net.in",
      address: "Gungralchatra, Mysore-571130, Near Bangalore-Kushalnagar NH-275, Mysore, Karnataka, India.",
      social: {
        instagram: "https://instagram.com/aarnaresort",
        facebook: "https://facebook.com/aarnaresort",
        youtube: "https://youtube.com/aarnaresort",
        whatsapp: "https://wa.me/919845122100"
      },
      openingHours: "Monday to Sunday: 9:00 AM – 9:00 PM",
      heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552",
      aboutImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed"
    },
    nextSectionId: 1,
    nextGalleryId: 1,
    nextServiceId: 1,
    nextContactId: 1
  };
  fs.writeFileSync(masterFile, JSON.stringify(initialData, null, 2));
}

const readData = () => JSON.parse(fs.readFileSync(masterFile));
const writeData = (data) => fs.writeFileSync(masterFile, JSON.stringify(data, null, 2));

// ============ FILE UPLOAD SETUP ============
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type || 'sections';
    const dir = `./uploads/${type}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ============ API: SECTIONS (Home Page) ============
app.get('/api/sections', (req, res) => {
  const data = readData();
  res.json(data.sections);
});

app.post('/api/sections', upload.single('image'), (req, res) => {
  const data = readData();
  const newSection = {
    id: data.nextSectionId++,
    title: req.body.title,
    description: req.body.description,
    location: req.body.location || 'Aarna Venue',
    eyebrow: req.body.eyebrow || 'Our Space',
    image: `/uploads/sections/${req.file.filename}`,
    imageName: req.file.filename,
    createdAt: new Date().toISOString()
  };
  data.sections.push(newSection);
  writeData(data);
  res.json(newSection);
});

app.delete('/api/sections/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const section = data.sections.find(s => s.id === id);
  if (section) {
    const imagePath = `./uploads/sections/${section.imageName}`;
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    data.sections = data.sections.filter(s => s.id !== id);
    writeData(data);
  }
  res.json({ success: true });
});

// ============ API: SERVICES (About Page) ============
app.get('/api/services', (req, res) => {
  const data = readData();
  res.json(data.services);
});

app.post('/api/services', upload.single('image'), (req, res) => {
  const data = readData();
  const newService = {
    id: data.nextServiceId++,
    title: req.body.title,
    subtitle: req.body.subtitle || '',
    description: req.body.description,
    image: req.file ? `/uploads/services/${req.file.filename}` : '',
    imageName: req.file?.filename || '',
    createdAt: new Date().toISOString()
  };
  data.services.push(newService);
  writeData(data);
  res.json(newService);
});

app.delete('/api/services/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const service = data.services.find(s => s.id === id);
  if (service && service.imageName) {
    const imagePath = `./uploads/services/${service.imageName}`;
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }
  data.services = data.services.filter(s => s.id !== id);
  writeData(data);
  res.json({ success: true });
});

app.put('/api/services/:id', upload.single('image'), (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.services.findIndex(s => s.id === id);
  
  if (index !== -1) {
    if (req.file) {
      const oldImagePath = `./uploads/services/${data.services[index].imageName}`;
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      data.services[index].image = `/uploads/services/${req.file.filename}`;
      data.services[index].imageName = req.file.filename;
    }
    data.services[index].title = req.body.title || data.services[index].title;
    data.services[index].subtitle = req.body.subtitle || data.services[index].subtitle;
    data.services[index].description = req.body.description || data.services[index].description;
    writeData(data);
  }
  
  res.json({ success: true });
});

// ============ API: GALLERY ============
app.get('/api/gallery', (req, res) => {
  const data = readData();
  res.json(data.gallery);
});

app.post('/api/gallery', upload.single('image'), (req, res) => {
  const data = readData();
  const newImage = {
    id: data.nextGalleryId++,
    title: req.body.title,
    category: req.body.category || 'General',
    image: `/uploads/gallery/${req.file.filename}`,
    imageName: req.file.filename,
    createdAt: new Date().toISOString()
  };
  data.gallery.push(newImage);
  writeData(data);
  res.json(newImage);
});

app.delete('/api/gallery/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const image = data.gallery.find(g => g.id === id);
  if (image) {
    const imagePath = `./uploads/gallery/${image.imageName}`;
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    data.gallery = data.gallery.filter(g => g.id !== id);
    writeData(data);
  }
  res.json({ success: true });
});

// ============ API: CONTACT FORM ============
app.post('/api/contact', (req, res) => {
  const data = readData();
  const newContact = {
    id: data.nextContactId++,
    ...req.body,
    submittedAt: new Date().toISOString(),
    status: 'unread'
  };
  data.contacts.push(newContact);
  writeData(data);
  res.json({ success: true });
});

app.get('/api/admin/contacts', (req, res) => {
  const data = readData();
  res.json(data.contacts);
});

app.put('/api/admin/contacts/:id/read', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const contact = data.contacts.find(c => c.id === id);
  if (contact) contact.status = 'read';
  writeData(data);
  res.json({ success: true });
});

app.delete('/api/admin/contacts/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  data.contacts = data.contacts.filter(c => c.id !== id);
  writeData(data);
  res.json({ success: true });
});

// ============ API: SETTINGS (Global Settings) ============
app.get('/api/settings', (req, res) => {
  const data = readData();
  res.json(data.settings);
});

app.put('/api/settings', (req, res) => {
  const data = readData();
  data.settings = { ...data.settings, ...req.body };
  writeData(data);
  res.json({ success: true });
});

// ============ API: ANALYTICS ============
const analyticsFile = './data/analytics.json';
if (!fs.existsSync(analyticsFile)) {
  fs.writeFileSync(analyticsFile, JSON.stringify({ visits: [] }, null, 2));
}
const readAnalytics = () => {
  try { return JSON.parse(fs.readFileSync(analyticsFile)); } catch { return { visits: [] }; }
};

app.post('/api/analytics/track', (req, res) => {
  const data = readAnalytics();
  data.visits.push({ page: req.body.page || '/', device: req.body.device || 'Desktop', timestamp: new Date().toISOString() });
  if (data.visits.length > 5000) data.visits = data.visits.slice(-5000);
  fs.writeFileSync(analyticsFile, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

app.get('/api/analytics', (req, res) => {
  const data = readAnalytics();
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now - 7 * 86400000);
  const monthAgo = new Date(now - 30 * 86400000);

  const today = data.visits.filter(v => v.timestamp.slice(0, 10) === todayStr).length;
  const thisWeek = data.visits.filter(v => new Date(v.timestamp) >= weekAgo).length;
  const thisMonth = data.visits.filter(v => new Date(v.timestamp) >= monthAgo).length;
  const total = data.visits.length;

  const dailyMap = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 86400000).toISOString().slice(0, 10);
    dailyMap[d] = 0;
  }
  data.visits.forEach(v => { const d = v.timestamp.slice(0, 10); if (dailyMap[d] !== undefined) dailyMap[d]++; });
  const dailyStats = Object.entries(dailyMap).map(([date, count]) => ({ date: date.slice(5), count }));

  const pageMap = {};
  data.visits.forEach(v => { pageMap[v.page] = (pageMap[v.page] || 0) + 1; });
  const pageStats = Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([page, count]) => ({ page, count }));

  const byDevice = {};
  data.visits.forEach(v => { byDevice[v.device] = (byDevice[v.device] || 0) + 1; });

  const recent = [...data.visits].reverse().slice(0, 20);

  res.json({ today, thisWeek, thisMonth, total, dailyStats, pageStats, byDevice, recent });
});

// ============ API: SITE MEDIA ============
const siteMediaFile = './data/siteMedia.json';
if (!fs.existsSync(siteMediaFile)) {
  fs.writeFileSync(siteMediaFile, JSON.stringify({}, null, 2));
}
const readSiteMedia = () => {
  try { return JSON.parse(fs.readFileSync(siteMediaFile)); } catch { return {}; }
};

app.get('/api/site-media', (req, res) => {
  res.json(readSiteMedia());
});

const siteMediaUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = './uploads/media';
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  })
}).fields([
  { name: 'heroVideoLandscape' }, { name: 'heroVideoPortrait' },
  { name: 'eventMainImage' }, { name: 'eventFloatImage' },
  { name: 'stayMainImage' }, { name: 'stayFloatImage' }
]);

app.put('/api/site-media', siteMediaUpload, (req, res) => {
  const current = readSiteMedia();
  const updated = { ...current, ...req.body };
  if (req.files) {
    Object.entries(req.files).forEach(([key, files]) => {
      if (files[0]) updated[key] = `/uploads/media/${files[0].filename}`;
    });
  }
  fs.writeFileSync(siteMediaFile, JSON.stringify(updated, null, 2));
  res.json(updated);
});

// ============ START SERVER ============
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads folder: ${path.join(__dirname, 'uploads')}`);
  console.log(`💾 Data folder: ${path.join(__dirname, 'data')}`);
});