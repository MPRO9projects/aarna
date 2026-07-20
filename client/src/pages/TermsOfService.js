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
      <section className="pt-hero-section">
        <div className="pt-hero-overlay" />
        <div className="pt-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-hero-inner"
          >
            <span className="pt-hero-badge">Terms of Service</span>
            <h1 className="pt-hero-title">
              Terms of <span>Service</span>
            </h1>
            <p className="pt-hero-subtitle">
              Aarna Destination Venue and Resort - By confirming a booking with us, you agree to
              the following terms.
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
          className="pt-terms-section"
        >
          <div className="pt-terms-content">
            <div className="pt-terms-block">
              <h3 className="pt-terms-title">1. General Terms</h3>
              <ul className="pt-terms-list">
                <li>Booking is confirmed only with advance payment, subject to the agreed policy.</li>
                <li>Balance payment must be cleared before the event or check-in date.</li>
                <li>Guests must maintain decorum and follow venue rules at all times.</li>
                <li>Any damage to property will be chargeable.</li>
                <li>Government taxes and applicable fees are additional unless stated otherwise.</li>
              </ul>
            </div>

            <div className="pt-terms-block">
              <h3 className="pt-terms-title">2. Events</h3>
              <ul className="pt-terms-list">
                <li>Event timing must follow the agreed schedule.</li>
                <li>Loud music should comply with local regulations and venue limits.</li>
                <li>Extra hours or additional usage beyond the approved time may be charged separately.</li>
                <li>Guest count should match the agreed booking details as closely as possible.</li>
                <li>Outside catering or vendors may require prior approval and additional charges.</li>
                <li>Decorations should be approved by management and cleared within the agreed time.</li>
              </ul>
            </div>

            <div className="pt-terms-block">
              <h3 className="pt-terms-title">3. Pool Usage</h3>
              <ul className="pt-terms-list">
                <li>Pool usage is at your own risk. Children must be supervised by adults at all times.</li>
                <li>Proper swimwear is mandatory.</li>
                <li>No glass items, food, or alcohol are allowed inside the pool area.</li>
                <li>Management is not responsible for accidents, injuries, or loss of belongings.</li>
                <li>Pool timings must be respected. Late-night swimming is prohibited.</li>
              </ul>
            </div>

            <div className="pt-terms-block">
              <h3 className="pt-terms-title">4. Stay and Guest Responsibility</h3>
              <ul className="pt-terms-list">
                <li>Check-in time is 12:00 PM and check-out time is 10:00 AM unless otherwise agreed.</li>
                <li>The resort is not responsible for loss or theft of personal belongings.</li>
                <li>Illegal or inappropriate activities are strictly prohibited.</li>
                <li>Smoking is prohibited in indoor areas except designated zones.</li>
                <li>Pets are allowed only with prior approval and applicable charges.</li>
                <li>Visitors may be restricted in guest accommodation after venue hours.</li>
              </ul>
            </div>

            <div className="pt-terms-block">
              <h3 className="pt-terms-title">5. Cancellation and Refund Policy</h3>
              <ul className="pt-terms-list">
                <li>Cancellation terms and refund amounts follow the booking agreement shared at confirmation.</li>
                <li>Any approved refund is processed within a reasonable business timeframe.</li>
                <li>No-shows may result in full booking charges.</li>
              </ul>
            </div>

            <div className="pt-terms-block highlight">
              <h3 className="pt-terms-title">6. Rights of Management</h3>
              <ul className="pt-terms-list">
                <li>Aarna reserves the right to refuse service or cancel booking if rules are violated.</li>
                <li>Terms may be updated without prior notice. Please review this page regularly.</li>
                <li>Management may ask any guest to leave the premises for inappropriate behavior.</li>
                <li>External photography or videography vendors may require prior permission.</li>
                <li>Management is not liable for delays caused by natural disasters or government restrictions.</li>
              </ul>
            </div>

            <div className="pt-terms-block">
              <h3 className="pt-terms-title">7. Limitation of Liability</h3>
              <ul className="pt-terms-list">
                <li>Aarna Destination Venue and Resort shall not be liable for indirect or consequential damages.</li>
                <li>Our total liability is limited to the amount paid for the relevant booking.</li>
                <li>We are not responsible for loss, damage, or injury caused by third-party vendors.</li>
              </ul>
            </div>

            <div className="pt-terms-block">
              <h3 className="pt-terms-title">8. Governing Law</h3>
              <ul className="pt-terms-list">
                <li>These terms are governed by the laws of India.</li>
                <li>Any disputes are subject to the jurisdiction of courts in Mysore, Karnataka.</li>
              </ul>
            </div>

            <div className="pt-terms-block">
              <h3 className="pt-terms-title">9. Contact Information</h3>
              <ul className="pt-terms-list">
                <li>For any questions regarding these terms, please contact us at:</li>
                <li>Phone: +91 98451 22100</li>
                <li>Email: destinations@aarna.net.in</li>
                <li>Address: Gungralchatra, Near Bangalore-Kushalnagar NH-275, Mysore, Karnataka 571130, India</li>
              </ul>
            </div>
          </div>

          <div className="pt-terms-footer">
            <p>By choosing Aarna, you agree to abide by these terms and create beautiful memories with us.</p>
            <p className="pt-terms-date">Last Updated: April 2026</p>
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

export default TermsOfService;
