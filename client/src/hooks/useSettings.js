import { useState, useEffect } from 'react';
import { fetchSettings } from '../services/api';

// Default settings (fallback if API fails)
const defaultSettings = {
  siteName: "Aarna",
  phone: "+91 9845122100",
  phoneSecondary: "+91 9880942101",
  email: "aarnadestinations@gmail.com",
  address: "Gungralchatra, Mysore-571130, Near Bangalore-Kushalnagar NH-275, Mysore, Karnataka, India.",
  openingHours: "Monday to Sunday: 9:00 AM – 9:00 PM",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    whatsapp: "https://wa.me/919845122100"
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchSettings();
      // Merge fetched data with defaults (in case some fields are missing)
      setSettings({ ...defaultSettings, ...data });
      setError(null);
    } catch (err) {
      console.error('Failed to fetch settings, using defaults:', err);
      setError(err.message);
      // Keep defaultSettings already set
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return { settings, loading, error, refreshSettings: loadSettings };
};