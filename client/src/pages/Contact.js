import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  LoaderCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/Contact.css';
import { useSettings } from '../hooks/useSettings';
import { fetchSiteMedia, resolveMediaUrl, submitContact } from '../services/api';
import { usePageSeo } from '../hooks/usePageSeo';

const EASE_OUT = [0.22, 1, 0.36, 1];

const mediaUrl = (val, fallback) => {
  const resolved = resolveMediaUrl(val);
  return resolved || fallback;
};

/* ── Custom Hook for Scroll Reveal with Bidirectional Animation ── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay');
            if (delay) {
              entry.target.style.transitionDelay = `${delay}ms`;
            }
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

function Contact() {
  const defaultContactHeroImage = '/images/contact-hero.png';

  usePageSeo({
    title: 'Contact Aarna',
    description:
      'Get in touch with Aarna for weddings, receptions, stays, and event planning near Mysore. Enquire about availability, bookings, and venue details.',
    routePath: '/contact',
    image: 'https://aarna.net.in/images/contact-hero.png',
    imageAlt: 'Contact Aarna for weddings, stays, and event bookings near Mysore',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    message: '',
    checkIn: '',
    checkOut: '',
    adults: '',
    children: '',
    stayQuery: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [siteMedia, setSiteMedia] = useState({});

  // Get dynamic settings
  const { settings } = useSettings();

  useEffect(() => {
    fetchSiteMedia().then(setSiteMedia).catch(() => {});
  }, []);

  const contactContentRef = useRef(null);
  const mapRef = useRef(null);
  const ctaRef = useRef(null);

  useScrollReveal();

  const VIEWPORT_ONCE = { once: true, amount: 0.15 };

  // Animation variants
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE_OUT }
    }
  };

  const zoomInVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: EASE_OUT }
    }
  };

  const slideLeftVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: EASE_OUT }
    }
  };

  const slideRightVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: EASE_OUT }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE_OUT }
    }
  };

  const validate = (data) => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!data.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    if (!data.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!data.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(data.phone.trim().replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (data.eventType !== 'book-your-stay') {
      if (data.eventDate) {
        const eventDate = new Date(data.eventDate);
        if (eventDate < today) errors.eventDate = 'Event date must be today or in the future.';
      }
      if (data.guestCount && Number(data.guestCount) < 1) {
        errors.guestCount = 'Guest count must be at least 1.';
      }
    }

    if (data.eventType === 'book-your-stay') {
      if (!data.checkIn) {
        errors.checkIn = 'Check-in date is required.';
      } else {
        const checkIn = new Date(data.checkIn);
        if (checkIn < today) errors.checkIn = 'Check-in date must be today or in the future.';
      }

      if (!data.checkOut) {
        errors.checkOut = 'Check-out date is required.';
      } else if (data.checkIn) {
        const checkIn = new Date(data.checkIn);
        const checkOut = new Date(data.checkOut);
        if (checkOut <= checkIn) errors.checkOut = 'Check-out date must be after check-in date.';
      }

      if (!data.adults || Number(data.adults) < 1) {
        errors.adults = 'At least 1 adult is required.';
      }
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setFormErrors((prev) => {
        const updated = validate({ ...formData, [name]: value });
        return { ...prev, [name]: updated[name] };
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errors = validate(formData);
    setFormErrors((prev) => ({ ...prev, [name]: errors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await submitContact(formData);
      if (result.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventType: '',
          eventDate: '',
          guestCount: '',
          message: '',
          checkIn: '',
          checkOut: '',
          adults: '',
          children: '',
          stayQuery: '',
        });
        setFormErrors({});
        setTouched({});

        setTimeout(() => {
          setSubmitted(false);
        }, 8000);
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addRipple = useCallback((e) => {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const point =
      e.touches && e.touches.length > 0
        ? e.touches[0]
        : e.changedTouches && e.changedTouches.length > 0
          ? e.changedTouches[0]
          : e;

    const size = Math.max(rect.width, rect.height) * 2;

    circle.classList.add('ripple');
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.left = `${point.clientX - rect.left - size / 2}px`;
    circle.style.top = `${point.clientY - rect.top - size / 2}px`;

    const prevRipple = btn.getElementsByClassName('ripple')[0];
    if (prevRipple) prevRipple.remove();

    btn.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
  }, []);

  return (
    <main id="main-content" className="contact-page">
      {/* Hero Section */}
      <motion.section
        className="contact-hero"
        style={{
          backgroundImage: `url('${mediaUrl(siteMedia.contactHeroImage, defaultContactHeroImage)}'), url('${defaultContactHeroImage}')`,
        }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: EASE_OUT }}
      >
        <div className="hero-bg-overlay"></div>
        <div className="container">
          <div className="contact-hero-content" data-reveal>
            <h1>Let's Create Your Dream Wedding</h1>
            <div className="gold-line-center"></div>
            <p>We are here to help plan every detail of your special day.</p>
          </div>
        </div>
      </motion.section>

      {/* Contact Information & Form */}
      <motion.section
        ref={contactContentRef}
        className="contact-content-section deferred-section"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <div className="container">
          <div className="contact-grid">
            {/* Contact Details - Slide from Left */}
            <motion.div
              className="contact-details-col"
              variants={slideLeftVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="details-card">
                <div className="kicker">GET IN TOUCH</div>
                <h2 className="serif">
                  <span className="aarna-brand contact-aarna-brand">Aarna</span> Wedding Destination
                </h2>
                <div className="gold-rule"></div>

                <p className="details-intro">
                  We would love to hear about your celebration. Reach out to us for venue details,
                  availability, and personalized wedding planning support.
                </p>

                <motion.div
                  className="info-list"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="info-item" variants={staggerItem}>
                    <div className="info-icon">
                      <MapPin size={20} strokeWidth={2.1} aria-hidden="true" />
                    </div>
                    <div className="info-text">
                      <h3>Our Location</h3>
                      <p>Gungralchatra, Mysore-571130, Near Bangalore-Kushalnagar NH-275, Mysore, Karnataka, India.</p>
                    </div>
                  </motion.div>

                  <motion.div className="info-item" variants={staggerItem}>
                    <div className="info-icon">
                      <Phone size={20} strokeWidth={2.1} aria-hidden="true" />
                    </div>
                    <div className="info-text">
                      <h3>Call Us</h3>
                      <p>
                        <a href={`tel:${settings?.phone?.replace(/\D/g, '') || '9845122100'}`}>{settings?.phone || '98451 22100'}</a> |{' '}
                        <a href={`tel:${settings?.phoneSecondary?.replace(/\D/g, '') || '9880942101'}`}>{settings?.phoneSecondary || '98809 42101'}</a>
                      </p>
                    </div>
                  </motion.div>

                  <motion.div className="info-item" variants={staggerItem}>
                    <div className="info-icon">
                      <Mail size={20} strokeWidth={2.1} aria-hidden="true" />
                    </div>
                    <div className="info-text">
                      <h3>Email Us</h3>
                      <p>
                        <a href={`mailto:${settings?.email || 'destinations@aarna.net.in'}`}>
                          {settings?.email || 'destinations@aarna.net.in'}
                        </a>
                      </p>
                    </div>
                  </motion.div>

                  <motion.div className="info-item" variants={staggerItem}>
                    <div className="info-icon">
                      <Clock3 size={20} strokeWidth={2.1} aria-hidden="true" />
                    </div>
                    <div className="info-text">
                      <h3>Opening Hours</h3>
                      <p>{settings?.openingHours || 'Monday to Sunday: 9:00 AM – 9:00 PM'}</p>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="contact-socials"
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <span className="social-label">Follow Us</span>
                  <div className="social-icons">
                    <a
                      href={settings?.social?.instagram || 'https://instagram.com'}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                    >
                      <i className="fa-brands fa-instagram" style={{fontSize:18}} aria-hidden="true"></i>
                    </a>
                    <a
                      href={settings?.social?.facebook || 'https://facebook.com'}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                    >
                      <i className="fa-brands fa-facebook-f" style={{fontSize:18}} aria-hidden="true"></i>
                    </a>
                    <a
                      href={settings?.social?.youtube || 'https://youtube.com'}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="YouTube"
                    >
                      <i className="fa-brands fa-youtube" style={{fontSize:18}} aria-hidden="true"></i>
                    </a>
                    <a
                      href={settings?.social?.whatsapp || 'https://wa.me/919845122100'}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
                    </a>
                    <a
                      href={`tel:${settings?.phone?.replace(/\D/g, '') || '9845122100'}`}
                      aria-label="Call Us"
                    >
                      <Phone size={18} strokeWidth={2} aria-hidden="true" />
                    </a>
                    <a
                      href={`mailto:${settings?.email || 'destinations@aarna.net.in'}`}
                      aria-label="Email Us"
                    >
                      <Mail size={18} strokeWidth={2} aria-hidden="true" />
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Inquiry Form - Slide from Right */}
            <motion.div
              className="contact-form-col"
              variants={slideRightVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="form-card">
                {submitted ? (
                  <motion.div
                    className="success-message"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                  >
                    <div className="success-icon">
                      <CheckCircle2 size={72} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <h3>Thank You!</h3>
                    <p>
                      {formData.eventType === 'book-your-stay'
                        ? 'Your stay enquiry has been received. Our team will contact you shortly with availability and details.'
                        : 'Your wedding enquiry has been received. Our team will contact you shortly to discuss your celebration.'
                      }
                    </p>
                    <button
                      className="btn-maroon"
                      onClick={() => setSubmitted(false)}
                      type="button"
                      onMouseDown={addRipple}
                      onTouchStart={addRipple}
                    >
                      Send Another Enquiry
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="serif">
                      {formData.eventType === 'book-your-stay'
                        ? <>Book Your Stay at <span className="aarna-brand contact-aarna-brand">Aarna</span></>
                        : <>Plan Your Wedding with <span className="aarna-brand contact-aarna-brand">Aarna</span></>
                      }
                    </h3>
                    <p className="form-intro">
                      {formData.eventType === 'book-your-stay'
                        ? 'Share your stay details and we will get back to you with availability and packages.'
                        : 'Share your details and let us begin creating your perfect wedding experience.'
                      }
                    </p>

                    {submitError && (
                      <div className="error-message" style={{ color: '#dc3545', marginBottom: '20px', padding: '10px', background: '#ffe6e6', borderRadius: '8px' }}>
                        <AlertTriangle size={16} strokeWidth={2.2} aria-hidden="true" style={{ verticalAlign: 'text-bottom' }} /> {submitError}
                      </div>
                    )}

                    <motion.form
                      onSubmit={handleSubmit}
                      className="wedding-form"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div className="form-row" variants={staggerItem}>
                        <div className="form-group">
                          <label htmlFor="name">Full Name *</label>
                          <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your full name"
                            className={formErrors.name ? 'input-error' : ''}
                          />
                          {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                        </div>

                        <div className="form-group">
                          <label htmlFor="email">Email Address *</label>
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your email address"
                            className={formErrors.email ? 'input-error' : ''}
                          />
                          {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                        </div>
                      </motion.div>

                      <motion.div className="form-row" variants={staggerItem}>
                        <div className="form-group">
                          <label htmlFor="phone">Phone Number *</label>
                          <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your 10-digit mobile number"
                            className={formErrors.phone ? 'input-error' : ''}
                          />
                          {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
                        </div>

                        <div className="form-group">
                          <label htmlFor="eventType">Book Your Event & Stay</label>
                          <select
                            id="eventType"
                            name="eventType"
                            value={formData.eventType}
                            onChange={handleChange}
                          >
                            <option value="">Select event type</option>
                            <option value="wedding">Wedding</option>
                            <option value="reception">Reception</option>
                            <option value="engagement">Engagement</option>
                            <option value="mehendi-sangeet">Mehendi / Sangeet</option>
                            <option value="haldi">Haldi</option>
                            <option value="book-your-stay">Book Your Stay</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </motion.div>

                      {formData.eventType !== 'book-your-stay' && (
                        <motion.div className="form-row" variants={staggerItem}>
                          <div className="form-group">
                            <label htmlFor="eventDate">Preferred Event Date</label>
                            <input
                              id="eventDate"
                              type="date"
                              name="eventDate"
                              value={formData.eventDate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={formErrors.eventDate ? 'input-error' : ''}
                            />
                            {formErrors.eventDate && <span className="field-error">{formErrors.eventDate}</span>}
                          </div>

                          <div className="form-group">
                            <label htmlFor="guestCount">Estimated Guest Count</label>
                            <input
                              id="guestCount"
                              type="number"
                              name="guestCount"
                              value={formData.guestCount}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Enter expected guests"
                              min="1"
                              className={formErrors.guestCount ? 'input-error' : ''}
                            />
                            {formErrors.guestCount && <span className="field-error">{formErrors.guestCount}</span>}
                          </div>
                        </motion.div>
                      )}

                      {formData.eventType === 'book-your-stay' && (
                        <>
                          <motion.div className="form-row stay-dates-row" variants={staggerItem}>
                            <div className="form-group">
                              <label htmlFor="checkIn">Check-In Date *</label>
                              <input
                                id="checkIn"
                                type="date"
                                name="checkIn"
                                value={formData.checkIn}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={formErrors.checkIn ? 'input-error' : ''}
                              />
                              {formErrors.checkIn && <span className="field-error">{formErrors.checkIn}</span>}
                            </div>
                            <div className="form-group">
                              <label htmlFor="checkOut">Check-Out Date *</label>
                              <input
                                id="checkOut"
                                type="date"
                                name="checkOut"
                                value={formData.checkOut}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={formErrors.checkOut ? 'input-error' : ''}
                              />
                              {formErrors.checkOut && <span className="field-error">{formErrors.checkOut}</span>}
                            </div>
                          </motion.div>

                          <motion.div className="form-row" variants={staggerItem}>
                            <div className="form-group">
                              <label htmlFor="adults">Number of Adults *</label>
                              <input
                                id="adults"
                                type="number"
                                name="adults"
                                value={formData.adults}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter number of adults"
                                min="1"
                                className={formErrors.adults ? 'input-error' : ''}
                              />
                              {formErrors.adults && <span className="field-error">{formErrors.adults}</span>}
                            </div>
                            <div className="form-group">
                              <label htmlFor="children">Number of Children</label>
                              <input
                                id="children"
                                type="number"
                                name="children"
                                value={formData.children}
                                onChange={handleChange}
                                placeholder="Enter number of children"
                                min="0"
                              />
                            </div>
                          </motion.div>

                          <motion.div className="form-group" variants={staggerItem}>
                            <label htmlFor="stayQuery">Additional Queries / Special Requests</label>
                            <textarea
                              id="stayQuery"
                              name="stayQuery"
                              rows="4"
                              value={formData.stayQuery}
                              onChange={handleChange}
                              placeholder="Any specific room preferences, dietary needs, accessibility requirements, or other requests?"
                            ></textarea>
                          </motion.div>
                        </>
                      )}

                      <motion.div className="form-group" variants={staggerItem}>
                        <label htmlFor="message">
                          {formData.eventType === 'book-your-stay'
                            ? 'Additional Notes'
                            : 'Your Vision / Special Requests'}
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder={
                            formData.eventType === 'book-your-stay'
                              ? 'Any other information you would like to share with us?'
                              : 'Tell us about your wedding vision, preferred style, and any special requirements.'
                          }
                        ></textarea>
                      </motion.div>

                      <motion.button
                        type="submit"
                        className="btn-maroon"
                        disabled={isSubmitting}
                        onMouseDown={addRipple}
                        onTouchStart={addRipple}
                        variants={staggerItem}
                      >
                        {isSubmitting ? (
                          <><LoaderCircle size={16} strokeWidth={2.2} aria-hidden="true" className="spin-icon" /> Sending...</>
                        ) : (
                          <>{formData.eventType === 'book-your-stay'
                            ? 'Send Stay Enquiry'
                            : 'Send Wedding Enquiry'} <Plane size={16} strokeWidth={2.2} aria-hidden="true" /></>
                        )}
                      </motion.button>
                    </motion.form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Map Section with Zoom In Animation */}
      <motion.section
        ref={mapRef}
        className="map-section deferred-section"
        variants={zoomInVariants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <div className="container">
          <div className="map-container" data-reveal>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3897.5!2d76.610274!3d12.334821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf7b0b8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sGungralchatra%2C%20Mysore%2C%20Karnataka%20571130!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Aarna Location Map - Gungralchatra, Mysore"
            ></iframe>
          </div>
        </div>
      </motion.section>

      {/* CTA Section with Fade Up Animation */}
      <motion.section
        ref={ctaRef}
        className="wedding-cta deferred-section"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <div className="container">
          <div className="cta-simple" data-reveal>
            <h3>Ready to Begin Your Journey?</h3>
            <p>
              Let <span className="aarna-brand">Aarna</span> help you create a celebration filled
              with elegance, beauty, and unforgettable memories.
            </p>
            <Link to="/" className="btn-maroon">
              Explore Our Venues
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

export default Contact;
