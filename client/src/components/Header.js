import React, { useEffect, useState, forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = forwardRef(({ showRealLogo = true, onLogoClick }, ref) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
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
              src="/logo.png"
              alt="Aarna Resort"
              className={`logo-image ${
                showRealLogo ? "visible" : "hidden-for-transition"
              }`}
              onClick={onLogoClick}
            />
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            <ul className="nav-list">
              <li className={location.pathname === "/" ? "active" : ""}>
                <Link to="/">Home</Link>
              </li>
              <li className={location.pathname === "/about" ? "active" : ""}>
                <Link to="/about">About Us</Link>
              </li>
              <li className={location.pathname === "/contact" ? "active" : ""}>
                <Link to="/contact">Contact</Link>
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
          >
            Home
          </Link>
          <Link
            to="/about"
            className={location.pathname === "/about" ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? "active" : ""}
            onClick={() => setMobileMenuOpen(false)}
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
});

Header.displayName = "Header";
export default Header;