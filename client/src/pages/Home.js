import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import '../styles/Home.css';
import landscapeVideo from '../Assets/video/landscape.mp4';
import portraitVideo from '../Assets/video/portrait.mp4';
import { useSections } from '../hooks/useSections';
import { fetchSiteMedia, resolveMediaUrl } from '../services/api';

/* ─── shared easing ──────────────────────────────────────── */
const EASE_OUT = [0.22, 1, 0.36, 1];
const EASE_SMOOTH = [0.25, 0.46, 0.45, 0.94];
const EASE_GENTLE = [0.33, 0.66, 0.66, 1];

/* ═══════════════════════════════════════════════════════════
   AnimatedTitle
   ═══════════════════════════════════════════════════════════ */
function AnimatedTitle({ text, delay = 0, className = '' }) {
  const words = text.split(' ');
  return (
    <span aria-label={text} className={`animated-title-root ${className}`}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="animated-title-word-shell">
          <motion.span
            className="animated-title-word-inner"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.75,
              delay: delay + i * 0.08,
              ease: EASE_OUT,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   OverlayHero - Transparent Background (Photo Shows Through)
   ═══════════════════════════════════════════════════════════ */
function CardTitle({ text, isActive, triggerKey }) {
  const words = (text || '').split(' ');

  if (!isActive) {
    return <h3 className="card-title-static">{text}</h3>;
  }

  return (
    <h3 className="card-title-active" aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}-${triggerKey}`} className="spaces-word-shell">
          <motion.span
            className="spaces-word-inner"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.72,
              delay: i * 0.08,
              ease: EASE_OUT,
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </h3>
  );
}

function OverlayHero({ space, containerRef, sharedImageRef, onBack, onExplore }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const heroTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.55, 0.82],
    [1, 0.92, 0]
  );
  const heroTextY = useTransform(scrollYProgress, [0, 0.82], [0, 56]);
  const veilOpacity = useTransform(scrollYProgress, [0, 1], [0.22, 0.38]);
  const dividerOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0]);

  const handleMouseMove = (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: (e.clientX - b.left - b.width / 2) / b.width,
      y: (e.clientY - b.top - b.height / 2) / b.height,
    });
  };

  return (
    <motion.section
      ref={heroRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="overlay-hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
    >
      <motion.button
        type="button"
        onClick={onBack}
        className="overlay-hero-back-btn"
        initial={{ opacity: 0, x: -22, y: -8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: -22, y: -8 }}
        transition={{ duration: 0.4, delay: 0.12, ease: EASE_OUT }}
        aria-label="Back to Our Space"
      >
        <span className="overlay-hero-back-icon">←</span>
        <span>Back to Our Space</span>
      </motion.button>

      <motion.div
        className="overlay-hero-parallax"
        animate={{
          x: mouse.x * -14,
          y: mouse.y * -10,
          rotate: mouse.x * -0.35,
        }}
        transition={{ duration: 1.8, ease: EASE_OUT }}
      >
        <motion.img
          layoutId={`space-image-${space.id}`}
          ref={sharedImageRef}
          src={space.image}
          alt={space.title}
          className="overlay-hero-img"
          initial={{ borderRadius: '24px', opacity: 0 }}
          animate={{
            borderRadius: '0px',
            opacity: 1,
          }}
          exit={{
            borderRadius: '24px',
            opacity: 0,
          }}
          transition={{
            layout: {
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              type: "spring",
              stiffness: 400,
              damping: 40
            },
            opacity: { duration: 0.3, delay: 0.1 },
            borderRadius: { duration: 0.4, ease: EASE_OUT }
          }}
          style={{ y: heroImageY }}
        />
      </motion.div>

      <motion.div
        className="overlay-hero-glow"
        animate={{ opacity: [0.52, 0.7, 0.54] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div className="overlay-hero-veil" style={{ opacity: veilOpacity }} />
      <div className="overlay-hero-grad-tb" />
      <div className="overlay-hero-grad-lr" />

      <div className="overlay-hero-orbs">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`overlay-orb overlay-orb-${i}`}
            animate={{
              y: [0, -12, 0],
              x: [0, i === 1 ? -10 : 8, 0],
              opacity: [0.16, 0.26, 0.16],
            }}
            transition={{ duration: 9 + i, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <motion.div
        className="overlay-hero-tint"
        animate={{ opacity: [0.36, 0.52, 0.36] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        style={{ opacity: heroTextOpacity, y: heroTextY }}
        className="overlay-hero-text-wrap"
      >
        <div className="overlay-hero-text-inner">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: EASE_OUT }}
            className="overlay-eyebrow-badge"
          >
            <span className="overlay-eyebrow-star">✦</span>
            {space.eyebrow}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.45 }}
            className="overlay-hero-title-block"
          >
            <AnimatedTitle text={space.title} delay={0.6} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.0, ease: EASE_OUT }}
            className="overlay-hero-location"
          >
            <span className="spaces-location-dot" />
            <span>{space.location}</span>
          </motion.div>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.2, ease: EASE_OUT }}
            className="overlay-scroll-hint-pill"
            onClick={onExplore}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onExplore();
              }
            }}
            aria-label="Scroll to content"
          >
            <span>Scroll to explore</span>
            <motion.span
              className="overlay-scroll-dot-wrap"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="overlay-scroll-dot" />
            </motion.span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE_OUT }}
            style={{ opacity: dividerOpacity }}
            className="overlay-gold-divider-wrap"
          >
            <div className="overlay-gold-divider" />
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════
   OverlayContent - Glass Effect (Transparent with blur)
   ═══════════════════════════════════════════════════════════ */
function OverlayContent({ space, onBack }) {
  return (
    <section className="overlay-content-section">
      <div className="overlay-content-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="overlay-main-narrative"
        >
          <div className="overlay-content-header">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="overlay-label-gold"
            >
              The Venue Story
            </motion.span>
            <div className="overlay-header-line" />
          </div>

          <motion.div
            className="overlay-description-block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <p className="overlay-body-text">{space.longDescription}</p>
          </motion.div>

          <div className="overlay-feature-grid">
            {(space.stats || []).map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                className="overlay-feature-item"
              >
                <span className="overlay-feature-label">{stat.label}</span>
                <span className="overlay-feature-value">{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="overlay-details-split">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="overlay-highlights-block"
          >
            <h4 className="overlay-subheading">Venue Highlights</h4>
            <div className="overlay-highlights-modern-list">
              {(space.highlights || []).map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  className="overlay-modern-li"
                >
                  <span className="overlay-li-icon">✧</span>
                  <span className="overlay-li-text">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="overlay-action-card-modern"
          >
            <div className="overlay-action-content">
              <h4 className="overlay-action-title">Ready to celebrate?</h4>
              <p className="overlay-action-p">
                Experience redefined luxury and spiritual elegance at Aarna.
              </p>
              <div className="overlay-btn-group">
                <Link to="/contact" className="overlay-btn-solid">
                  Book This Space
                </Link>
                <button onClick={onBack} className="overlay-btn-outline-modern">
                  Back to Spaces
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const mediaUrl = (val, fallback) => {
  const resolved = resolveMediaUrl(val);
  return resolved || fallback;
};

function EventsAndStaySection({ siteMedia = {} }) {
  const eventTypes = [
    'Weddings',
    'Receptions',
    'Engagements',
    'Mehendi & Sangeet',
    'Birthday Celebrations',
    'Anniversary Celebrations',
  ];

  const stayFeatures = [
    'Luxury rooms for families and guests',
    'Comfortable accommodation with warm hospitality',
    'Complimentary breakfast included',
    'Independent stay bookings available',
  ];

  const textReveal = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: 0.12 + i * 0.08,
        ease: EASE_OUT,
      },
    }),
  };

  const lineRevealLeft = {
    hidden: { opacity: 0, x: -18 },
    visible: (i = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.55,
        delay: 0.28 + i * 0.08,
        ease: EASE_OUT,
      },
    }),
  };

  const lineRevealRight = {
    hidden: { opacity: 0, x: 18 },
    visible: (i = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.55,
        delay: 0.28 + i * 0.08,
        ease: EASE_OUT,
      },
    }),
  };

  return (
    <section className="events-stay-section sample-style-section">
      <div className="sample-style-top-wave" />
      <div className="sample-style-bottom-wave" />

      <div className="sample-style-leaf sample-style-leaf-left">
        <span className="leaf-stem" />
        <span className="leaf leaf-1" />
        <span className="leaf leaf-2" />
        <span className="leaf leaf-3" />
        <span className="leaf leaf-4" />
        <span className="leaf leaf-5" />
      </div>

      <div className="sample-style-leaf sample-style-leaf-right">
        <span className="leaf-stem" />
        <span className="leaf leaf-1" />
        <span className="leaf leaf-2" />
        <span className="leaf leaf-3" />
        <span className="leaf leaf-4" />
        <span className="leaf leaf-5" />
      </div>

      <div className="events-stay-container sample-style-container">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="section-header sample-style-header"
        >
          <span className="sample-mini-label">AARNA Experience</span>

          <h2 className="section-title sample-style-title">
            Celebrate beautifully,
            <span> stay gracefully</span>
          </h2>

          <p className="section-subtitle sample-style-subtitle">
            A refined destination for celebrations, intimate gatherings, and
            elegant guest stays — all designed as one seamless experience.
          </p>

          <div className="sample-divider">
            <span className="sample-divider-line" />
            <span className="sample-divider-icon">✦</span>
            <span className="sample-divider-line" />
          </div>
        </motion.div>

        {/* EVENTS BLOCK */}
        <motion.div
          initial={{ opacity: 0, y: 54 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.18 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="sample-feature-block row-events"
        >
          <div className="sample-text-side">
            <motion.span
              className="sample-estd"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
            >
              • Signature Celebrations
            </motion.span>

            <motion.h3
              className="sample-feature-title"
              variants={textReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              custom={0}
            >
              Events crafted for unforgettable moments.
            </motion.h3>

            <motion.p
              className="sample-feature-intro"
              variants={textReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              custom={1}
            >
              From intimate family gatherings to grand wedding celebrations,
              Aarna offers a thoughtfully curated setting where every occasion
              feels elegant, warm, and unforgettable.
            </motion.p>

            <motion.div
              className="sample-quote-box"
              variants={textReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              custom={2}
            >
              <p>
                Designed for timeless celebrations, our event spaces combine
                refined aesthetics, graceful flow, and a welcoming atmosphere
                for every special occasion.
              </p>
            </motion.div>

            <div className="sample-feature-flow">
              {eventTypes.map((event, idx) => (
                <motion.div
                  key={event}
                  className="sample-feature-line"
                  variants={lineRevealLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false }}
                  custom={idx}
                >
                  <span className="sample-feature-accent" />
                  <span>{event}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.45, ease: EASE_OUT }}
            >
              <Link to="/contact" className="sample-gold-btn">
                <span>Plan Your Event</span>
                <span className="btn-arrow">→</span>
              </Link>
            </motion.div>
          </div>

          <div className="sample-visual-side">
            <motion.div
              className="sample-main-image-wrap"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              <div className="image-curtain-shell sample-image-shell">
                <img
                  src="/first.png"
                  alt="Elegant celebration setup"
                  className="sample-main-image"
                />
                <div className="refined-image-overlay" />
                <motion.div
                  className="curtain-reveal sample-curtain"
                  initial={{ scaleY: 1 }}
                  whileInView={{ scaleY: 0 }}
                  viewport={{ once: false, amount: 0.45 }}
                  transition={{ duration: 1.1, delay: 0.15, ease: EASE_OUT }}
                />
              </div>
            </motion.div>

            <motion.div
              className="sample-floating-image-card"
              initial={{ opacity: 0, x: 24, y: 24, scale: 0.94 }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
            >
              <img
                src="/second.png"
                alt="Outdoor celebration"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* STAY BLOCK */}
        <motion.div
          initial={{ opacity: 0, y: 54 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.18 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="sample-feature-block row-stay"
        >
          <div className="sample-visual-side">
            <motion.div
              className="sample-main-image-wrap"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              <div className="image-curtain-shell sample-image-shell">
                <img
                  src={mediaUrl(siteMedia.stayMainImage, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80')}
                  alt="Luxury stay rooms"
                  className="sample-main-image"
                />
                <div className="refined-image-overlay" />
                <motion.div
                  className="curtain-reveal sample-curtain"
                  initial={{ scaleY: 1 }}
                  whileInView={{ scaleY: 0 }}
                  viewport={{ once: false, amount: 0.45 }}
                  transition={{ duration: 1.1, delay: 0.15, ease: EASE_OUT }}
                />
              </div>
            </motion.div>

            <motion.div
              className="sample-floating-image-card sample-floating-image-card-left"
              initial={{ opacity: 0, x: -24, y: 24, scale: 0.94 }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
            >
              <img
                src={mediaUrl(siteMedia.stayFloatImage, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80')}
                alt="Premium suite"
              />
            </motion.div>
          </div>

          <div className="sample-text-side">
            <motion.span
              className="sample-estd"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
            >
              • Elegant Guest Stay
            </motion.span>

            <motion.h3
              className="sample-feature-title"
              variants={textReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              custom={0}
            >
              Stay spaces designed for calm and comfort.
            </motion.h3>

            <motion.p
              className="sample-feature-intro"
              variants={textReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              custom={1}
            >
              Designed for comfort and ease, our stay experience offers
              families, couples, and guests a calm and elegant place to relax
              throughout every celebration.
            </motion.p>

            <motion.div
              className="sample-quote-box"
              variants={textReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              custom={2}
            >
              <p>
                Our accommodation experience brings together warmth, privacy,
                and refined comfort so guests can enjoy every celebration with
                complete ease.
              </p>
            </motion.div>

            <div className="sample-feature-flow">
              {stayFeatures.map((feature, idx) => (
                <motion.div
                  key={feature}
                  className="sample-feature-line"
                  variants={lineRevealRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false }}
                  custom={idx}
                >
                  <span className="sample-feature-accent" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.45, ease: EASE_OUT }}
            >
              <Link to="/contact" className="sample-gold-btn">
                <span>Book Your Stay</span>
                <span className="btn-arrow">→</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DiscoverMoreAarnaSection() {
  return (
    <section className="discover-aarna-section">
      <div className="discover-aarna-shell">
        <motion.div
          className="discover-aarna-box"
          initial={{ opacity: 0, y: 38, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.22 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          <div className="discover-aarna-frame" />

          <motion.span
            className="discover-aarna-mini"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.22 }}
            transition={{ duration: 0.55, delay: 0.08, ease: EASE_OUT }}
          >
            DISCOVER MORE FROM{' '}
            <span className="aarna-brand discover-aarna-brand">aarna</span>
          </motion.span>

          <motion.h2
            className="discover-aarna-title"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.22 }}
            transition={{ duration: 0.65, delay: 0.14, ease: EASE_OUT }}
          >
            Discover more about{' '}
            <span className="aarna-brand discover-aarna-brand-title">aarna</span>
          </motion.h2>

          <motion.p
            className="discover-aarna-text"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.22 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE_OUT }}
          >
            Explore the story, spaces, and thoughtfully curated services that make
            Aarna a graceful destination for weddings, stays, and unforgettable
            celebrations.
          </motion.p>

          <motion.div
            className="discover-aarna-actions"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.22 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT }}
          >
            <Link to="/about#services-offered" className="discover-aarna-btn">
              Discover More
            </Link>
          </motion.div>

          <motion.div
            className="discover-aarna-dots"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.22 }}
            transition={{ duration: 0.6, delay: 0.4, ease: EASE_OUT }}
          >
            <span />
            <span />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME
   ═══════════════════════════════════════════════════════════ */
function Home() {
  const introVideoRef = useRef(null);
  const autoTimerRef = useRef(null);
  const progressTimerRef = useRef(null);
  const progressRafRef = useRef(null);
  const slideUpTimerRef = useRef(null);
  const transitionLockTimerRef = useRef(null);
  const overlayOpenTimerRef = useRef(null);
  const spacesSectionRef = useRef(null);
  const overlayScrollRef = useRef(null);
  const overlayContentRef = useRef(null);
  const activeCardImageRef = useRef(null);
  const overlayImageRef = useRef(null);
  const shouldScrollToSpacesRef = useRef(false);
  const shouldFocusActiveCardRef = useRef(false);

  const [siteMedia, setSiteMedia] = useState({});
  useEffect(() => { fetchSiteMedia().then(setSiteMedia).catch(() => {}); }, []);

  const [introVideoSrc, setIntroVideoSrc] = useState(landscapeVideo);
  const [heroReady, setHeroReady] = useState(false);
  const [splashActive, setSplashActive] = useState(true);
  const [spacesVisible, setSpacesVisible] = useState(false);
  const [spacesSlideUp, setSpacesSlideUp] = useState(false);

  const [isAnimatingToLogo, setIsAnimatingToLogo] = useState(false);

  const [activeSpace, setActiveSpace] = useState(1);

  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [openedSpace, setOpenedSpace] = useState(null);
  const [closingSpaceId, setClosingSpaceId] = useState(null);
  const [titleAnimationKey, setTitleAnimationKey] = useState(0);
  const [isOverlayOpening, setIsOverlayOpening] = useState(false);

  const [hasIntroPlayed, setHasIntroPlayed] = useState(() => {
    return sessionStorage.getItem('introVideoPlayed') === 'true';
  });

  const autoDuration = 3000;

  // Your existing static spaces (fallback)
  const ourSpaces = useMemo(
    () => [
      {
        id: 1,
        title: 'Grand Celebration Hall',
        location: 'Main Venue Block',
        eyebrow: 'Signature Venue',
        description:
          'A beautifully designed space ideal for lavish weddings and receptions, crafted for timeless celebrations and unforgettable moments.',
        longDescription:
          'Grand Celebration Hall is designed for lavish weddings, reception evenings, stage ceremonies, and large-scale family gatherings. The spacious layout supports elegant entry moments, premium seating flow, stage décor, and a refined guest experience throughout the celebration.',
        highlights: [
          'Spacious indoor celebration venue',
          'Ideal for weddings and receptions',
          'Designed for elegant stage setups',
        ],
        stats: [
          { label: 'Best For', value: 'Weddings & Receptions' },
          { label: 'Experience', value: 'Grand Indoor Venue' },
          { label: 'Mood', value: 'Classic Celebration' },
        ],
        image:'/ourspace_grandcelebration_hall.png',
      },
      {
        id: 2,
        title: 'Outdoor Lawn attached to the amphitheatre',
        location: 'Open Celebration Grounds',
        eyebrow: 'Open-Air Venue',
        description:
          'A scenic open setting perfect for mehendi, sangeet, and intimate gatherings, with a graceful atmosphere for elegant outdoor celebrations.',
        longDescription:
          'This outdoor lawn attached to the amphitheatre creates a graceful open-air celebration experience for mehendi, sangeet, welcome functions, and intimate wedding events. It combines scenic openness with an elegant event mood for memorable day and evening celebrations.',
        highlights: [
          'Perfect for mehendi and sangeet events',
          'Open-air celebratory atmosphere',
          'Beautiful outdoor gathering experience',
        ],
        stats: [
          { label: 'Best For', value: 'Mehendi & Sangeet' },
          { label: 'Experience', value: 'Open-Air Venue' },
          { label: 'Mood', value: 'Scenic & Festive' },
        ],
        image:
          '/ourspace_outdoor_lawn.png',
      },
      {
        id: 3,
        title: 'Dining Area',
        location: 'Guest Hospitality Zone',
        eyebrow: 'Hospitality Space',
        description:
          'Comfortable, spacious, and hygienic dining designed to offer a refined experience for your guests throughout the celebration.',
        longDescription:
          'The Dining Area is planned to deliver comfort, hygiene, and smooth hospitality for guests across every wedding event. It supports large gathering dining flow while maintaining a clean, organized, and refined setting for family and friends.',
        highlights: [
          'Spacious guest dining setup',
          'Comfortable and hygienic experience',
          'Supports seamless service flow',
        ],
        stats: [
          { label: 'Best For', value: 'Guest Dining' },
          { label: 'Experience', value: 'Comfort & Service' },
          { label: 'Mood', value: 'Warm Hospitality' },
        ],
        image:
          '/ourspace_dining.png',
      },
      {
        id: 4,
        title: 'Kalyani',
        location: 'Traditional Courtyard',
        eyebrow: 'Sacred Setting',
        description:
          'A serene and traditional water-feature setting that brings cultural charm and a sacred ambience to pre-wedding and ceremonial moments.',
        longDescription:
          'Kalyani brings a traditional and serene atmosphere that adds cultural grace to the venue experience. It is ideal for sacred, ritual-based, and pre-wedding moments where the setting itself becomes part of the celebration story.',
        highlights: [
          'Traditional and serene ambience',
          'Ideal for ritual-based moments',
          'Adds cultural depth to celebrations',
        ],
        stats: [
          { label: 'Best For', value: 'Sacred Ritual Moments' },
          { label: 'Experience', value: 'Traditional Setting' },
          { label: 'Mood', value: 'Serene & Spiritual' },
        ],
        image:
          '/ourspace_kalyani.png',
      },
      {
        id: 5,
        title: 'Temple',
        location: 'Spiritual Venue Corner',
        eyebrow: 'Divine Space',
        description:
          'A divine and peaceful temple space for sacred rituals, blessings, and spiritually meaningful wedding traditions.',
        longDescription:
          'The Temple offers a peaceful and divine atmosphere for blessings, sacred rituals, and spiritually meaningful wedding customs. It adds a devotional element to the venue and creates a beautiful setting for traditional ceremonies.',
        highlights: [
          'Suitable for sacred rituals and blessings',
          'Peaceful spiritual atmosphere',
          'Enhances traditional wedding customs',
        ],
        stats: [
          { label: 'Best For', value: 'Blessings & Rituals' },
          { label: 'Experience', value: 'Temple Setting' },
          { label: 'Mood', value: 'Divine & Peaceful' },
        ],
        image:
          '/ourspace_temple.png',
      },
      {
        id: 6,
        title: 'Complimentary Rooms for Bride & Groom',
        location: 'Private Comfort Suite',
        eyebrow: 'Luxury Comfort',
        description:
          'Elegantly prepared complimentary rooms for the bride and groom to relax, get ready, and enjoy comfort and privacy on their special day.',
        longDescription:
          'These complimentary rooms for the bride and groom are prepared for privacy, comfort, and a calm getting-ready experience. They support wedding-day preparation, relaxation, and personal moments before and after the main celebration events.',
        highlights: [
          'Private preparation and relaxation space',
          'Designed for bride and groom comfort',
          'Ideal for wedding-day readiness',
        ],
        stats: [
          { label: 'Best For', value: 'Bride & Groom Stay' },
          { label: 'Experience', value: 'Comfort & Privacy' },
          { label: 'Mood', value: 'Elegant & Calm' },
        ],
        image:
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
      },
      {
        id: 7,
        title: 'Guest Accommodation Rooms',
        location: 'Stay & Hospitality Wing',
        eyebrow: 'Guest Stay',
        description:
          'Well-appointed guest accommodation rooms designed to offer convenience, comfort, and a pleasant stay for family and friends.',
        longDescription:
          'Guest Accommodation Rooms are designed to make family and friends feel comfortable, welcomed, and well cared for throughout the celebration. They provide convenient stay options and support a complete destination wedding experience.',
        highlights: [
          'Comfortable stay for family and guests',
          'Convenient on-site accommodation',
          'Supports destination wedding hosting',
        ],
        stats: [
          { label: 'Best For', value: 'Family & Guest Stay' },
          { label: 'Experience', value: 'Convenient Accommodation' },
          { label: 'Mood', value: 'Welcoming & Relaxed' },
        ],
        image:
          'ourspace_guest_accommodation_room.png',
      },
      {
        id: 8,
        title: 'Well Equipped Kitchen',
        location: 'Service & Catering Zone',
        eyebrow: 'Operational Support',
        description:
          'A spacious and well equipped kitchen setup that supports seamless catering operations for weddings, celebrations, and large gatherings.',
        longDescription:
          'The Well Equipped Kitchen is built to support efficient catering operations for weddings and large gatherings. It helps maintain smooth food preparation, organized service execution, and consistent hospitality support behind every successful event.',
        highlights: [
          'Supports seamless catering operations',
          'Spacious and efficient kitchen setup',
          'Built for large celebration requirements',
        ],
        stats: [
          { label: 'Best For', value: 'Catering Support' },
          { label: 'Experience', value: 'Operational Efficiency' },
          { label: 'Mood', value: 'Organized & Functional' },
        ],
        image:
          '/ourspace_wellequiped_kitchen.png',
      },
    ],
    []
  );

  // Get admin sections from backend (if any)
  const { sections: adminSections, loading: sectionsLoading } = useSections();

  // Always use backend sections (pre-populated with defaults)
  const localSpaceImages = useMemo(() => [
    '/ourspace_grandcelebration_hall.png',
    '/ourspace_outdoor_lawn.png',
    '/ourspace_dining.png',
    '/ourspace_kalyani.png',
    '/ourspace_temple.png',
    null,
    '/ourspace_guest_accommodation_room.png',
    '/ourspace_wellequiped_kitchen.png',
  ], []);
  const baseSpaces = adminSections.length > 0 ? adminSections : ourSpaces;
  const finalSpaces = useMemo(
    () => baseSpaces.map((space, index) => ({
      ...space,
      image: space.image || localSpaceImages[index],
    })),
    [baseSpaces, localSpaceImages]
  );

  // Reset activeSpace to first item when sections load with different IDs
  useEffect(() => {
    if (finalSpaces.length > 0) {
      const found = finalSpaces.findIndex((s) => String(s.id) === String(activeSpace));
      if (found === -1) setActiveSpace(finalSpaces[0].id);
    }
  }, [finalSpaces]);

  const wrapIndex = useCallback((idx, len) => (idx + len) % len, []);
  const activeIndex = finalSpaces.findIndex((s) => String(s.id) === String(activeSpace));
  const activeItem = finalSpaces[activeIndex];

  const visibleCards = useMemo(
    () => [
      finalSpaces[wrapIndex(activeIndex - 1, finalSpaces.length)],
      finalSpaces[wrapIndex(activeIndex, finalSpaces.length)],
      finalSpaces[wrapIndex(activeIndex + 1, finalSpaces.length)],
    ],
    [activeIndex, finalSpaces, wrapIndex]
  );

  const clearTimers = useCallback(() => {
    if (autoTimerRef.current) window.clearInterval(autoTimerRef.current);
    if (progressTimerRef.current) window.clearInterval(progressTimerRef.current);
    if (progressRafRef.current) window.cancelAnimationFrame(progressRafRef.current);
    if (slideUpTimerRef.current) window.clearTimeout(slideUpTimerRef.current);
    if (overlayOpenTimerRef.current) window.clearTimeout(overlayOpenTimerRef.current);
  }, []);

  const triggerCardTransition = useCallback((nextId) => {
    setIsAnimating(true);
    setActiveSpace(nextId);
    setProgress(0);
    setTitleAnimationKey((k) => k + 1);
    if (transitionLockTimerRef.current) window.clearTimeout(transitionLockTimerRef.current);
    transitionLockTimerRef.current = window.setTimeout(() => setIsAnimating(false), 620);
  }, []);

  const goNext = useCallback(() => {
    if (isAnimating || openedSpace) return;
    const ci = finalSpaces.findIndex((s) => String(s.id) === String(activeSpace));
    const nextId = finalSpaces[wrapIndex(ci + 1, finalSpaces.length)].id;
    triggerCardTransition(nextId);
  }, [activeSpace, isAnimating, openedSpace, finalSpaces, triggerCardTransition, wrapIndex]);

  const goPrev = useCallback(() => {
    if (isAnimating || openedSpace) return;
    const ci = finalSpaces.findIndex((s) => String(s.id) === String(activeSpace));
    const nextId = finalSpaces[wrapIndex(ci - 1, finalSpaces.length)].id;
    triggerCardTransition(nextId);
  }, [activeSpace, isAnimating, openedSpace, finalSpaces, triggerCardTransition, wrapIndex]);

  const handleSelectSpace = useCallback(
    (space, isCenter) => {
      if (isCenter) {
        setActiveSpace(space.id);
        setIsOverlayOpening(true);
        setOpenedSpace(space);
        if (overlayOpenTimerRef.current) window.clearTimeout(overlayOpenTimerRef.current);
        overlayOpenTimerRef.current = window.setTimeout(() => setIsOverlayOpening(false), 800);
        return;
      }

      if (isAnimating || openedSpace) return;
      triggerCardTransition(space.id);
    },
    [isAnimating, openedSpace, triggerCardTransition]
  );

  const startAutoPlay = useCallback(() => {
    clearTimers();
    setProgress(0);
    if (isPaused || openedSpace) return;
    const t0 = performance.now();
    const tick = (now) => {
      const elapsed = now - t0;
      const nextProgress = Math.min((elapsed / autoDuration) * 100, 100);
      setProgress(nextProgress);
      if (nextProgress < 100 && !isPaused && !openedSpace) {
        progressRafRef.current = window.requestAnimationFrame(tick);
      }
    };
    progressRafRef.current = window.requestAnimationFrame(tick);
    autoTimerRef.current = window.setInterval(goNext, autoDuration);
  }, [autoDuration, clearTimers, goNext, isPaused, openedSpace]);

  useEffect(() => {
    const preloaded = [];
    finalSpaces.forEach((space) => {
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'eager';
      img.src = space.image;
      preloaded.push(img);
    });
    return () => {
      preloaded.length = 0;
    };
  }, [finalSpaces]);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem('introVideoPlayed', 'true');

    window.dispatchEvent(new Event('hideRealLogo'));

    setTimeout(() => {
      setIsAnimatingToLogo(true);

      setTimeout(() => {
        setHeroReady(true);

        setTimeout(() => {
          setSplashActive(false);
          window.dispatchEvent(new Event('showRealLogo'));
          setIsAnimatingToLogo(false);

          window.scrollTo({ top: 0, behavior: 'instant' });
        }, 180);

        slideUpTimerRef.current = setTimeout(() => {
          setSpacesVisible(true);
          setSpacesSlideUp(true);
        }, 3200);
      }, 1300);
    }, 220);
  }, []);

  const handleBackToSpaces = useCallback(() => {
    if (!openedSpace) return;

    setClosingSpaceId(openedSpace.id);
    setOpenedSpace(null);
    setIsOverlayOpening(false);
    shouldScrollToSpacesRef.current = true;
    shouldFocusActiveCardRef.current = true;
  }, [openedSpace]);

  useEffect(() => {
    if (!openedSpace) return;

    window.history.pushState({ modalOpen: true, spaceId: openedSpace.id }, '');

    const handlePopState = (event) => {
      if (openedSpace) {
        handleBackToSpaces();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      const stillOnHome =
        window.location.hash === '#/' || window.location.hash === '#';
      if (window.history.state?.modalOpen && stillOnHome) {
        window.history.back();
      }
    };
  }, [openedSpace, handleBackToSpaces]);

  const handleExploreContent = useCallback(() => {
    if (!overlayScrollRef.current || !overlayContentRef.current) return;
    const containerTop = overlayScrollRef.current.getBoundingClientRect().top;
    const contentTop = overlayContentRef.current.getBoundingClientRect().top;
    const delta = contentTop - containerTop;
    overlayScrollRef.current.scrollTo({
      top: Math.max(0, overlayScrollRef.current.scrollTop + delta - 12),
      behavior: 'smooth',
    });
  }, []);

  const smoothScrollToSpaces = useCallback(() => {
    if (!spacesSectionRef.current) return;

    requestAnimationFrame(() => {
      const element = spacesSectionRef.current;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY;

      window.scrollTo({
        top: offsetPosition - 80,
        behavior: 'smooth'
      });
    });
  }, []);

  const addRipple = useCallback((e) => {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const pt = e.touches?.[0] ?? e.changedTouches?.[0] ?? e;
    const size = Math.max(rect.width, rect.height) * 2;
    circle.style.cssText = `width:${size}px;height:${size}px;left:${pt.clientX - rect.left - size / 2
      }px;top:${pt.clientY - rect.top - size / 2}px`;
    circle.classList.add('ripple');
    const existingRipple = btn.getElementsByClassName('ripple')[0];
    if (existingRipple) existingRipple.remove();
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 700);
  }, []);

  useEffect(() => {
    if (!splashActive && heroReady) {
      window.scrollTo({ top: 0, behavior: 'instant' });

      const autoScrollTimer = setTimeout(() => {
        if (spacesSectionRef.current) {
          smoothScrollToSpaces();
        }
      }, 3000);

      return () => clearTimeout(autoScrollTimer);
    }
  }, [splashActive, heroReady, smoothScrollToSpaces]);

  useEffect(() => {
    if (hasIntroPlayed) {
      setSplashActive(false);
      setHeroReady(true);
      setSpacesVisible(true);
      setSpacesSlideUp(true);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [hasIntroPlayed]);

  useEffect(() => {
    const updateVideoSource = () => {
      const isMobile = window.innerWidth <= 768;
      const dynPortrait = mediaUrl(siteMedia.heroVideoPortrait, portraitVideo);
      const dynLandscape = mediaUrl(siteMedia.heroVideoLandscape, landscapeVideo);
      setIntroVideoSrc(isMobile ? dynPortrait : dynLandscape);
    };
    updateVideoSource();
    window.addEventListener('resize', updateVideoSource);
    return () => window.removeEventListener('resize', updateVideoSource);
  }, [siteMedia.heroVideoLandscape, siteMedia.heroVideoPortrait]);

  useEffect(() => {
    document.title = 'Aarna – The Perfect Wedding Destination';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Aarna – Where tradition meets trends and every celebration becomes a timeless memory.'
      );
  }, []);
  
  useEffect(() => {
    if (!spacesVisible) return;
    startAutoPlay();
    return () => clearTimers();
  }, [activeSpace, spacesVisible, startAutoPlay, clearTimers, isPaused, openedSpace]);

  useEffect(() => {
    if (!openedSpace) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (overlayScrollRef.current) overlayScrollRef.current.scrollTop = 0;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleBackToSpaces();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openedSpace, handleBackToSpaces]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(
    () => () => {
      if (transitionLockTimerRef.current) window.clearTimeout(transitionLockTimerRef.current);
    },
    []
  );

  return (
    <LayoutGroup>
      <div className="home-page">
        <AnimatePresence>
          {splashActive && (
            <motion.div
              className="hero-stage"
              initial={{ opacity: 1, scale: 1, y: 0, borderRadius: '0px' }}
              animate={
                isAnimatingToLogo
                  ? {
                    opacity: 0,
                    scale: 0.9,
                    y: -32,
                    borderRadius: '24px',
                  }
                  : {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    borderRadius: '0px',
                  }
              }
              exit={{ opacity: 0 }}
              transition={{ duration: 1.15, ease: EASE_OUT }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                overflow: 'hidden',
                pointerEvents: 'none',
                transformOrigin: 'center center',
              }}
            >
              <div className="intro-video-splash" style={{ width: '100%', height: '100%' }}>
                <video
                  ref={introVideoRef}
                  className="intro-video"
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  onEnded={handleIntroComplete}
                  key={introVideoSrc}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                >
                  <source src={introVideoSrc} type="video/mp4" />
                </video>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!splashActive && (
          <>
            <section className="hero-section">
              <div className="hero-overlay" />
              <div className="hero-light-orb hero-light-orb-1" />
              <div className="hero-light-orb hero-light-orb-2" />

              <div className={`hero-content ${heroReady ? 'ready' : ''}`}>
                <div className="hero-container">
                  <div className="hero-left">
                    <div className="coming-soon-wrapper">
                      <span className="hero-subtitle">Exclusive Launch</span>
                      <div className="coming-soon-badge">
                        <span className="coming-soon-pill">Launching Soon</span>
                      </div>
                      <h1 className="coming-soon-title coming-soon-highlight">
                        <span className="title-line">COMING</span>
                        <span className="title-line">SOON</span>
                      </h1>
                      <p className="coming-soon-note">
                        {siteMedia.heroComingSoon || 'Crafted for elegant weddings, refined celebrations, and unforgettable memories.'}
                      </p>
                    </div>
                  </div>

                  <div className="hero-right">
                    <span className="hero-tagline">
                      <span className="highlight brand-font">AARNA</span> {siteMedia.heroTagline ? siteMedia.heroTagline.replace('AARNA ', '').replace('AARNA', '') : 'WEDDING DESTINATION'}
                    </span>
                    <h2 className="hero-luxury-title">
                      {(siteMedia.heroTitle || 'The Perfect Wedding Destination and Resort').split(' ').reduce((acc, word, i, arr) => {
                        if (i % 3 === 0) acc.push(<span key={i} className="title-word">{arr.slice(i, i + 3).join(' ')}</span>);
                        return acc;
                      }, [])}
                    </h2>
                    <p className="hero-intro-text">
                      {siteMedia.heroSubtitle || 'Where tradition meets trends and every celebration becomes a timeless experience.'}
                    </p>
                    <div className="hero-action-box">
                      <Link
                        to="/contact"
                        className="btn-maroon-light"
                        onMouseDown={addRipple}
                        onTouchStart={addRipple}
                      >
                        Plan Your Dream Event
                      </Link>
                      <Link
                        to="/about"
                        className="btn-maroon-light-outline"
                        onMouseDown={addRipple}
                        onTouchStart={addRipple}
                      >
                        Explore Our Story
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="hero-scroll-cue">
                  <span />
                </div>
              </div>
            </section>

            <section
              ref={spacesSectionRef}
              className={`our-spaces-showcase ${spacesVisible ? 'open' : ''} ${spacesSlideUp ? 'slide-up' : ''}`}
            >
              <div className="spaces-background">
                <motion.img
                  src={activeItem?.image}
                  alt={activeItem?.title}
                  className="spaces-background-image"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: EASE_OUT }}
                />
                <motion.div
                  className="spaces-bg-gradient-overlay"
                  animate={{ opacity: [0.85, 1, 0.9] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="spaces-bg-dark" />
                <div className="spaces-bg-gradient" />
                <div className="spaces-bg-bottom" />
              </div>

              <div className="spaces-ambient-layer">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className={`spaces-ambient-orb orb-${i + 1}`}
                    animate={{
                      y: [0, i === 1 ? -24 : 18, 0],
                      x: [0, i === 1 ? -20 : 14, 0],
                      opacity: [0.14, 0.22, 0.14],
                    }}
                    transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ))}
              </div>

              <div className="spaces-content-shell">
                <div className="spaces-main-grid">
                  <motion.div
                    key={`copy-${activeItem?.id}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="spaces-copy-column"
                  >
                    <p className="spaces-section-heading">OUR SPACES</p>
                    <p className="spaces-eyebrow">{activeItem?.eyebrow}</p>

                    <div className="spaces-title-block">
                      <div className="spaces-main-title-wrapper">
                        <h2 className="spaces-main-title-animated">
                          <AnimatedTitle
                            text={activeItem?.title || ''}
                            delay={0}
                            key={`title-${activeItem?.id}-${titleAnimationKey}`}
                          />
                        </h2>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.55,
                        delay: 0.3,
                        ease: EASE_OUT,
                      }}
                      className="spaces-location"
                    >
                      <span className="spaces-location-dot" />
                      <span>{activeItem?.location}</span>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.38,
                        ease: EASE_OUT,
                      }}
                      className="spaces-main-description"
                    >
                      {activeItem?.description}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.48,
                        ease: EASE_OUT,
                      }}
                      className="spaces-action-row"
                    >
                      <button
                        type="button"
                        className="spaces-primary-action button-pill button-fancy"
                        onClick={() => handleSelectSpace(activeItem, true)}
                      >
                        <span className="button-star">✦</span>
                        <span>Explore Space</span>
                      </button>
                      <button
                        type="button"
                        className="spaces-secondary-action button-pill button-fancy button-ghost"
                        onClick={goNext}
                      >
                        <span>Next Space</span>
                        <span className="button-arrow">→</span>
                      </button>
                    </motion.div>
                  </motion.div>

                  <div
                    className="spaces-cards-column"
                  >
                    <div className="spaces-cards-row">
                      {visibleCards.map((space, index) => {
                        const isCenter = index === 1;

                        return (
                          <motion.button
                            type="button"
                            key={space.id}
                            onClick={() => handleSelectSpace(space, isCenter)}
                            whileTap={{ scale: 0.99 }}
                            whileHover={
                              isAnimating
                                ? undefined
                                : {
                                  y: isCenter ? -6 : -2,
                                }
                            }
                            animate={{
                              scale: isCenter ? 1.015 : 0.985,
                              y: isCenter ? -4 : 0,
                              opacity: isCenter ? 1 : 0.86,
                            }}
                            transition={{
                              type: 'tween',
                              duration: 0.62,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            style={{
                              transformOrigin:
                                index === 0
                                  ? 'right center'
                                  : index === 2
                                    ? 'left center'
                                    : 'center center',
                              willChange: 'transform, opacity',
                            }}
                            className={`space-thumb-card ${isCenter ? 'is-center' : 'is-side'}`}
                          >
                            <motion.img
                              layoutId={
                                openedSpace?.id === space.id || closingSpaceId === space.id
                                  ? `space-image-${space.id}`
                                  : undefined
                              }
                              src={space.image}
                              alt={space.title}
                              className="space-thumb-photo"
                              ref={isCenter ? activeCardImageRef : null}
                              loading={isCenter ? 'eager' : 'lazy'}
                              decoding="async"
                              animate={{ scale: isCenter ? 1.01 : 1 }}
                              whileHover={{ scale: 1.05 }}
                              transition={{
                                layout: {
                                  duration: 0.7,
                                  ease: [0.22, 1, 0.36, 1],
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 40
                                },
                                scale: { duration: 0.4, ease: EASE_OUT }
                              }}
                            />

                            {isCenter && (
                              <motion.div
                                className="space-thumb-text"
                                initial={false}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                }}
                                transition={{ duration: 0.55, ease: EASE_SMOOTH }}
                              >
                                <CardTitle
                                  text={space.title}
                                  isActive
                                  triggerKey={titleAnimationKey}
                                />

                                <motion.div
                                  key={`open-${space.id}-${activeSpace}`}
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    delay: 0.12,
                                    duration: 0.45,
                                    ease: EASE_OUT,
                                  }}
                                  className="space-thumb-open space-thumb-open-pill"
                                >
                                  Open venue
                                  <span className="space-thumb-open-arrow">↗</span>
                                </motion.div>
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="spaces-controls-row">
                      <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: EASE_OUT }}
                        className="spaces-nav-label"
                      >
                        Curated celebration spaces
                      </motion.div>

                      <div className="spaces-controls">
                        <button
                          type="button"
                          onClick={goPrev}
                          className="spaces-arrow button-pill icon-button"
                          aria-label="Previous space"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={goNext}
                          className="spaces-arrow button-pill icon-button"
                          aria-label="Next space"
                        >
                          →
                        </button>
                      </div>

                      <div className="spaces-indicators">
                        {finalSpaces.map((space, idx) => {
                          const isActive = idx === activeIndex;
                          return (
                            <button
                              type="button"
                              key={space.id}
                              onClick={() => {
                                if (isAnimating || openedSpace) return;
                                triggerCardTransition(space.id);
                              }}
                              className="spaces-indicator-button"
                              aria-label={`Go to ${space.title}`}
                            >
                              <div className="spaces-indicator-track">
                                <motion.div
                                  className="spaces-indicator-fill"
                                  animate={{ width: isActive ? `${progress}%` : '0%' }}
                                  transition={{ duration: 0.1, ease: 'linear' }}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Events & Stay Section */}
            <EventsAndStaySection siteMedia={siteMedia} />
            <DiscoverMoreAarnaSection />
            <AnimatePresence
              onExitComplete={() => {
                setClosingSpaceId(null);
                if (shouldScrollToSpacesRef.current && spacesSectionRef.current) {
                  spacesSectionRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  });
                }

                if (shouldFocusActiveCardRef.current) {
                  window.setTimeout(() => {
                    const activeCard = document.querySelector(
                      '.spaces-cards-row .space-thumb-card.is-center'
                    );
                    if (activeCard) {
                      activeCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center',
                      });
                    }
                  }, 120);
                }

                shouldScrollToSpacesRef.current = false;
                shouldFocusActiveCardRef.current = false;
              }}
            >
              {openedSpace && (
                <motion.div
                  key={`overlay-${openedSpace.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className="spaces-overlay-root"
                >
                  <motion.div
                    className="spaces-overlay-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE_GENTLE }}
                    onClick={handleBackToSpaces}
                  />

                  <motion.button
                    type="button"
                    onClick={handleBackToSpaces}
                    className="overlay-close-btn"
                    aria-label="Close"
                    initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.85, rotate: 90 }}
                    transition={{ duration: 0.3, delay: 0.1, ease: EASE_OUT }}
                  >
                    ×
                  </motion.button>

                  <div ref={overlayScrollRef} className="spaces-overlay-scroll">
                    <OverlayHero
                      space={openedSpace}
                      containerRef={overlayScrollRef}
                      sharedImageRef={overlayImageRef}
                      onBack={handleBackToSpaces}
                      onExplore={handleExploreContent}
                    />
                    <div ref={overlayContentRef}>
                      <OverlayContent
                        space={openedSpace}
                        onBack={handleBackToSpaces}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </LayoutGroup >
  );
}

export default Home;
