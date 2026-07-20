import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/PrivacyTerms.css';
import { usePageSeo } from '../hooks/usePageSeo';

const PrivacyPolicy = () => {
  usePageSeo({
    title: 'Privacy Policy',
    description:
      'Read the Aarna privacy policy to understand how booking enquiries, contact details, and guest information are collected and used.',
    routePath: '/privacy-policy',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="main-content" className="privacy-terms-page">
      <section className="pt-hero-section">
        <div className="pt-hero-overlay" />
        <div className="pt-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-hero-inner"
          >
            <span className="pt-hero-badge">Privacy Policy</span>
            <h1 className="pt-hero-title">
              Privacy <span>Policy</span>
            </h1>
            <p className="pt-hero-subtitle">
              Aarna Destination Venue and Resort - Respecting your privacy at every step.
            </p>
            <div className="pt-hero-divider">
              <span className="pt-divider-line" />
              <span className="pt-divider-diamond">+</span>
              <span className="pt-divider-line" />
            </div>
          </motion.div>
        </div>
        <div className="pt-hero-scroll">
          <span />
        </div>
      </section>

      <div className="pt-container">
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="pt-policy-section"
        >
          <div className="pt-policy-content">
            <div className="pt-policy-block">
              <h3 className="pt-policy-title">1. Information We Collect</h3>
              <p className="pt-policy-text">
                We collect basic details including your name, contact information, and booking
                preferences only for reservation and service purposes. The information we collect
                may include your full name, email address, phone number, event date, guest count,
                and any special requests you provide to us.
              </p>
            </div>

            <div className="pt-policy-block">
              <h3 className="pt-policy-title">2. How We Use Your Data</h3>
              <p className="pt-policy-text">
                Your information is used for communication, booking confirmation, guest experience
                improvement, and service delivery. We may also use your information to send booking
                updates, respond to your enquiries, and improve our services based on your feedback.
              </p>
            </div>

            <div className="pt-policy-block">
              <h3 className="pt-policy-title">3. Data Sharing Policy</h3>
              <p className="pt-policy-text">
                We do not sell your information. Data may be shared only when legally required or
                with trusted service partners who help us deliver our services. Those partners are
                expected to keep your information confidential and use it only for approved
                purposes.
              </p>
            </div>

            <div className="pt-policy-block">
              <h3 className="pt-policy-title">4. Security Measures</h3>
              <p className="pt-policy-text">
                We implement reasonable security measures to protect your personal data from
                unauthorized access, alteration, or disclosure. This includes secure systems,
                controlled access, and careful handling of enquiry records.
              </p>
            </div>

            <div className="pt-policy-block">
              <h3 className="pt-policy-title">5. Your Rights</h3>
              <p className="pt-policy-text">
                You may request access, correction, or deletion of your personal information at any
                time. Contact us to exercise your data rights, and we will respond within a
                reasonable timeframe.
              </p>
            </div>

            <div className="pt-policy-block">
              <h3 className="pt-policy-title">6. Data Retention</h3>
              <p className="pt-policy-text">
                We retain your information only for as long as necessary to fulfill the purposes
                described in this policy or as required by law. When your data is no longer needed,
                we securely delete or anonymize it.
              </p>
            </div>

            <div className="pt-policy-block">
              <h3 className="pt-policy-title">7. Cookies and Tracking</h3>
              <p className="pt-policy-text">
                Our website may use cookies and analytics tools to improve browsing experience and
                understand site performance. You can manage cookies through your browser settings.
              </p>
            </div>

            <div className="pt-policy-block">
              <h3 className="pt-policy-title">8. Third-Party Links</h3>
              <p className="pt-policy-text">
                Our website may contain links to third-party websites. We are not responsible for
                the privacy practices or content of those external sites, and we recommend reading
                their privacy policies before sharing information.
              </p>
            </div>

            <div className="pt-policy-block">
              <h3 className="pt-policy-title">9. Children&apos;s Privacy</h3>
              <p className="pt-policy-text">
                Our services are not directed to individuals under the age of 18. We do not
                knowingly collect personal information from children. If we learn that such data has
                been collected, we will take steps to delete it.
              </p>
            </div>

            <div className="pt-policy-block">
              <h3 className="pt-policy-title">10. Changes to This Policy</h3>
              <p className="pt-policy-text">
                We may update this privacy policy from time to time. Any changes will be posted on
                this page with an updated effective date, and we encourage you to review it
                periodically.
              </p>
            </div>
          </div>

          <div className="pt-contact-section">
            <h3 className="pt-contact-title">Contact Us</h3>
            <p className="pt-contact-text">
              If you have any questions about this Privacy Policy or your personal data, please
              contact us:
            </p>
            <div className="pt-contact-details">
              <p>
                <strong>Phone:</strong> <a href="tel:+919845122100">+91 98451 22100</a>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:destinations@aarna.net.in">destinations@aarna.net.in</a>
              </p>
              <p>
                <strong>Address:</strong> Gungralchatra, Near Bangalore-Kushalnagar NH-275,
                Mysore, Karnataka 571130, India
              </p>
            </div>
          </div>

          <div className="pt-last-updated">
            <p>Last Updated: April 2026</p>
          </div>
        </motion.section>

        <div className="pt-back-home">
          <Link to="/" className="pt-back-btn">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
