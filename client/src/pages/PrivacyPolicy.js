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
      {/* Hero Section */}
      <section className="pt-hero-section">
        <div className="pt-hero-overlay" />
        <div className="pt-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-hero-inner"
          >
            <span className="pt-hero-badge">
              Privacy Policy
            </span>
            <h1 className="pt-hero-title">
              Privacy <span>Policy</span>
            </h1>
            <p className="pt-hero-subtitle">
              Aarna Destination Venue & Resort — Respecting your privacy <span className="kannada-text">(ನಿಮ್ಮ ಗೌಪ್ಯತೆ ನಮಗೆ ಅತ್ಯಂತ ಮುಖ್ಯ)</span>
            </p>
            <div className="pt-hero-divider">
              <span className="pt-divider-line" />
              <span className="pt-divider-diamond">✦</span>
              <span className="pt-divider-line" />
            </div>
          </motion.div>
        </div>
        <div className="pt-hero-scroll">
          <span />
        </div>
      </section>

      <div className="pt-container">
        {/* Privacy Policy Content */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="pt-policy-section"
        >
          <div className="pt-policy-content">
            {/* Section 1 */}
            <div className="pt-policy-block">
              <h3 className="pt-policy-title">1. Information We Collect</h3>
              <p className="pt-policy-text">
                We collect basic details including your name, contact information, and booking preferences — only for reservation and service purposes. Your privacy is our priority. The information we collect may include your full name, email address, phone number, event date, guest count, and any special requests you provide to us.
              </p>
            </div>

            {/* Section 2 */}
            <div className="pt-policy-block">
              <h3 className="pt-policy-title">2. How We Use Your Data</h3>
              <p className="pt-policy-text">
                Your information is used exclusively for communication, booking confirmation, guest experience improvement, and service delivery. We never misuse your data. We may also use your information to send you updates about your booking, respond to your inquiries, and improve our services based on your feedback.
              </p>
            </div>

            {/* Section 3 */}
            <div className="pt-policy-block">
              <h3 className="pt-policy-title">3. Data Sharing Policy</h3>
              <p className="pt-policy-text">
                We do not sell or misuse your information. Data may be shared only when legally required or with trusted service partners who help us serve you better. These partners are contractually obligated to keep your information confidential and use it only for the purposes specified by us.
              </p>
            </div>

            {/* Section 4 */}
            <div className="pt-policy-block">
              <h3 className="pt-policy-title">4. Security Measures</h3>
              <p className="pt-policy-text">
                We implement reasonable security measures to protect your personal data from unauthorized access, alteration, or disclosure. This includes secure servers, encrypted data transmission, and restricted access to personal information.
              </p>
            </div>

            {/* Section 5 */}
            <div className="pt-policy-block">
              <h3 className="pt-policy-title">5. Your Rights</h3>
              <p className="pt-policy-text">
                You may request access, update, or deletion of your information at any time. Contact us to exercise your data rights. We will respond to your request within 30 days and provide you with a copy of your personal data upon request.
              </p>
            </div>

            {/* Section 6 */}
            <div className="pt-policy-block">
              <h3 className="pt-policy-title">6. Data Retention</h3>
              <p className="pt-policy-text">
                We retain your information only as long as necessary to fulfill the purposes outlined in this policy or as required by law. When your data is no longer needed, we will securely delete or anonymize it.
              </p>
            </div>

            {/* Section 7 */}
            <div className="pt-policy-block">
              <h3 className="pt-policy-title">7. Cookies and Tracking</h3>
              <p className="pt-policy-text">
                Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may affect certain functionalities of our website.
              </p>
            </div>

            {/* Section 8 */}
            <div className="pt-policy-block">
              <h3 className="pt-policy-title">8. Third-Party Links</h3>
              <p className="pt-policy-text">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to read their privacy policies before providing any personal information.
              </p>
            </div>

            {/* Section 9 */}
            <div className="pt-policy-block">
              <h3 className="pt-policy-title">9. Children's Privacy</h3>
              <p className="pt-policy-text">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete it immediately.
              </p>
            </div>

            {/* Section 10 */}
            <div className="pt-policy-block">
              <h3 className="pt-policy-title">10. Changes to This Policy</h3>
              <p className="pt-policy-text">
                We may update this privacy policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about how we protect your information.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="pt-contact-section">
            <h3 className="pt-contact-title">Contact Us</h3>
            <p className="pt-contact-text">
              If you have any questions about this Privacy Policy or your personal data, please contact us:
            </p>
            <div className="pt-contact-details">
              <p><strong>Phone:</strong> <a href="tel:+919876543210">+91 98765 43210</a></p>
              <p><strong>Email:</strong> <a href="mailto:privacy@aarnadestinations.com">aarnadestinations@gamil.com</a></p>
              <p><strong>Address:</strong> Mysore-Bangalore Road, Near Mysore, Karnataka, India</p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="pt-last-updated">
            <p>Last Updated: April, 2026</p>
          </div>
        </motion.section>

        {/* Back to Home Button */}
        <div className="pt-back-home">
          <Link to="/" className="pt-back-btn">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
