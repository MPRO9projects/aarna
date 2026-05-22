import React, { lazy, Suspense, useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Phone } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { trackVisit } from './services/api';

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AdminPanel = lazy(() => import('./pages/Admin/AdminPanel'));

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
    const syncViewportVars = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
      document.documentElement.style.setProperty('--app-width', `${window.innerWidth}px`);
    };

    syncViewportVars();
    window.addEventListener('resize', syncViewportVars);
    window.addEventListener('orientationchange', syncViewportVars);

    return () => {
      window.removeEventListener('resize', syncViewportVars);
      window.removeEventListener('orientationchange', syncViewportVars);
    };
  }, []);

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
          <Route path="/admin" element={<Suspense fallback={<div className="route-loading">Loading...</div>}><AdminPanel /></Suspense>} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Header showRealLogo={showRealLogo} />
      <Suspense fallback={<div className="route-loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </Suspense>
      <Footer />
      <a
        href="tel:+919845122100"
        className={`floating-call-btn ${hideCallButton ? 'is-hidden' : ''}`}
        aria-label="Call Aarna"
      >
        <Phone size={22} strokeWidth={2.2} aria-hidden="true" />
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
