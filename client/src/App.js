import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AdminPanel from './pages/Admin/AdminPanel';
import { trackVisit } from './services/api';

const PAGE_NAMES = { '/': 'Home', '/about': 'About', '/contact': 'Contact', '/privacy-policy': 'Privacy Policy', '/terms-of-service': 'Terms of Service' };

function AppContent() {
  const [showRealLogo, setShowRealLogo] = useState(true);
  const [hideCallButton, setHideCallButton] = useState(false);
  const location = useLocation();

  // Hide admin panel from showing header/footer
  const isAdminPage = location.pathname === "/admin";

  // Track page visits for analytics
  useEffect(() => {
    if (location.pathname !== '/admin') {
      trackVisit({
        page: location.pathname,
        pageTitle: PAGE_NAMES[location.pathname] || location.pathname,
        referrer: document.referrer
      });
    }
  }, [location.pathname]);

  // Fix: Save scroll position when navigating
  useEffect(() => {
    const saveCurrentScroll = () => {
      sessionStorage.setItem(`scroll_${location.pathname}`, window.scrollY);
    };

    window.addEventListener('beforeunload', saveCurrentScroll);
    return () => window.removeEventListener('beforeunload', saveCurrentScroll);
  }, [location]);

  // Fix: Restore scroll position when coming back
  useEffect(() => {
    const savedScroll = sessionStorage.getItem(`scroll_${location.pathname}`);
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll));
      }, 100);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleHideLogo = () => setShowRealLogo(false);
    const handleShowLogo = () => setShowRealLogo(true);

    window.addEventListener("hideRealLogo", handleHideLogo);
    window.addEventListener("showRealLogo", handleShowLogo);

    return () => {
      window.removeEventListener("hideRealLogo", handleHideLogo);
      window.removeEventListener("showRealLogo", handleShowLogo);
    };
  }, []);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHideCallButton(entry.isIntersecting),
      { root: null, threshold: 0.05 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [location.pathname]);

  // For admin page - don't show header/footer
  if (isAdminPage) {
    return (
      <>
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Header showRealLogo={showRealLogo} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
      <Footer />
      <a
        href="tel:+919845122100"
        className={`floating-call-btn ${hideCallButton ? 'is-hidden' : ''}`}
        aria-label="Call Aarna"
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.32.56 3.57.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.19 2.45.56 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
