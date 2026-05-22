import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/PrivacyTerms.css';
import { usePageSeo } from '../hooks/usePageSeo';

const TermsOfService = () => {
  usePageSeo({
    title: 'Terms of Service',
    description:
      'Read the Aarna terms of service covering bookings, payments, event rules, cancellations, guest responsibilities, and venue policies.',
    routePath: '/terms-of-service',
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
              Terms of Service
            </span>
            <h1 className="pt-hero-title">
              Terms of <span>Service</span>
            </h1>
            <p className="pt-hero-subtitle">
              Aarna Destination Venue & Resort — By confirming booking with us, you agree to the following terms
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
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="pt-terms-section"
        >
          <div className="pt-terms-content">
            {/* General Terms */}
            <div className="pt-terms-block">
              <h3 className="pt-terms-title">1. General Terms</h3>
              <ul className="pt-terms-list">
                <li>Booking is confirmed only with advance payment (non-refundable as per policy).</li>
                <li>Balance payment must be cleared before event or check-in.</li>
                <li>Guests must maintain decorum <span className="kannada-text">(ಶಿಸ್ತಿನ ವರ್ತನೆ ಅಗತ್ಯ)</span>.</li>
                <li>Any damage to property will be chargeable.</li>
                <li>All government taxes and applicable fees are additional unless specified.</li>
              </ul>
            </div>

            {/* Events Terms */}
            <div className="pt-terms-block">
              <h3 className="pt-terms-title">2. Events (Weddings / Functions / Corporate)</h3>
              <ul className="pt-terms-list">
                <li>Event timing must be strictly followed as per the agreed schedule.</li>
                <li>Loud music should comply with local regulations and sound limits.</li>
                <li>Extra hours or additional usage beyond the agreed time will be charged separately.</li>
                <li>Guest count must match prior booking agreement. Any changes must be communicated in advance.</li>
                <li>Outside catering is permitted only with prior approval and applicable charges.</li>
                <li>Decorations must be approved by management and removed within the specified time.</li>
              </ul>
            </div>

            {/* Pool Usage */}
            <div className="pt-terms-block">
              <h3 className="pt-terms-title">3. Pool Usage</h3>
              <ul className="pt-terms-list">
                <li>Pool usage is at your own risk. <span className="kannada-text">ಮಕ್ಕಳು (children)</span> must be under adult supervision at all times.</li>
                <li>Proper swimwear is mandatory. Casual clothing is not permitted in the pool.</li>
                <li>No glass items, food, or alcohol inside the pool area.</li>
                <li>Management is not responsible for any accidents, injuries, or loss of belongings.</li>
                <li>Pool timings must be respected. Late-night swimming is prohibited.</li>
              </ul>
            </div>

            {/* Stay & Guest Responsibility */}
            <div className="pt-terms-block">
              <h3 className="pt-terms-title">4. Stay & Guest Responsibility</h3>
              <ul className="pt-terms-list">
                <li>Check-in time is 12:00 PM and check-out time is 10:00 AM unless specified otherwise.</li>
                <li>Resort is not responsible for loss or theft of personal belongings.</li>
                <li>Illegal or inappropriate activities are strictly prohibited.</li>
                <li>Smoking is prohibited in all indoor areas. Designated smoking zones are available.</li>
                <li>Pets are allowed only with prior approval and applicable charges.</li>
                <li>Visitors are not allowed in guest rooms after 9:00 PM.</li>
              </ul>
            </div>

            {/* Cancellation Policy */}
            <div className="pt-terms-block">
              <h3 className="pt-terms-title">5. Cancellation & Refund Policy</h3>
              <ul className="pt-terms-list">
                <li>Cancellation 30+ days before event: 75% refund.</li>
                <li>Cancellation 15-29 days before event: 50% refund.</li>
                <li>Cancellation 7-14 days before event: 25% refund.</li>
                <li>Cancellation less than 7 days before event: No refund.</li>
                <li>No-shows will be charged 100% of the booking amount.</li>
                <li>Refunds will be processed within 15-20 business days.</li>
              </ul>
            </div>

            {/* Rights of Management */}
            <div className="pt-terms-block highlight">
              <h3 className="pt-terms-title">6. Rights of Management</h3>
              <ul className="pt-terms-list">
                <li>Aarna reserves the right to refuse service or cancel booking if rules are violated.</li>
                <li>Terms may be updated without prior notice. Please check this page regularly.</li>
                <li>Management has the right to ask any guest to leave the premises for inappropriate behavior.</li>
                <li>Photography and videography by external vendors require prior permission.</li>
                <li>Management is not liable for any delays caused by natural disasters or government regulations.</li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div className="pt-terms-block">
              <h3 className="pt-terms-title">7. Limitation of Liability</h3>
              <ul className="pt-terms-list">
                <li>Aarna Destination Venue & Resort shall not be liable for any indirect, incidental, or consequential damages.</li>
                <li>Our total liability is limited to the total amount paid for the booking.</li>
                <li>We are not responsible for any loss, damage, or injury caused by third-party vendors.</li>
              </ul>
            </div>

            {/* Governing Law */}
            <div className="pt-terms-block">
              <h3 className="pt-terms-title">8. Governing Law</h3>
              <ul className="pt-terms-list">
                <li>These terms shall be governed by and construed in accordance with the laws of India.</li>
                <li>Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Mysore, Karnataka.</li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="pt-terms-block">
              <h3 className="pt-terms-title">9. Contact Information</h3>
              <ul className="pt-terms-list">
                <li>For any questions regarding these terms, please contact us at:</li>
                <li>Phone: +91 98765 43210</li>
                <li>Email: aarnadestinations@gmail.com</li>
                <li>Address: Mysore-Bangalore Road, Near Mysore, Karnataka, India</li>
              </ul>
            </div>
          </div>

          <div className="pt-terms-footer">
            <p>By choosing Aarna, you agree to abide by these terms and create beautiful memories with us.</p>
            <p className="pt-terms-date">Last Updated: April , 2026</p>
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

export default TermsOfService;
