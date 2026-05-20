import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const currentYear = 2026;

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img
                src="/logo.png"
                alt="Aarna Resort"
                className="footer-logo-image"
              />
            </Link>

            <p className="footer-desc">
              A beautifully curated destination where celebrations feel grand,
              intimate, and unforgettable — crafted for timeless moments near
              Mysore.
            </p>

            <div className="footer-socials">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="tel:+9845122100" aria-label="Call Us">
                <i className="fa-solid fa-phone"></i>
              </a>
              <a
                href="mailto:aarnadestinations@gmail.com"
                aria-label="Email Us"
              >
                <i className="fa-solid fa-envelope"></i>
              </a>
            </div>
          </div>

          <div className="footer-nav-group">
            <h4 className="footer-title">Explore</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">Our Story</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-nav-group">
            <h4 className="footer-title">Experiences</h4>
            <ul className="footer-links">
              <li>
                <Link to="/contact" className="hover-gold">Weddings</Link>
              </li>
              <li>
                <Link to="/contact" className="hover-gold">Receptions</Link>
              </li>
              <li>
                <Link to="/contact" className="hover-gold">Engagements</Link>
              </li>
              <li>
                <Link to="/contact" className="hover-gold">Mehendi & Sangeet</Link>
              </li>
              <li>
                <Link to="/contact" className="hover-gold">Birthday Celebrations</Link>
              </li>
              <li>
                <Link to="/contact" className="hover-gold">Anniversaries</Link>
              </li>
              <li>
                <Link to="/contact" className="hover-gold">Corporate Events</Link>
              </li>
              <li>
                <Link to="/contact" className="hover-gold">Private Celebrations</Link>
              </li>
            </ul>
          </div>

          <div className="footer-action">
            <h4 className="footer-title">Connect</h4>

            <div className="footer-contact-info">
              <div className="contact-item">
                <i className="fa-solid fa-location-dot"></i>
                <span>Gungralchatra, Mysore-571130, Near Bangalore-Kushalnagar NH-275, Mysore, Karnataka, India.</span>
              </div>

              <div className="contact-item">
                <i className="fa-solid fa-phone"></i>
                <a href="tel:+9845122100">+91 98451 22100</a>
              </div>

              <div className="contact-item">
                <i className="fa-solid fa-envelope"></i>
                <a href="mailto:aarnadestinations@gmail.com">
                  aarnadestinations@gmail.com
                </a>
              </div>
            </div>

            <Link to="/contact" className="footer-cta">
              Plan Your Event
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-brand-center">
            <div className="aarna-brand">
              <span className="aarna-name">AARNA</span>
              <span className="aarna-tagline">Where Tradition Meets Trend</span>
            </div>
            
            <div className="footer-legal-center">
              <p className="copyright">
                © {currentYear} AARNA Resort. All Rights Reserved.
              </p>
              <div className="legal-links-center">
                <Link to="/privacy-policy">Privacy Policy</Link>
                <span className="separator">•</span>
                <Link to="/terms-of-service">Terms of Service</Link>
                <span className="separator">•</span>
                <span className="powered-by">Powered by M PRO9 Pvt Ltd.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;