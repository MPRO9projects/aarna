import { useState, useEffect } from 'react';
import { fetchGallery, resolveMediaUrl } from '../services/api';

export const useGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await fetchGallery();
      setGallery(data.map(g => ({
        ...g,
        image: resolveMediaUrl(g.image)
      })));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  return { gallery, loading, error, refreshGallery: loadGallery };
};
