import { useState, useEffect } from 'react';
import { fetchServices, resolveMediaUrl } from '../services/api';

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await fetchServices();
      setServices(data.map(s => ({
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
    loadServices();
  }, []);

  return { services, loading, error, refreshServices: loadServices };
};
