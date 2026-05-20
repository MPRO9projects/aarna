import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Check if this is a back/forward navigation
    const navigationType = performance.getEntriesByType('navigation')[0]?.type;
    
    // Only scroll to top on direct link clicks, not on back/forward
    if (navigationType === 'navigate') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;