import React, { useState, useEffect, useCallback, useRef } from 'react';
import './AdminPanel.css';
import {
  clearAdminAuthToken,
  fetchAdminSession,
  fetchSections, addSection, updateSection, deleteSection,
  fetchServices, addService, deleteService, updateService,
  fetchGallery, addGalleryImage, deleteGalleryImage,
  fetchContacts, markContactRead, deleteContact,
  fetchSettings, updateSettings,
  fetchAnalytics,
  fetchSiteMedia, updateSiteMedia, loginAdmin, resolveMediaUrl,
} from '../../services/api';
import { usePageSeo } from '../../hooks/usePageSeo';
import { optimizeImageFile } from '../../utils/mediaOptimization';

const px = (img) => resolveMediaUrl(img);

/* ─── Mini bar chart ─── */
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.count), 1);


  return (
    <div className="bar-chart">
      {data.map((d, i) => (
        <div key={i} className="bar-col">
          <div className="bar-wrap">
            <div className="bar-fill" style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 4 : 0)}%` }}>
              {d.count > 0 && <span className="bar-val">{d.count}</span>}
            </div>
          </div>
          <span className="bar-label">{d.date}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Image upload field ─── */
function ImageField({ label, name, preview, onChange, required }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {preview && <div className="img-preview"><img src={preview} alt="preview" loading="lazy" decoding="async" /></div>}
      <input type="file" accept="image/*" name={name} onChange={onChange} required={required} />
    </div>
  );
}

/* ─── Video upload field ─── */
function VideoField({ label, name, currentSrc, onChange }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {currentSrc && (
        <div className="video-preview">
          <video src={resolveMediaUrl(currentSrc)} controls preload="metadata" style={{ width: '100%', maxHeight: 140, borderRadius: 8 }} />
        </div>
      )}
      <input type="file" accept="video/mp4,video/*" name={name} onChange={onChange} />
    </div>
  );
}

const DEFAULT_AUTH_STATE = {
  checking: true,
  isAuthenticated: false,
  username: '',
};

export default function AdminPanel() {
  usePageSeo({
    title: 'Admin Panel',
    description: 'Administrative dashboard for managing Aarna website content.',
    routePath: '/admin',
    robots: 'noindex,nofollow',
  });

  const [authState, setAuthState] = useState(DEFAULT_AUTH_STATE);
  const [authError, setAuthError] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [tab, setTab] = useState('analytics');

  // Data
  const [sections, setSections] = useState([]);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [settings, setSettings] = useState({});
  const [siteMedia, setSiteMedia] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Section/Service form
  const [editId, setEditId] = useState(null);
  const [editType, setEditType] = useState(null);
  const [fTitle, setFTitle] = useState('');
  const [fSubtitle, setFSubtitle] = useState('');
  const [fDesc, setFDesc] = useState('');
  const [fLongDesc, setFLongDesc] = useState('');
  const [fLocation, setFLocation] = useState('');
  const [fEyebrow, setFEyebrow] = useState('');
  const [fCategory, setFCategory] = useState('Weddings');
  const [fHighlights, setFHighlights] = useState('');
  const [fStats, setFStats] = useState([{ label: '', value: '' }, { label: '', value: '' }, { label: '', value: '' }]);
  const [fImage, setFImage] = useState(null);
  const [fImagePreview, setFImagePreview] = useState(null);

  const resetForm = () => {
    setEditId(null); setEditType(null);
    setFTitle(''); setFSubtitle(''); setFDesc(''); setFLongDesc('');
    setFLocation(''); setFEyebrow(''); setFCategory('Weddings');
    setFHighlights(''); setFStats([{ label: '', value: '' }, { label: '', value: '' }, { label: '', value: '' }]);
    setFImage(null); setFImagePreview(null);
  };

  const handleSessionExpired = useCallback((message = 'Your admin session expired. Please sign in again.') => {
    clearAdminAuthToken();
    setAuthState({ ...DEFAULT_AUTH_STATE, checking: false });
    setAuthError(message);
    setAnalytics(null);
    setSections([]);
    setServices([]);
    setGallery([]);
    setContacts([]);
  }, []);

  const runProtectedRequest = useCallback(async (requestFn) => {
    try {
      return await requestFn();
    } catch (error) {
      if (error?.status === 401 || error?.status === 403 || error?.code === 'UNAUTHORIZED' || error?.code === 'FORBIDDEN') {
        handleSessionExpired(error.message);
      }
      throw error;
    }
  }, [handleSessionExpired]);

  const startEdit = (type, item) => {
    setEditId(item.id); setEditType(type);
    setFTitle(item.title || ''); setFSubtitle(item.subtitle || '');
    setFDesc(item.description || ''); setFLongDesc(item.longDescription || '');
    setFLocation(item.location || ''); setFEyebrow(item.eyebrow || '');
    setFCategory(item.category || 'Weddings');
    setFHighlights(Array.isArray(item.highlights) ? item.highlights.join('\n') : (item.highlights || ''));
    setFStats(item.stats?.length ? item.stats : [{ label: '', value: '' }, { label: '', value: '' }, { label: '', value: '' }]);
    setFImage(null); setFImagePreview(item.image || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const session = await fetchAdminSession();
        if (!mounted) return;

        setAuthState({
          checking: false,
          isAuthenticated: true,
          username: session?.admin?.username || 'admin',
        });
      } catch (error) {
        if (!mounted) return;

        clearAdminAuthToken();
        setAuthState({ ...DEFAULT_AUTH_STATE, checking: false });
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const loadSectionsData = useCallback(async () => {
    try {
      const data = await runProtectedRequest(() => fetchSections());
      setSections((data || []).map(x => ({ ...x, image: px(x.image) })));
    } catch (_) {
      setSections([]);
    }
  }, [runProtectedRequest]);

  const loadServicesData = useCallback(async () => {
    try {
      const data = await runProtectedRequest(() => fetchServices());
      setServices((data || []).map(x => ({ ...x, image: px(x.image) })));
    } catch (_) {
      setServices([]);
    }
  }, [runProtectedRequest]);

  const loadGalleryData = useCallback(async () => {
    try {
      const data = await runProtectedRequest(() => fetchGallery());
      setGallery((data || []).map(x => ({ ...x, image: px(x.image) })));
    } catch (_) {
      setGallery([]);
    }
  }, [runProtectedRequest]);

  const loadContactsData = useCallback(async () => {
    try {
      const data = await runProtectedRequest(() => fetchContacts());
      setContacts(data || []);
    } catch (_) {
      setContacts([]);
    }
  }, [runProtectedRequest]);

  const loadSettingsData = useCallback(async () => {
    const data = await fetchSettings().catch(() => ({}));
    setSettings(data || {});
  }, []);

  const loadSiteMediaData = useCallback(async () => {
    const data = await fetchSiteMedia().catch(() => ({}));
    setSiteMedia(data || {});
  }, []);

  const loadAnalyticsData = useCallback(async () => {
    try {
      const data = await runProtectedRequest(() => fetchAnalytics());
      setAnalytics(data);
    } catch (_) {
      setAnalytics(null);
    }
  }, [runProtectedRequest]);

  useEffect(() => {
    if (!authState.isAuthenticated) return undefined;
    loadContactsData();
    loadSettingsData();
    loadSiteMediaData();
  }, [authState.isAuthenticated, loadContactsData, loadSettingsData, loadSiteMediaData]);

  useEffect(() => {
    if (!authState.isAuthenticated) return;
    if (tab === 'analytics' && !analytics) loadAnalyticsData();
    if (tab === 'sections' && sections.length === 0) loadSectionsData();
    if (tab === 'services' && services.length === 0) loadServicesData();
    if (tab === 'gallery' && gallery.length === 0) loadGalleryData();
    if (tab === 'contacts' && contacts.length === 0) loadContactsData();
  }, [
    analytics,
    contacts.length,
    gallery.length,
    loadAnalyticsData,
    loadContactsData,
    loadGalleryData,
    loadSectionsData,
    loadServicesData,
    sections.length,
    services.length,
    tab,
    authState.isAuthenticated,
  ]);

  useEffect(() => {
    if (!authState.isAuthenticated) return undefined;
    if (tab !== 'analytics') return undefined;
    const t = setInterval(() => loadAnalyticsData(), 30000);
    return () => clearInterval(t);
  }, [authState.isAuthenticated, loadAnalyticsData, tab]);

  const handleOptimizedImageSelect = useCallback(async (file) => {
    if (!file) return;
    const optimized = await optimizeImageFile(file);
    setFImage(optimized);
    setFImagePreview(URL.createObjectURL(optimized));
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setAuthError('');

    try {
      const result = await loginAdmin(loginForm);
      setAuthState({
        checking: false,
        isAuthenticated: true,
        username: result?.admin?.username || loginForm.username,
      });
      setLoginForm({ username: '', password: '' });
    } catch (error) {
      setAuthError(error.message || 'Unable to sign in.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
    clearAdminAuthToken();
    setAuthState({ ...DEFAULT_AUTH_STATE, checking: false });
    setAuthError('');
    setLoginForm({ username: '', password: '' });
    setTab('analytics');
  }, []);

  const buildFD = (fields) => {
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => { if (v != null) fd.append(k, v); });
    if (fImage) fd.append('image', fImage);
    return fd;
  };

  const handleSaveSection = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const stats = fStats.filter(s => s.label).map(s => ({ label: s.label, value: s.value }));
      const fd = buildFD({
        title: fTitle, description: fDesc, longDescription: fLongDesc,
        location: fLocation, eyebrow: fEyebrow,
        highlights: JSON.stringify(fHighlights.split('\n').map(s => s.trim()).filter(Boolean)),
        stats: JSON.stringify(stats),
      });
      if (editId && editType === 'section') await runProtectedRequest(() => updateSection(editId, fd));
      else await runProtectedRequest(() => addSection(fd));
      resetForm();
      await loadSectionsData();
    } catch (error) {
      alert(error.message || 'Unable to save section.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = buildFD({ title: fTitle, subtitle: fSubtitle, description: fDesc });
      if (editId && editType === 'service') await runProtectedRequest(() => updateService(editId, fd));
      else await runProtectedRequest(() => addService(fd));
      resetForm();
      await loadServicesData();
    } catch (error) {
      alert(error.message || 'Unable to save service.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGallery = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = buildFD({ title: fTitle, category: fCategory });
      await runProtectedRequest(() => addGalleryImage(fd));
      resetForm();
      await loadGalleryData();
    } catch (error) {
      alert(error.message || 'Unable to add gallery image.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      if (type === 'section') { await runProtectedRequest(() => deleteSection(id)); await loadSectionsData(); }
      if (type === 'service') { await runProtectedRequest(() => deleteService(id)); await loadServicesData(); }
      if (type === 'gallery') { await runProtectedRequest(() => deleteGalleryImage(id)); await loadGalleryData(); }
      if (type === 'contact') { await runProtectedRequest(() => deleteContact(id)); await loadContactsData(); }
    } catch (error) {
      alert(error.message || 'Unable to delete item.');
    }
  };

  const [smFiles, setSmFiles] = useState({});
  const [smPreviews, setSmPreviews] = useState({});
  const [smProcessing, setSmProcessing] = useState({});
  const smPreviewsRef = useRef({});

  const releasePreviewUrl = useCallback((url) => {
    if (typeof url === 'string' && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }, []);

  const handleSaveMedia = async (e) => {
    e.preventDefault();

    if (Object.values(smProcessing).some(Boolean)) {
      alert('Please wait for selected images to finish preparing before saving.');
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      ['heroTitle', 'heroTagline', 'heroSubtitle', 'heroComingSoon'].forEach(k => fd.append(k, siteMedia[k] || ''));
      Object.entries(smFiles).forEach(([k, f]) => fd.append(k, f));
      const updated = await runProtectedRequest(() => updateSiteMedia(fd));
      const latest = await fetchSiteMedia().catch(() => updated);
      setSiteMedia(latest || updated);
      setSmFiles({});
      Object.values(smPreviewsRef.current).forEach(releasePreviewUrl);
      smPreviewsRef.current = {};
      setSmPreviews({});
      setSmProcessing({});
      alert('Page media saved!');
    } catch (error) {
      alert(error.message || 'Unable to save page media.');
    } finally {
      setLoading(false);
    }
  };

  const handleSmFile = useCallback(async (key, file, isVideo) => {
    if (!file) return;

    if (isVideo) {
      if (file.size > 60 * 1024 * 1024) {
        alert('This video is quite large. For faster website loading, try uploading a compressed video under 60 MB if possible.');
      }
      setSmFiles(prev => ({ ...prev, [key]: file }));
      return;
    }

    const localPreview = URL.createObjectURL(file);
    releasePreviewUrl(smPreviewsRef.current[key]);
    smPreviewsRef.current[key] = localPreview;

    setSmFiles(prev => ({ ...prev, [key]: file }));
    setSmPreviews(prev => ({ ...prev, [key]: localPreview }));
    setSmProcessing(prev => ({ ...prev, [key]: true }));

    try {
      const optimized = await optimizeImageFile(file);
      const optimizedPreview = URL.createObjectURL(optimized);

      releasePreviewUrl(smPreviewsRef.current[key]);
      smPreviewsRef.current[key] = optimizedPreview;

      setSmFiles(prev => ({ ...prev, [key]: optimized }));
      setSmPreviews(prev => ({ ...prev, [key]: optimizedPreview }));
    } catch (error) {
      setSmFiles(prev => ({ ...prev, [key]: file }));
      setSmPreviews(prev => ({ ...prev, [key]: localPreview }));
    } finally {
      setSmProcessing(prev => ({ ...prev, [key]: false }));
    }
  }, [releasePreviewUrl]);

  useEffect(() => {
    return () => {
      Object.values(smPreviewsRef.current).forEach(releasePreviewUrl);
      smPreviewsRef.current = {};
    };
  }, [releasePreviewUrl]);

  const unread = contacts.filter(c => !c.read).length;

  const handleMarkContactRead = async (contactId) => {
    try {
      await runProtectedRequest(() => markContactRead(contactId));
      await loadContactsData();
    } catch (error) {
      alert(error.message || 'Unable to mark contact as read.');
    }
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await runProtectedRequest(() => updateSettings(settings));
      alert('Settings saved!');
    } catch (error) {
      alert(error.message || 'Unable to save settings.');
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { key: 'analytics', icon: '📊', label: 'Analytics' },
    { key: 'sections', icon: '🏠', label: 'Home Sections' },
    { key: 'services', icon: '✨', label: 'About Services' },
    { key: 'gallery', icon: '🖼️', label: 'Gallery' },
    { key: 'media', icon: '🎬', label: 'Page Media' },
    { key: 'contacts', icon: '✉️', label: 'Contacts', badge: unread },
    { key: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  if (authState.checking) {
    return (
      <div className="ap-root">
        <main className="ap-main">
          <div className="ap-page">
            <div className="ap-empty">
              <span className="ap-spinner">...</span>
              <p>Checking admin session...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="ap-root">
        <main className="ap-main">
          <div className="ap-page">
            <div className="ap-page-header">
              <h1>Admin Sign In</h1>
              <p className="ap-page-sub">Authorized administrators only.</p>
            </div>

            <div className="ap-form-card" style={{ maxWidth: 480 }}>
              <h2 className="ap-form-title">Secure Access</h2>
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    value={loginForm.username}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    autoComplete="current-password"
                    required
                  />
                </div>
                {authError && (
                  <div className="ap-hint" style={{ color: '#b42318', marginBottom: 16 }}>
                    {authError}
                  </div>
                )}
                <div className="ap-form-actions">
                  <button type="submit" disabled={loginLoading} className="ap-btn-primary">
                    {loginLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="ap-root">
      {/* ── Sidebar ── */}
      <aside className="ap-sidebar">
        <div className="ap-brand">
          <span className="ap-brand-icon">♛</span>
          <span className="ap-brand-name">Aarna Admin</span>
        </div>
        <nav className="ap-nav">
          {TABS.map(t => (
            <button key={t.key} className={`ap-nav-btn ${tab === t.key ? 'active' : ''}`} onClick={() => { setTab(t.key); resetForm(); }}>
              <span className="ap-nav-icon">{t.icon}</span>
              <span className="ap-nav-label">{t.label}</span>
              {t.badge > 0 && <span className="ap-badge">{t.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: 20, padding: '0 12px 20px' }}>
          <div className="ap-page-sub" style={{ marginBottom: 12 }}>Signed in as {authState.username}</div>
          <button type="button" onClick={handleLogout} className="ap-btn-ghost" style={{ width: '100%' }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ap-main">

        {/* ══ ANALYTICS ══ */}
        {tab === 'analytics' && (
          <div className="ap-page">
            <div className="ap-page-header">
              <div>
                <h1>Analytics</h1>
                <p className="ap-page-sub">Live visitor insights — auto-refreshes every 30s</p>
              </div>
              <button className="ap-btn-ghost" onClick={() => loadAnalyticsData()}>↻ Refresh</button>
            </div>

            {!analytics ? (
              <div className="ap-empty"><span className="ap-spinner">⟳</span><p>Loading analytics…</p></div>
            ) : (
              <>
                <div className="an-kpi-row">
                  {[
                    { label: 'Today', value: analytics.today, icon: '☀️', color: '#6f1f3b' },
                    { label: 'This Week', value: analytics.thisWeek, icon: '📅', color: '#e8a020' },
                    { label: 'This Month', value: analytics.thisMonth, icon: '🗓️', color: '#3a86ff' },
                    { label: 'All Time', value: analytics.total, icon: '🌍', color: '#27ae60' },
                  ].map(k => (
                    <div key={k.label} className="an-kpi" style={{ '--kc': k.color }}>
                      <span className="an-kpi-icon">{k.icon}</span>
                      <div>
                        <div className="an-kpi-val">{k.value}</div>
                        <div className="an-kpi-label">{k.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="an-grid">
                  <div className="an-card an-card-wide">
                    <h3>Daily Visits — Last 14 Days</h3>
                    <BarChart data={analytics.dailyStats} />
                  </div>

                  <div className="an-card">
                    <h3>Top Pages</h3>
                    {analytics.pageStats.length === 0 ? <p className="an-empty-msg">No data yet</p> : analytics.pageStats.map(p => (
                      <div key={p.page} className="an-hbar">
                        <span className="an-hbar-label">{p.page}</span>
                        <div className="an-hbar-track">
                          <div className="an-hbar-fill" style={{ width: `${(p.count / (analytics.pageStats[0]?.count || 1)) * 100}%` }} />
                        </div>
                        <span className="an-hbar-num">{p.count}</span>
                      </div>
                    ))}
                  </div>

                  <div className="an-card">
                    <h3>Device Breakdown</h3>
                    {Object.keys(analytics.byDevice).length === 0 ? <p className="an-empty-msg">No data yet</p> : Object.entries(analytics.byDevice).map(([dev, cnt]) => (
                      <div key={dev} className="an-hbar">
                        <span className="an-hbar-label">
                          {dev === 'Mobile' ? '📱' : dev === 'Tablet' ? '📲' : '🖥️'} {dev}
                        </span>
                        <div className="an-hbar-track">
                          <div className="an-hbar-fill an-hbar-device" style={{ width: `${(cnt / analytics.total) * 100}%` }} />
                        </div>
                        <span className="an-hbar-num">{cnt} ({Math.round((cnt / analytics.total) * 100)}%)</span>
                      </div>
                    ))}
                  </div>

                  <div className="an-card an-card-wide">
                    <h3>Recent Visits</h3>
                    {analytics.recent.length === 0 ? <p className="an-empty-msg">No visits recorded yet. Visit the site to start tracking.</p> : (
                      <table className="an-table">
                        <thead><tr><th>Page</th><th>Device</th><th>Time</th></tr></thead>
                        <tbody>
                          {analytics.recent.map((v, i) => (
                            <tr key={i}>
                              <td><span className="an-page-dot" />{v.page}</td>
                              <td>{v.device === 'Mobile' ? '📱' : v.device === 'Tablet' ? '📲' : '🖥️'} {v.device}</td>
                              <td className="an-time">{new Date(v.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ HOME SECTIONS ══ */}
        {tab === 'sections' && (
          <div className="ap-page">
            <div className="ap-page-header"><h1>Home Sections</h1><p className="ap-page-sub">Manage the "Our Spaces" cards on the home page</p></div>

            <div className="ap-form-card">
              <h2 className="ap-form-title">{editId && editType === 'section' ? '✏️ Edit Section' : '➕ Add New Section'}</h2>
              <form onSubmit={handleSaveSection}>
                <div className="ap-form-row">
                  <div className="form-group"><label>Title *</label><input value={fTitle} onChange={e => setFTitle(e.target.value)} required /></div>
                  <div className="form-group"><label>Eyebrow Text</label><input value={fEyebrow} onChange={e => setFEyebrow(e.target.value)} placeholder="e.g., Signature Venue" /></div>
                </div>
                <div className="form-group"><label>Location</label><input value={fLocation} onChange={e => setFLocation(e.target.value)} placeholder="e.g., Main Venue Block" /></div>
                <div className="form-group"><label>Short Description *</label><textarea value={fDesc} onChange={e => setFDesc(e.target.value)} rows={3} required /></div>
                <div className="form-group">
                  <label>Full Description (shown in popup overlay)</label>
                  <textarea value={fLongDesc} onChange={e => setFLongDesc(e.target.value)} rows={4} placeholder="Detailed description shown when visitor clicks 'Explore Space'..." />
                </div>
                <div className="form-group">
                  <label>Highlights (one per line — shown as bullet points in popup)</label>
                  <textarea value={fHighlights} onChange={e => setFHighlights(e.target.value)} rows={4} placeholder={'Spacious indoor venue\nIdeal for weddings\nElegant stage setup'} />
                </div>
                <div className="form-group">
                  <label>Stats (3 label:value pairs for popup — e.g., "Best For: Weddings")</label>
                  <div className="ap-stats-grid">
                    {fStats.map((s, i) => (
                      <div key={i} className="ap-stat-row">
                        <input placeholder="Label" value={s.label} onChange={e => setFStats(prev => prev.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
                        <input placeholder="Value" value={s.value} onChange={e => setFStats(prev => prev.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} />
                      </div>
                    ))}
                  </div>
                </div>
                <ImageField
                  label={editId ? 'Change Image (leave empty to keep current)' : 'Upload Image *'}
                  required={!editId}
                  preview={fImagePreview}
                  onChange={async e => { const f = e.target.files[0]; if (f) await handleOptimizedImageSelect(f); }}
                />
                <div className="ap-form-actions">
                  <button type="submit" disabled={loading} className="ap-btn-primary">{loading ? 'Saving…' : editId ? 'Update Section' : 'Add Section'}</button>
                  {editId && <button type="button" onClick={resetForm} className="ap-btn-ghost">Cancel</button>}
                </div>
              </form>
            </div>

            <h2 className="ap-section-title">Current Sections ({sections.length})</h2>
            <div className="ap-grid">
              {sections.map(item => (
                <div key={item.id} className="ap-card">
                  {item.image && <img src={item.image} alt={item.title} className="ap-card-img" loading="lazy" decoding="async" />}
                  <div className="ap-card-body">
                    <h3>{item.title}</h3>
                    {item.eyebrow && <span className="ap-tag">{item.eyebrow}</span>}
                    <p>{item.description?.substring(0, 80)}…</p>
                    <div className="ap-card-actions">
                      <button onClick={() => startEdit('section', item)} className="ap-btn-edit">✏️ Edit</button>
                      <button onClick={() => handleDelete('section', item.id)} className="ap-btn-delete">🗑 Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ SERVICES ══ */}
        {tab === 'services' && (
          <div className="ap-page">
            <div className="ap-page-header"><h1>About Services</h1><p className="ap-page-sub">Manage services shown on the About page</p></div>

            <div className="ap-form-card">
              <h2 className="ap-form-title">{editId && editType === 'service' ? '✏️ Edit Service' : '➕ Add New Service'}</h2>
              <form onSubmit={handleSaveService}>
                <div className="ap-form-row">
                  <div className="form-group"><label>Title *</label><input value={fTitle} onChange={e => setFTitle(e.target.value)} required /></div>
                  <div className="form-group"><label>Subtitle</label><input value={fSubtitle} onChange={e => setFSubtitle(e.target.value)} placeholder="e.g., Elegant spaces for every celebration" /></div>
                </div>
                <div className="form-group"><label>Description *</label><textarea value={fDesc} onChange={e => setFDesc(e.target.value)} rows={4} required /></div>
                <ImageField
                  label={editId ? 'Change Image (leave empty to keep current)' : 'Upload Image'}
                  required={false}
                  preview={fImagePreview}
                  onChange={async e => { const f = e.target.files[0]; if (f) await handleOptimizedImageSelect(f); }}
                />
                <div className="ap-form-actions">
                  <button type="submit" disabled={loading} className="ap-btn-primary">{loading ? 'Saving…' : editId ? 'Update Service' : 'Add Service'}</button>
                  {editId && <button type="button" onClick={resetForm} className="ap-btn-ghost">Cancel</button>}
                </div>
              </form>
            </div>

            <h2 className="ap-section-title">Current Services ({services.length})</h2>
            <div className="ap-grid">
              {services.map(item => (
                <div key={item.id} className="ap-card">
                  {item.image && <img src={item.image} alt={item.title} className="ap-card-img" loading="lazy" decoding="async" />}
                  <div className="ap-card-body">
                    <h3>{item.title}</h3>
                    {item.subtitle && <span className="ap-tag-sm">{item.subtitle}</span>}
                    <p>{item.description?.substring(0, 80)}…</p>
                    <div className="ap-card-actions">
                      <button onClick={() => startEdit('service', item)} className="ap-btn-edit">✏️ Edit</button>
                      <button onClick={() => handleDelete('service', item.id)} className="ap-btn-delete">🗑 Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ GALLERY ══ */}
        {tab === 'gallery' && (
          <div className="ap-page">
            <div className="ap-page-header"><h1>Gallery</h1><p className="ap-page-sub">Add and remove photos from the gallery</p></div>

            <div className="ap-form-card">
              <h2 className="ap-form-title">➕ Add Image</h2>
              <form onSubmit={handleSaveGallery}>
                <div className="ap-form-row">
                  <div className="form-group"><label>Title *</label><input value={fTitle} onChange={e => setFTitle(e.target.value)} required /></div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={fCategory} onChange={e => setFCategory(e.target.value)}>
                      {['Weddings', 'Events', 'Rooms', 'Facilities', 'General'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <ImageField label="Upload Image *" required preview={fImagePreview} onChange={async e => { const f = e.target.files[0]; if (f) await handleOptimizedImageSelect(f); }} />
                <div className="ap-form-actions">
                  <button type="submit" disabled={loading} className="ap-btn-primary">{loading ? 'Uploading…' : 'Add to Gallery'}</button>
                </div>
              </form>
            </div>

            <h2 className="ap-section-title">Gallery Images ({gallery.length})</h2>
            <div className="ap-grid ap-grid-gallery">
              {gallery.map(img => (
                <div key={img.id} className="ap-card ap-card-gallery">
                  {img.image && <img src={img.image} alt={img.title} className="ap-card-img ap-card-img-tall" loading="lazy" decoding="async" />}
                  <div className="ap-card-body ap-card-body-sm">
                    <h3>{img.title}</h3>
                    <span className="ap-cat-tag">{img.category}</span>
                    <button onClick={() => handleDelete('gallery', img.id)} className="ap-btn-delete ap-btn-delete-sm">🗑 Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ PAGE MEDIA ══ */}
        {tab === 'media' && (
          <div className="ap-page">
            <div className="ap-page-header"><h1>Page Media</h1><p className="ap-page-sub">Hero section text, intro videos, and feature images across the site</p></div>

            <form onSubmit={handleSaveMedia}>
              <div className="ap-form-card">
                <h2 className="ap-form-title">🎬 Hero Section Text</h2>
                <div className="form-group"><label>Main Title</label><input value={siteMedia.heroTitle || ''} onChange={e => setSiteMedia(p => ({ ...p, heroTitle: e.target.value }))} placeholder="The Perfect Wedding Destination and Resort" /></div>
                <div className="ap-form-row">
                  <div className="form-group"><label>Tagline (beside AARNA brand)</label><input value={siteMedia.heroTagline || ''} onChange={e => setSiteMedia(p => ({ ...p, heroTagline: e.target.value }))} placeholder="AARNA WEDDING DESTINATION" /></div>
                  <div className="form-group"><label>Coming Soon Note</label><input value={siteMedia.heroComingSoon || ''} onChange={e => setSiteMedia(p => ({ ...p, heroComingSoon: e.target.value }))} /></div>
                </div>
                <div className="form-group"><label>Hero Subtitle / Intro Text</label><textarea value={siteMedia.heroSubtitle || ''} onChange={e => setSiteMedia(p => ({ ...p, heroSubtitle: e.target.value }))} rows={2} /></div>
              </div>

              <div className="ap-form-card">
                <h2 className="ap-form-title">🎥 Intro Videos</h2>
                <p className="ap-hint">These play as the opening splash screen when visitors arrive. Upload MP4 files (max 200MB each).</p>
                <div className="ap-form-row">
                  <VideoField label="Landscape Video (Desktop)" name="heroVideoLandscape" currentSrc={siteMedia.heroVideoLandscape} onChange={e => { if (e.target.files[0]) handleSmFile('heroVideoLandscape', e.target.files[0], true); }} />
                  <VideoField label="Portrait Video (Mobile)" name="heroVideoPortrait" currentSrc={siteMedia.heroVideoPortrait} onChange={e => { if (e.target.files[0]) handleSmFile('heroVideoPortrait', e.target.files[0], true); }} />
                </div>
              </div>

              <div className="ap-form-card">
                <h2 className="ap-form-title">🖼️ Events Section Images</h2>
                <p className="ap-hint">The two images in the "Events & Celebrations" block below Our Spaces.</p>
                <div className="ap-form-row">
                  <div className="form-group">
                    <label>Main Image</label>
                    <div className="img-preview"><img src={smPreviews.eventMainImage || px(siteMedia.eventMainImage) || '/images/first.png'} alt="" loading="lazy" decoding="async" /></div>
                    <input type="file" accept="image/*" onChange={e => { if (e.target.files[0]) handleSmFile('eventMainImage', e.target.files[0], false); }} />
                  </div>
                  <div className="form-group">
                    <label>Floating Card Image</label>
                    <div className="img-preview"><img src={smPreviews.eventFloatImage || px(siteMedia.eventFloatImage) || '/images/second.png'} alt="" loading="lazy" decoding="async" /></div>
                    <input type="file" accept="image/*" onChange={e => { if (e.target.files[0]) handleSmFile('eventFloatImage', e.target.files[0], false); }} />
                  </div>
                </div>
              </div>

              <div className="ap-form-card">
                <h2 className="ap-form-title">🛏️ Stay Section Images</h2>
                <p className="ap-hint">The two images in the "Stay & Accommodation" block.</p>
                <div className="ap-form-row">
                  <div className="form-group">
                    <label>Main Image</label>
                    <div className="img-preview"><img src={smPreviews.stayMainImage || px(siteMedia.stayMainImage) || ''} alt="" loading="lazy" decoding="async" /></div>
                    <input type="file" accept="image/*" onChange={e => { if (e.target.files[0]) handleSmFile('stayMainImage', e.target.files[0], false); }} />
                  </div>
                  <div className="form-group">
                    <label>Floating Card Image</label>
                    <div className="img-preview"><img src={smPreviews.stayFloatImage || px(siteMedia.stayFloatImage) || ''} alt="" loading="lazy" decoding="async" /></div>
                    <input type="file" accept="image/*" onChange={e => { if (e.target.files[0]) handleSmFile('stayFloatImage', e.target.files[0], false); }} />
                  </div>
                </div>
              </div>

              <div className="ap-form-card">
                <h2 className="ap-form-title">🖼️ About Page Images</h2>
                <p className="ap-hint">Hero and intro images used across the About page.</p>
                <div className="ap-form-row">
                  <div className="form-group">
                    <label>Hero Background Image</label>
                    <div className="img-preview"><img src={smPreviews.aboutHeroImage || px(siteMedia.aboutHeroImage) || '/images/about-hero.jpg'} alt="" loading="lazy" decoding="async" /></div>
                    <input type="file" accept="image/*" onChange={e => { if (e.target.files[0]) handleSmFile('aboutHeroImage', e.target.files[0], false); }} />
                  </div>
                  <div className="form-group">
                    <label>Intro Main Image</label>
                    <div className="img-preview"><img src={smPreviews.aboutIntroMainImage || px(siteMedia.aboutIntroMainImage) || '/images/first.png'} alt="" loading="lazy" decoding="async" /></div>
                    <input type="file" accept="image/*" onChange={e => { if (e.target.files[0]) handleSmFile('aboutIntroMainImage', e.target.files[0], false); }} />
                  </div>
                </div>
                <div className="ap-form-row">
                  <div className="form-group">
                    <label>Intro Floating Image</label>
                    <div className="img-preview"><img src={smPreviews.aboutIntroFloatImage || px(siteMedia.aboutIntroFloatImage) || '/images/second.png'} alt="" loading="lazy" decoding="async" /></div>
                    <input type="file" accept="image/*" onChange={e => { if (e.target.files[0]) handleSmFile('aboutIntroFloatImage', e.target.files[0], false); }} />
                  </div>
                  <div className="form-group">
                    <label>Promise Section Image</label>
                    <div className="img-preview"><img src={smPreviews.aboutPromiseImage || px(siteMedia.aboutPromiseImage) || 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=82'} alt="" loading="lazy" decoding="async" /></div>
                    <input type="file" accept="image/*" onChange={e => { if (e.target.files[0]) handleSmFile('aboutPromiseImage', e.target.files[0], false); }} />
                  </div>
                </div>
              </div>

              <div className="ap-form-card">
                <h2 className="ap-form-title">🖼️ Contact Page Images</h2>
                <p className="ap-hint">Hero image used at the top of the Contact Us page.</p>
                <div className="ap-form-row">
                  <div className="form-group">
                    <label>Hero Background Image</label>
                    <div className="img-preview"><img src={smPreviews.contactHeroImage || px(siteMedia.contactHeroImage) || '/images/contact-hero.png'} alt="" loading="lazy" decoding="async" /></div>
                    <input type="file" accept="image/*" onChange={e => { if (e.target.files[0]) handleSmFile('contactHeroImage', e.target.files[0], false); }} />
                  </div>
                </div>
              </div>

              <div className="ap-form-actions ap-save-bar">
                <button type="submit" disabled={loading} className="ap-btn-primary ap-btn-lg">{loading ? 'Saving…' : '💾 Save All Page Media'}</button>
              </div>
            </form>
          </div>
        )}

        {/* ══ CONTACTS ══ */}
        {tab === 'contacts' && (
          <div className="ap-page">
            <div className="ap-page-header"><h1>Contact Submissions</h1><p className="ap-page-sub">{unread} unread</p></div>
            {contacts.length === 0 ? (
              <div className="ap-empty">✉️<p>No submissions yet</p></div>
            ) : (
              <div className="ap-contacts">
                {contacts.map(c => (
                  <div key={c.id} className={`ap-contact-card ${!c.read ? 'unread' : ''}`}>
                    <div className="ap-contact-top">
                      <div>
                        <div className="ap-contact-name">{c.name} {!c.read && <span className="ap-new">NEW</span>}</div>
                        <div className="ap-contact-meta">
                          <span>✉️ {c.email}</span>
                          {c.phone && <span>📞 {c.phone}</span>}
                          {c.eventType && <span>🎉 {c.eventType}</span>}
                          {c.guestCount && <span>👥 {c.guestCount} guests</span>}
                          {c.eventDate && <span>📅 {c.eventDate}</span>}
                        </div>
                      </div>
                      <div className="ap-contact-time">{new Date(c.createdAt).toLocaleString('en-IN')}</div>
                    </div>
                    {(c.message || c.stayQuery) && (
                      <div className="ap-contact-msg">
                        <strong>Message:</strong> {c.message || c.stayQuery}
                      </div>
                    )}
                    <div className="ap-contact-actions">
                      {!c.read && (
                        <button onClick={() => handleMarkContactRead(c.id)} className="ap-btn-read">✓ Mark Read</button>
                      )}
                      <button onClick={() => handleDelete('contact', c.id)} className="ap-btn-delete ap-btn-delete-sm">🗑 Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ SETTINGS ══ */}
        {tab === 'settings' && (
          <div className="ap-page">
            <div className="ap-page-header"><h1>Site Settings</h1><p className="ap-page-sub">Contact info and social links used across the site</p></div>
            <div className="ap-form-card">
              <form onSubmit={handleSettingsSave}>
                <div className="ap-form-row">
                  <div className="form-group"><label>Site Name</label><input value={settings.siteName || ''} onChange={e => setSettings(p => ({ ...p, siteName: e.target.value }))} /></div>
                  <div className="form-group"><label>Primary Phone</label><input value={settings.phone || ''} onChange={e => setSettings(p => ({ ...p, phone: e.target.value }))} /></div>
                </div>
                <div className="ap-form-row">
                  <div className="form-group"><label>Secondary Phone</label><input value={settings.phoneSecondary || ''} onChange={e => setSettings(p => ({ ...p, phoneSecondary: e.target.value }))} /></div>
                  <div className="form-group"><label>Email</label><input value={settings.email || ''} onChange={e => setSettings(p => ({ ...p, email: e.target.value }))} /></div>
                </div>
                <div className="form-group"><label>Address</label><textarea value={settings.address || ''} onChange={e => setSettings(p => ({ ...p, address: e.target.value }))} rows={3} /></div>
                <div className="form-group"><label>Opening Hours</label><input value={settings.openingHours || ''} onChange={e => setSettings(p => ({ ...p, openingHours: e.target.value }))} /></div>
                <div className="ap-form-row">
                  <div className="form-group"><label>Instagram URL</label><input value={settings.social?.instagram || ''} onChange={e => setSettings(p => ({ ...p, social: { ...p.social, instagram: e.target.value } }))} /></div>
                  <div className="form-group"><label>Facebook URL</label><input value={settings.social?.facebook || ''} onChange={e => setSettings(p => ({ ...p, social: { ...p.social, facebook: e.target.value } }))} /></div>
                </div>
                <div className="ap-form-row">
                  <div className="form-group"><label>YouTube URL</label><input value={settings.social?.youtube || ''} onChange={e => setSettings(p => ({ ...p, social: { ...p.social, youtube: e.target.value } }))} /></div>
                  <div className="form-group"><label>WhatsApp URL</label><input value={settings.social?.whatsapp || ''} onChange={e => setSettings(p => ({ ...p, social: { ...p.social, whatsapp: e.target.value } }))} /></div>
                </div>
                <div className="ap-form-actions"><button type="submit" className="ap-btn-primary">💾 Save Settings</button></div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

