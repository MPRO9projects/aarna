import React, { useEffect, useState, forwardRef, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = memo(forwardRef(({ showRealLogo = true, onLogoClick }, ref) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="container header-container">
          <Link to="/" className="brand-link" aria-label="Aarna Home">
            <img
              ref={ref}
              src="/images/logo.png"
              alt="Aarna Resort"
              width="180"
              height="72"
              decoding="async"
              fetchPriority="high"
              className={`logo-image ${
                showRealLogo ? "visible" : "hidden-for-transition"
              }`}
              onClick={onLogoClick}
            />
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            <ul className="nav-list">
              <li className={location.pathname === "/" ? "active" : ""}>
                <Link to="/" aria-current={location.pathname === "/" ? "page" : undefined}>Home</Link>
              </li>
              <li className={location.pathname === "/about" ? "active" : ""}>
                <Link to="/about" aria-current={location.pathname === "/about" ? "page" : undefined}>About Us</Link>
              </li>
              <li className={location.pathname === "/contact" ? "active" : ""}>
                <Link to="/contact" aria-current={location.pathname === "/contact" ? "page" : undefined}>Contact</Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <Link to="/contact" className="btn-book btn-plan-event">
              Plan Event
            </Link>
            <Link to="/contact" className="btn-book btn-book-stay">
              Book Your Stay
            </Link>

            <button
              className={`hamburger ${mobileMenuOpen ? "active" : ""}`}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`mobile-overlay ${mobileMenuOpen ? "open" : ""}`}
      >
        <button
          className="mobile-close"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close Menu"
          type="button"
        >
          ×
        </button>

        <nav className="mobile-nav" aria-label="Mobile navigation">
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
            aria-current={location.pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={location.pathname === "/about" ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
            aria-current={location.pathname === "/about" ? "page" : undefined}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
            aria-current={location.pathname === "/contact" ? "page" : undefined}
          >
            Contact
          </Link>
          <Link
            to="/contact"
            className="mobile-cta mobile-cta-event"
            onClick={() => setMobileMenuOpen(false)}
          >
            Plan Event
          </Link>
          <Link
            to="/contact"
            className="mobile-cta mobile-cta-stay"
            onClick={() => setMobileMenuOpen(false)}
          >
            Book Your Stay
          </Link>
        </nav>
      </div>
    </>
  );
}));

Header.displayName = "Header";
export default Header;
