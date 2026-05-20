import { useState, useEffect } from 'react';
import { fetchSections, resolveMediaUrl } from '../services/api';

export const useSections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSections = async () => {
    setLoading(true);
    try {
      const data = await fetchSections();
      setSections(data.map(s => ({
        ...s,
        image: resolveMediaUrl(s.image)
      })));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  return { sections, loading, error, refreshSections: loadSections };
};
