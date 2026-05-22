import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/About.css';
import { useServices } from '../hooks/useService';
import { useSettings } from '../hooks/useSettings';
import { usePageSeo } from '../hooks/usePageSeo';
import { fetchSiteMedia, resolveMediaUrl } from '../services/api';

const EASE_OUT = [0.22, 1, 0.36, 1];

// UPDATED DELAYS
const OPEN_DURATION_MS = 2000;      // 2 seconds for cover opening
const TURN_DURATION_MS = 1600;       // 1.6 seconds for page turns
const PAGE_PAUSE_MS = 1800;          // 1.8 seconds pause between pages
const END_PAUSE_MS = 2500;           // 2.5 seconds at end
const START_DELAY_MS = 800;          // 800ms delay before book starts

const mediaUrl = (val, fallback) => {
  const resolved = resolveMediaUrl(val);
  return resolved || fallback;
};

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay');
            if (delay) entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add('revealed');
          } else {
            entry.target.classList.remove('revealed');
            entry.target.style.transitionDelay = '';
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

function useTypingText(text, triggerKey, speed = 42, onComplete, enabled = true) {
  const [value, setValue] = useState('');
  const hasCompletedRef = useRef(false);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    if (!enabled) {
      setValue(textRef.current);
      return undefined;
    }

    if (hasCompletedRef.current) {
      setValue(textRef.current);
      return undefined;
    }

    let index = 0;
    setValue('');

    const timer = window.setInterval(() => {
      index += 1;
      setValue(textRef.current.slice(0, index));
      if (index >= textRef.current.length) {
        window.clearInterval(timer);
        hasCompletedRef.current = true;
        if (onComplete) onComplete();
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [triggerKey, speed, onComplete, enabled]);

  return value;
}

function TypingHeading({
  text,
  triggerKey,
  className = '',
  speed = 42,
  as: Tag = 'h3',
  enableTyping = true,
  onComplete,
}) {
  const typed = useTypingText(text, triggerKey, speed, onComplete, enableTyping);

  return (
    <Tag className={className}>
      {typed || text}
      {enableTyping && typed.length < text.length ? <span className="typing-cursor">|</span> : null}
    </Tag>
  );
}

const FloralCorner = ({ className = '' }) => (
  <div className={`book-floral ${className}`}>
    <svg
      viewBox="0 0 160 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 142c24-20 38-44 47-74 4-12 8-25 20-35 8-7 17-11 30-15" opacity=".75" />
      <path d="M35 134c14-9 28-23 39-43" opacity=".55" />
      <path d="M56 113c8-3 16-9 23-18" opacity=".55" />
      <path d="M73 93c8-12 10-26 20-37" opacity=".55" />
      <circle cx="76" cy="80" r="5" fill="currentColor" opacity=".24" />
    </svg>
  </div>
);

function RisingTypingText({ text, className = '', isActive = false }) {
  const words = text.split(' ');
  return (
    <span aria-label={text} className={`promise-rise-root ${className}`}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="promise-rise-word-shell">
          <motion.span
            className="promise-rise-word-inner"
            initial={{ y: '110%', opacity: 0 }}
            animate={isActive ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.68,
              delay: 0.12 + index * 0.06,
              ease: EASE_OUT,
            }}
          >
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function About() {
  useScrollReveal();
  usePageSeo({
    title: 'About Aarna',
    description:
      'Discover Aarna, a luxury wedding destination near Mysore offering elegant venues, curated services, and memorable celebrations.',
    routePath: '/about',
  });

  const introRef = useRef(null);
  const whyChooseRef = useRef(null);
  const servicesBookRef = useRef(null);
  const visionMissionRef = useRef(null);
  const promiseRef = useRef(null);
  const [activeReadableService, setActiveReadableService] = useState(0);
  const [serviceSlideIndex, setServiceSlideIndex] = useState(0);
  const serviceAutoRef = useRef(null);
  const [useCompactBookExperience, setUseCompactBookExperience] = useState(false);
  const [siteMedia, setSiteMedia] = useState({});

  // Get dynamic settings and services
  const { settings, loading: settingsLoading } = useSettings();
  const { services: adminServices, loading: servicesLoading } = useServices();

  useEffect(() => {
    fetchSiteMedia().then(setSiteMedia).catch(() => {});
  }, []);

  const heroImage = mediaUrl(
    siteMedia.aboutHeroImage,
    settings?.heroImage || '/about-hero.jpg'
  );
  const aboutIntroMainImage = mediaUrl(
    siteMedia.aboutIntroMainImage,
    settings?.aboutImage || '/first.png'
  );
  const aboutIntroFloatImage = mediaUrl(
    siteMedia.aboutIntroFloatImage,
    '/second.png'
  );
  const aboutPromiseImage = mediaUrl(
    siteMedia.aboutPromiseImage,
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=82'
  );

  const visionPoints = useMemo(
    () => [
      'Become a premier wedding destination',
      'Transform every celebration into a timeless, unforgettable experience',
      'Blend elegance, tradition, and modern luxury seamlessly',
      'Create moments that leave lasting impressions',
      'Set new standards in wedding celebrations',
    ],
    []
  );

  const missionPoints = useMemo(
    () => [
      'Create magical and personalized wedding experiences',
      'Offer exceptional venues and curated services',
      'Deliver impeccable hospitality',
      'Ensure attention to detail and aesthetic excellence',
      'Turn every dream celebration into reality with heartfelt service',
    ],
    []
  );


  const introTitleWords = 'The Perfect Wedding Destination'.split(' ');

  const scrollToWhyChoose = () => {
    if (!whyChooseRef.current) return;
    whyChooseRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // Static fallback services data (used when no admin services exist)
  const staticServicesData = useMemo(
    () => [
      {
        id: 1,
        title: 'Venue Arrangement',
        subtitle: 'Elegant spaces for every celebration',
        description:
          'Gracefully arranged venue settings designed for weddings, receptions, and intimate celebrations with a refined premium feel.',
        image: '/all_services.png',
        alt: 'Elegant wedding venue arrangement',
      },
      {
        id: 2,
        title: 'Catering Services',
        subtitle: 'Tasteful menus with refined presentation',
        description:
          'Curated dining experiences with beautiful presentation, warm hospitality, and flavours your guests will remember.',
        image: '/venue_arrangement.png',
        alt: 'Wedding catering presentation',
      },
      {
        id: 3,
        title: 'Wedding Décor',
        subtitle: 'Styled around your dream theme',
        description:
          'From floral styling to stage design, every décor detail is tailored to feel graceful, personal, and picture-perfect.',
        image: '/catering.png',
        alt: 'Wedding décor styling',
      },
      {
        id: 4,
        title: 'Lighting & Sound',
        subtitle: 'Beautiful ambiance with seamless execution',
        description:
          'Professional lighting and sound arrangements that make every ritual, entry, and celebration feel polished and grand.',
        image: '/wedding_decor.png',
        alt: 'Wedding lighting ambiance',
      },
      {
        id: 5,
        title: 'Event Planning',
        subtitle: 'Smooth coordination from start to finish',
        description:
          'Thoughtful planning and careful coordination so each moment flows beautifully and your day feels effortless.',
        image: '/lighting_sound.png',
        alt: 'Wedding event planning',
      },
      {
        id: 6,
        title: 'Room Booking',
        subtitle: 'Luxury stays for guests and family',
        description:
          'Elegantly designed rooms with modern amenities. Complimentary breakfast included. Book independently without any event requirement. Comfortable accommodation for your loved ones.',
        image: '/event_planning.png',
        alt: 'Luxury room booking',
      },
    ],
    []
  );

  // Use admin services if available, otherwise use static fallback
  const servicesData = adminServices.length > 0 ? adminServices : staticServicesData;

  const totalSlides = servicesData.length;

  const startServiceAutoPlay = () => {
    clearInterval(serviceAutoRef.current);
    serviceAutoRef.current = setInterval(() => {
      setServiceSlideIndex((prev) => (prev + 1) % totalSlides);
    }, 5200);
  };

  const stopServiceAutoPlay = () => {
    clearInterval(serviceAutoRef.current);
  };

  useEffect(() => {
    startServiceAutoPlay();
    return () => clearInterval(serviceAutoRef.current);
  }, [totalSlides]);

  const nextSlide = () => {
    stopServiceAutoPlay();
    setServiceSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    stopServiceAutoPlay();
    setServiceSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleReadablePrev = () => {
    setActiveReadableService((prev) =>
      prev === 0 ? servicesData.length - 1 : prev - 1
    );
  };

  const handleReadableNext = () => {
    setActiveReadableService((prev) =>
      prev === servicesData.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      if (introRef.current) {
        introRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const introInView = useInView(introRef, {
    once: false,
    amount: 0.35,
  });

  const visionMissionInView = useInView(visionMissionRef, {
    once: false,
    amount: 0.22,
  });

  const promiseInView = useInView(promiseRef, {
    once: false,
    amount: 0.2,
  });

  const servicesBookInView = useInView(servicesBookRef, {
    once: false,
    amount: 0.2,
  });

  const introTextControls = useAnimation();
  const introMainImageControls = useAnimation();
  const introSecondaryImageControls = useAnimation();

  useEffect(() => {
    if (introInView) {
      introTextControls.start('visible');

      const mainTimer = window.setTimeout(() => {
        introMainImageControls.start('visible');
      }, 380);

      const secondaryTimer = window.setTimeout(() => {
        introSecondaryImageControls.start('visible');
      }, 760);

      return () => {
        window.clearTimeout(mainTimer);
        window.clearTimeout(secondaryTimer);
      };
    } else {
      introTextControls.start('hidden');
      introMainImageControls.start('hidden');
      introSecondaryImageControls.start('hidden');
    }
  }, [introInView, introTextControls, introMainImageControls, introSecondaryImageControls]);

  const introTextContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.14,
      },
    },
  };

  const introFadeUp = {
    hidden: { opacity: 0, y: 34 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.88, ease: EASE_OUT },
    },
  };

  const introLineReveal = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: 60,
      opacity: 1,
      transition: { duration: 0.85, delay: 0.08, ease: EASE_OUT },
    },
  };

  const introMainImageVariant = {
    hidden: { opacity: 0, y: 40, scale: 1.05 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.08, ease: EASE_OUT },
    },
  };

  const introSecondaryImageVariant = {
    hidden: { opacity: 0, x: 30, y: 24, scale: 0.92, rotate: -2 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.95, ease: EASE_OUT },
    },
  };

  const introCurtainVariant = {
    hidden: { scaleX: 1 },
    visible: {
      scaleX: 0,
      transition: { duration: 1.15, ease: [0.77, 0, 0.18, 1] },
    },
  };

  const getOpenOffset = () => {
    if (typeof window === 'undefined') return 0;
    const w = window.innerWidth;
    if (w <= 380) return 70;
    if (w <= 520) return 84;
    if (w <= 768) return 110;
    if (w <= 1024) return 150;
    return 210;
  };

  const serviceBookPages = useMemo(
    () => {
      const bookImages = [
        '/our_signature_services.png',
        '/all_services.png',
        '/venue_arrangement.png',
        '/catering.png',
        '/wedding_decor.png',
        '/lighting_sound.png',
        '/event_planning.png',
      ];
      return [
        { id: 'cover', kind: 'cover' },
        { id: 'overview', kind: 'overview', image: bookImages[0], alt: 'Our signature services' },
        ...servicesData.map((service, index) => ({
          ...service,
          kind: 'service',
          image: service.image || bookImages[index + 1],
        })),
        { id: 'ep-image', kind: 'ep-image', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80', alt: 'Luxury room booking' },
        { id: 'end', kind: 'end' },
      ];
    },
    [servicesData]
  );

  const [serviceBookRotations, setServiceBookRotations] = useState(
    serviceBookPages.map(() => 0)
  );
  const [activeBookStep, setActiveBookStep] = useState(0);
  const [isBookAnimating, setIsBookAnimating] = useState(false);
  const isAnimatingRef = useRef(false);
  const [hasStartedBookSequence, setHasStartedBookSequence] = useState(false);
  const [bookLoopKey, setBookLoopKey] = useState(0);
  const [bookVisualOffset, setBookVisualOffset] = useState(0);
  const [shouldResetBook, setShouldResetBook] = useState(false);

  const activeBookStepRef = useRef(0);
  const serviceBookTimeoutsRef = useRef([]);
  const serviceBookAbortRef = useRef(false);
  const interactTimeoutRef = useRef(null);
  const typedBookHeadingsRef = useRef(new Set());
  const sequenceCompletedRef = useRef(false);
  const observerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncBookExperience = () => {
      setUseCompactBookExperience(reducedMotionQuery.matches);
    };

    syncBookExperience();

    reducedMotionQuery.addEventListener('change', syncBookExperience);

    return () => {
      reducedMotionQuery.removeEventListener('change', syncBookExperience);
    };
  }, []);

  useEffect(() => {
    setServiceBookRotations(serviceBookPages.map(() => 0));
    setActiveBookStep(0);
    activeBookStepRef.current = 0;
    setBookVisualOffset(0);
    typedBookHeadingsRef.current.clear();
    sequenceCompletedRef.current = false;
  }, [serviceBookPages]);

  useEffect(() => {
    activeBookStepRef.current = activeBookStep;
  }, [activeBookStep]);

  const updateBookVisualOffset = (step) => {
    const lastIndex = serviceBookPages.length - 1;
    if (step <= 0) {
      setBookVisualOffset(0);
    } else if (step >= serviceBookPages.length) {
      setBookVisualOffset(100);
    } else {
      setBookVisualOffset(50);
    }
  };

  useEffect(() => {
    const onResize = () => {
      updateBookVisualOffset(activeBookStepRef.current);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [serviceBookPages.length]);

  const clearServiceBookTimeouts = () => {
    serviceBookTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    serviceBookTimeoutsRef.current = [];
  };

  const applyBookStepInstant = (targetIndex) => {
    const clampedTarget = Math.max(0, Math.min(targetIndex, serviceBookPages.length - 1));
    setServiceBookRotations(
      serviceBookPages.map((_, index) => (index < clampedTarget ? -180 : 0))
    );
    setActiveBookStep(clampedTarget);
    activeBookStepRef.current = clampedTarget;
    updateBookVisualOffset(clampedTarget);
  };

  const waitForBook = (ms) =>
    new Promise((resolve) => {
      const id = window.setTimeout(resolve, ms);
      serviceBookTimeoutsRef.current.push(id);
    });

  const resetBook = () => {
    clearServiceBookTimeouts();
    serviceBookAbortRef.current = false;
    applyBookStepInstant(0);
    setIsBookAnimating(false);
    isAnimatingRef.current = false;
    sequenceCompletedRef.current = false;
    typedBookHeadingsRef.current.clear();
  };

  const setPageRotation = (index, value) => {
    setServiceBookRotations((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    if (value === -180) {
      const nextStep = index + 1;
      setActiveBookStep(nextStep);
      activeBookStepRef.current = nextStep;
      updateBookVisualOffset(nextStep);
    } else {
      const nextStep = index;
      setActiveBookStep(nextStep);
      activeBookStepRef.current = nextStep;
      updateBookVisualOffset(nextStep);
    }
  };

  const goToBookStep = async (targetIndex) => {
    if (targetIndex < 0 || targetIndex > serviceBookPages.length) return;
    if (isAnimatingRef.current) return;

    setIsBookAnimating(true);
    isAnimatingRef.current = true;
    serviceBookAbortRef.current = false;

    let current = activeBookStepRef.current;

    try {
      while (current < targetIndex) {
        const duration = current === 0 ? OPEN_DURATION_MS : TURN_DURATION_MS;
        setPageRotation(current, -180);
        await waitForBook(duration);
        if (serviceBookAbortRef.current) return;

        current += 1;

        if (current < targetIndex) {
          await waitForBook(PAGE_PAUSE_MS);
          if (serviceBookAbortRef.current) return;
        }
      }

      while (current > targetIndex) {
        const duration = current - 1 === 0 ? OPEN_DURATION_MS : TURN_DURATION_MS;
        setPageRotation(current - 1, 0);
        await waitForBook(duration);
        if (serviceBookAbortRef.current) return;

        current -= 1;

        if (current > targetIndex) {
          await waitForBook(PAGE_PAUSE_MS);
          if (serviceBookAbortRef.current) return;
        }
      }
    } finally {
      setIsBookAnimating(false);
      isAnimatingRef.current = false;
    }
  };

  const runBookSequence = async () => {
    if (sequenceCompletedRef.current && !shouldResetBook) return;

    sequenceCompletedRef.current = false;

    await goToBookStep(0);
    if (serviceBookAbortRef.current) return;
    await waitForBook(END_PAUSE_MS);
    if (serviceBookAbortRef.current) return;

    await goToBookStep(serviceBookPages.length);
    if (serviceBookAbortRef.current) return;

    await waitForBook(END_PAUSE_MS);
    if (serviceBookAbortRef.current) return;

    await goToBookStep(0);
    if (serviceBookAbortRef.current) return;

    sequenceCompletedRef.current = true;
    setShouldResetBook(false);
  };

  useEffect(() => {
    if (!servicesBookInView) {
      serviceBookAbortRef.current = true;
      clearServiceBookTimeouts();
      setIsBookAnimating(false);
      isAnimatingRef.current = false;
      setShouldResetBook(true);
      return;
    }

    if (useCompactBookExperience) {
      resetBook();
      setShouldResetBook(false);
      return undefined;
    }

    let mounted = true;

    const startSequence = async () => {
      await waitForBook(START_DELAY_MS);
      if (!mounted || !servicesBookInView) return;

      resetBook();
      await waitForBook(100);
      await runBookSequence();
    };

    startSequence();

    return () => {
      mounted = false;
      serviceBookAbortRef.current = true;
      clearServiceBookTimeouts();
    };
  }, [servicesBookInView, bookLoopKey, useCompactBookExperience]);

  useEffect(() => {
    return () => {
      serviceBookAbortRef.current = true;
      clearServiceBookTimeouts();
    };
  }, []);

  const stopAutoAndRun = async (targetIndex) => {
    if (useCompactBookExperience) {
      serviceBookAbortRef.current = true;
      clearServiceBookTimeouts();
      setIsBookAnimating(false);
      isAnimatingRef.current = false;
      applyBookStepInstant(targetIndex);
      return;
    }

    serviceBookAbortRef.current = true;
    clearServiceBookTimeouts();

    if (interactTimeoutRef.current) {
      clearTimeout(interactTimeoutRef.current);
    }

    await new Promise((r) => setTimeout(r, 60));
    setIsBookAnimating(false);
    isAnimatingRef.current = false;
    serviceBookAbortRef.current = false;

    await goToBookStep(targetIndex);

    if (!serviceBookAbortRef.current) {
      interactTimeoutRef.current = setTimeout(() => {
        setBookLoopKey((prev) => prev + 1);
      }, 4000);
    }
  };

  const handlePrevPage = () => {
    stopAutoAndRun(Math.max(activeBookStepRef.current - 1, 0));
  };

  const handleNextPage = () => {
    stopAutoAndRun(Math.min(activeBookStepRef.current + 1, serviceBookPages.length - 1));
  };

  const renderBookPageFront = (page) => {
    if (page.kind === 'cover') {
      return (
        <div className="book-cover-content">
          <h2 className="book-cover-brand-main">aarna</h2>
          <div className="book-cover-divider" />
          <p className="book-cover-tagline">where tradition meets trends</p>
        </div>
      );
    }

    if (page.kind === 'end') {
      return (
        <div className="book-cover-content">
          <span className="book-cover-mini">AARNA WEDDINGS</span>
          <h2 className="book-cover-end-title">Start Your Journey</h2>
          <div className="book-cover-divider" />
          <p style={{ color: 'rgba(255,255,255,0.9)', padding: '0 20px' }}>
            Let your celebration begin with timeless elegance at Aarna. We look forward to creating unforgettable moments with you.
          </p>
        </div>
      );
    }

    return (
      <div className="book-page-image">
        <img
          src={page.image || heroImage}
          alt={page.alt || page.title}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      </div>
    );
  };

  const renderBookPageBack = (page, index) => {
    const headingId = `${page.id}-heading`;
    const isBackFaceActive = index === Math.max(activeBookStep - 1, 0);
    const shouldTypeHeading =
      !useCompactBookExperience &&
      isBackFaceActive &&
      !typedBookHeadingsRef.current.has(headingId);
    const markTypedHeading = () => typedBookHeadingsRef.current.add(headingId);

    if (page.kind === 'cover') {
      return (
        <div className="book-page-text">
          <div className="book-frame-1" />
          <div className="book-frame-2" />
          <FloralCorner className="tl" />
          <FloralCorner className="br" />
          <div className="book-text-content">
            <div className="book-mini">AARNA WEDDINGS</div>
            <TypingHeading
              text="Our Signature Services at Aarna"
              triggerKey={`cover-back-${activeBookStep}-${shouldTypeHeading ? 'type' : 'done'}`}
              className="book-text-title"
              speed={36}
              as="h3"
              enableTyping={shouldTypeHeading}
              onComplete={markTypedHeading}
            />
            <div className="book-divider" />
            <p>
              At <span className="aarna-brand">aarna</span>, every celebration is supported with
              carefully planned services designed to create a graceful, seamless, and memorable
              wedding experience from start to finish.
            </p>
          </div>
        </div>
      );
    }

    if (page.kind === 'overview') {
      return (
        <div className="book-page-text book-page-text-overview">
          <div className="book-frame-1" />
          <div className="book-frame-2" />
          <FloralCorner className="tl" />
          <FloralCorner className="br" />
          <div className="book-text-content book-text-content-overview">
            <div className="book-mini">ALL SERVICES</div>
            <TypingHeading
              text="Wedding Destination Excellence"
              triggerKey={`overview-back-${activeBookStep}-${shouldTypeHeading ? 'type' : 'done'}`}
              className="book-text-title"
              speed={38}
              as="h3"
              enableTyping={shouldTypeHeading}
              onComplete={markTypedHeading}
            />
            <div className="book-divider" />
            <div className="book-overview-list">
              {servicesData.map((item) => (
                <div key={item.id} className="book-overview-item">
                  <h4>{item.title}</h4>
                  <p>{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (page.kind === 'ep-image') {
      return (
        <div className="book-page-text">
          <div className="book-frame-1" />
          <div className="book-frame-2" />
          <FloralCorner className="tl" />
          <FloralCorner className="br" />
          <div className="book-text-content">
            <div className="book-mini">AARNA MOMENTS</div>
            <TypingHeading
              text="Wedding Thoughts"
              triggerKey={`end-thoughts-${activeBookStep}-${shouldTypeHeading ? 'type' : 'done'}`}
              className="book-text-title"
              speed={40}
              as="h3"
              enableTyping={shouldTypeHeading}
              onComplete={markTypedHeading}
            />
            <div className="book-divider" />
            <p style={{ fontStyle: 'italic', marginBottom: '15px' }}>
              "A celebration is not just an event; it's a story of love, tradition, and new beginnings."
            </p>
            <p>
              Let your celebration begin with timeless elegance at Aarna. We look forward to
              creating unforgettable moments together.
            </p>
          </div>
        </div>
      );
    }

    if (page.kind === 'end') {
      return (
        <div className="book-cover-content">
          <span className="book-cover-mini">AARNA WEDDINGS</span>
          <h2 className="book-cover-brand-main" style={{ color: '#fff', fontSize: '3.2rem' }}>aarna</h2>
          <div className="book-cover-divider" />
          <p className="book-cover-tagline" style={{ color: 'rgba(255,255,255,0.8)' }}>
            "where tradition meets trends"
          </p>
        </div>
      );
    }

    return (
      <div className="book-page-text">
        <div className="book-frame-1" />
        <div className="book-frame-2" />
        <FloralCorner className="tl" />
        <FloralCorner className="br" />
        <div className="book-text-content">
          <div className="book-mini">OUR SIGNATURE OFFERINGS</div>
          <TypingHeading
            text={page.title}
            triggerKey={`${page.id}-${activeBookStep}-${shouldTypeHeading ? 'type' : 'done'}`}
            className="book-text-title"
            speed={42}
            as="h3"
            enableTyping={shouldTypeHeading}
            onComplete={markTypedHeading}
          />
          <div className="book-divider" />
          <h5 className="book-subtitle">{page.subtitle}</h5>
          <p>{page.description}</p>
        </div>
      </div>
    );
  };

  const getDynamicZIndex = (index, rotation) => {
    const total = serviceBookPages.length;
    const isTurned = rotation === -180;
    const isCurrentTurningZone =
      index === activeBookStep || index === activeBookStep - 1 || index === activeBookStep + 1;

    if (isCurrentTurningZone) return total + 20 - index;
    if (!isTurned) return total + 5 - index;
    return index + 1;
  };

  return (
    <main id="main-content" className="about-page">
      <section className="about-hero about-hero-slider">
        <div
          className="about-hero-slide about-hero-static-image"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="hero-bg-overlay" />

        <div className="container">
          <div className="about-hero-content" data-reveal>
            <span className="kicker-white">ABOUT US</span>
            <h1>Our Story</h1>
            <div className="gold-line-center" />
            <p>Where love meets elegance and celebrations turn into timeless memories.</p>
          </div>
        </div>
      </section>

      <section ref={introRef} className="intro-section intro-section-cinematic deferred-section">
        <div className="container">
          <div className="about-grid about-grid-cinematic">
            <motion.div
              className="about-text about-text-cinematic"
              variants={introTextContainer}
              initial="hidden"
              animate={introTextControls}
            >
              <motion.div className="kicker intro-kicker-cinematic" variants={introFadeUp}>
                WELCOME TO <span className="aarna-brand aarna-brand-kicker">aarna</span>
              </motion.div>

              <h2 className="about-title-cinematic">
                {introTitleWords.map((word, index) => (
                  <span key={`${word}-${index}`} className="about-title-word-shell">
                    <motion.span
                      className="about-title-word-inner"
                      initial={{ y: '110%', opacity: 0 }}
                      animate={introInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
                      transition={{
                        duration: 0.72,
                        delay: 0.18 + index * 0.08,
                        ease: [0.34, 1.2, 0.64, 1],
                      }}
                    >
                      {word}
                      {index < introTitleWords.length - 1 ? '\u00A0' : ''}
                    </motion.span>
                  </span>
                ))}
              </h2>

              <motion.div
                className="gold-rule intro-gold-rule-cinematic"
                variants={introLineReveal}
              />

              <motion.p variants={introFadeUp}>
                At <span className="aarna-brand">aarna</span>, we believe every wedding is a
                beautiful story waiting to be told. Nestled in a serene and elegant setting,
                <span className="aarna-brand"> aarna</span> offers the perfect blend of luxury,
                comfort, and tradition.
              </motion.p>

              <motion.p variants={introFadeUp}>
                From intimate ceremonies to grand celebrations, we create unforgettable experiences
                filled with joy, beauty, and perfection.
              </motion.p>
            </motion.div>

            <div className="about-image-cluster about-image-cluster-cinematic">
              <motion.div
                className="img-frame-main img-frame-main-cinematic"
                variants={introMainImageVariant}
                initial="hidden"
                animate={introMainImageControls}
              >
                <motion.div
                  className="img-frame-curtain-cinematic"
                  variants={introCurtainVariant}
                  initial="hidden"
                  animate={introMainImageControls}
                />

                <motion.img
                  src={aboutIntroMainImage}
                  alt="Aarna Wedding Venue"
                  className="img-main-cinematic"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  sizes="(max-width: 767px) 92vw, (max-width: 1199px) 64vw, 42vw"
                  initial={{ scale: 1.14 }}
                  animate={
                    introInView
                      ? {
                        scale: 1,
                        transition: {
                          duration: 1.7,
                          delay: 0.15,
                          ease: EASE_OUT,
                        },
                      }
                      : {}
                  }
                />

                <div className="img-frame-main-glow-cinematic" />
              </motion.div>

              <motion.div
                className="img-frame-secondary img-frame-secondary-cinematic"
                variants={introSecondaryImageVariant}
                initial="hidden"
                animate={introSecondaryImageControls}
              >
                <motion.img
                  src={aboutIntroFloatImage}
                  alt="Wedding décor"
                  className="img-secondary-cinematic"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  sizes="(max-width: 767px) 58vw, (max-width: 1199px) 36vw, 22vw"
                  initial={{ scale: 1.08 }}
                  animate={
                    introInView
                      ? {
                        scale: 1,
                        transition: {
                          duration: 1.15,
                          delay: 0.76,
                          ease: EASE_OUT,
                        },
                      }
                      : {}
                  }
                />
              </motion.div>
            </div>
          </div>

          <div className="intro-scroll-icon-wrap" data-reveal>
            <button
              type="button"
              className="scroll-down-icon intro-scroll-icon"
              onClick={scrollToWhyChoose}
              aria-label="Scroll to Why Choose Aarna section"
            >
              <span />
            </button>
          </div>
        </div>
      </section>

      <section ref={whyChooseRef} className="why-choose-about-section deferred-section">
        <div className="container">
          <div className="section-head-center" data-reveal>
            <span className="kicker">
              WHY CHOOSE <span className="aarna-brand aarna-brand-kicker">aarna</span>
            </span>
            <h2>Perfect for Your Special Day</h2>
            <div className="gold-line-center" />
          </div>

          <div className="features-showcase">
            {[
              {
                n: '01',
                title: 'Stunning Venue with Elegant Ambiance',
                copy:
                  'Our thoughtfully designed spaces create a beautiful backdrop where every ceremony feels warm, premium, and unforgettable.',
              },
              {
                n: '02',
                title: 'Perfect for Weddings, Receptions & Pre-Wedding Events',
                copy:
                  'From mehendi and haldi to sangeet and reception, every celebration is hosted with equal elegance and care.',
              },
              {
                n: '03',
                title: 'Customized Décor to Match Your Dream Theme',
                copy:
                  'We shape every visual detail around your story so the setting feels graceful, personal, and beautifully styled.',
              },
              {
                n: '04',
                title: 'Spacious and Comfortable Arrangements',
                copy:
                  'Spacious layouts and thoughtful planning ensure you and your guests celebrate in complete comfort.',
              },
              {
                n: '05',
                title: 'Dedicated Team for Seamless Execution',
                copy:
                  'Our experienced team carefully manages every detail so you can enjoy your day without stress.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.n}
                className="feature-showcase-item"
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.22 }}
                transition={{ duration: 0.62, delay: index * 0.05, ease: EASE_OUT }}
              >
                <div className="feature-number">{item.n}</div>
                <div className="feature-content">
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <div className="feature-underline" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={servicesBookRef} className="services-book-section">
        <div className="container services-container-wide">
          <div className="section-head-center services-main-head" data-reveal>
            <span className="kicker services-main-kicker">
              Services Offered At<span className="aarna-brand services-brand-inline">aarna</span>
            </span>
            <h2>Crafted for Beautiful Celebrations</h2>
            <div className="gold-line-center" />
          </div>

          <div className="reference-book-scene">
            <div className="reference-book-stage">
              <div className="reference-book-shadow" />

              <div
                className={`reference-book ${isBookAnimating ? 'is-animating' : ''} ${useCompactBookExperience ? 'is-compact' : ''} ${activeBookStep === 0 || activeBookStep >= serviceBookPages.length ? 'is-closed' : ''
                  }`}
                style={{
                  transform: `translateX(${bookVisualOffset}%) scale(${activeBookStep === 0 || activeBookStep >= serviceBookPages.length ? 1.04 : 1})`,
                }}
              >
                {serviceBookPages.map((page, index) => {
                  const rotation = serviceBookRotations[index];
                  const isCover = page.kind === 'cover';
                  const isEnd = page.kind === 'end';

                  return (
                    <div
                      key={page.id}
                      className={`reference-book-page ${isCover ? 'cover-sheet' : ''} ${isEnd ? 'end-sheet' : ''
                        }`}
                      style={{
                        zIndex: getDynamicZIndex(index, rotation),
                        transform: `rotateY(${rotation}deg)`,
                      }}
                    >
                      <div
                        className={`reference-book-face front ${isCover || isEnd ? 'cover-front r-right' : 'paper r-right'
                          }`}
                      >
                        {(isCover || isEnd) && <FloralCorner className="cover-flower tl" />}
                        {(isCover || isEnd) && <FloralCorner className="cover-flower br" />}
                        <div className="page-turn-shadow page-turn-shadow-front" />
                        {renderBookPageFront(page)}
                      </div>

                      <div
                        className={`reference-book-face back ${isCover ? 'cover-inside r-left' : isEnd ? 'cover-back r-left' : 'paper r-left'
                          }`}
                      >
                        <div className="page-turn-shadow page-turn-shadow-back" />
                        {renderBookPageBack(page, index)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="services-book-controls services-book-controls-outside"
              aria-label="Service book navigation"
            >
              <button
                type="button"
                className="services-book-arrow"
                onClick={handlePrevPage}
                aria-label="Previous service page"
              >
                ‹
              </button>

              <div className="services-book-dots" role="tablist" aria-label="Service pages">
                {serviceBookPages.map((page, index) => (
                  <button
                    key={page.id}
                    type="button"
                    className={`services-book-dot ${index === activeBookStep ? 'active' : ''}`}
                    aria-label={`Go to page ${index + 1}`}
                    aria-pressed={index === activeBookStep}
                    onClick={() => stopAutoAndRun(index)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="services-book-arrow"
                onClick={handleNextPage}
                aria-label="Next service page"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="services-offered-section">
        <div className="services-offered-curve services-offered-curve-top" />
        <div className="services-offered-curve services-offered-curve-bottom" />

        <div className="services-ornament services-ornament-top-left" />
        <div className="services-ornament services-ornament-top-right" />
        <div className="services-ornament services-ornament-bottom-left" />
        <div className="services-ornament services-ornament-bottom-right" />

        <div className="container services-container-wide">
          <div className="services-offered-head" data-reveal="left">
            <span className="services-offered-kicker">Aarna Wedding Destination</span>
            <h2>Services Offered at Aarna</h2>
            <div className="services-offered-head-line" />
            <p>
              Thoughtfully curated services designed to bring elegance, comfort, and
              smooth execution to every celebration.
            </p>
          </div>

          <div className="services-offered-grid">
            {servicesData.map((service, index) => (
              <article
                className="services-offered-card"
                key={service.id}
                data-reveal
                data-delay={index * 100}
              >
                <span className="services-offered-number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="services-offered-card-inner">
                  <h3>{service.title}</h3>
                  <p className="services-offered-subtitle">{service.subtitle}</p>
                  <p className="services-offered-description">{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section ref={visionMissionRef} className="about-vision-mission-section">
        <div className="about-vision-mission-orb about-vision-mission-orb-one" />
        <div className="about-vision-mission-orb about-vision-mission-orb-two" />

        <div className="container">
          <motion.div
            className="about-vision-mission-shell"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={visionMissionInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.95, ease: EASE_OUT }}
          >
            <motion.div
              className="about-vision-mission-head"
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={visionMissionInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.98 }}
              transition={{ duration: 0.78, ease: EASE_OUT }}
            >
              <TypingHeading
                text="THE HEART OF AARNA"
                triggerKey={`vision-mission-kicker-${visionMissionInView ? 'in' : 'out'}`}
                className="kicker about-vision-mission-kicker"
                speed={42}
                as="span"
              />
              <h2 className="about-vision-mission-title">
                <RisingTypingText
                  text="A timeless vision, guided by heartfelt purpose"
                  isActive={visionMissionInView}
                />
              </h2>
              <motion.div
                className="gold-rule about-vision-mission-rule"
                initial={{ width: 0, opacity: 0 }}
                animate={visionMissionInView ? { width: 74, opacity: 1 } : { width: 0, opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: EASE_OUT }}
              />
              <motion.p
                className="about-vision-mission-intro"
                initial={{ opacity: 0, y: 16 }}
                animate={visionMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.72, delay: 0.22, ease: EASE_OUT }}
              >
                At <span className="aarna-brand">aarna</span>, every celebration is shaped by a
                refined vision and a heartfelt mission to create wedding experiences that feel elegant,
                personal, and truly unforgettable.
              </motion.p>
              <TypingHeading
                text="Where elegance meets intention."
                triggerKey={`vision-mission-tagline-${visionMissionInView ? 'in' : 'out'}`}
                className="about-vision-mission-tagline"
                speed={34}
                as="p"
              />
            </motion.div>

            <div className={`about-vision-mission-bookstage ${visionMissionInView ? 'is-looping' : ''}`}>
              <div className="about-vision-mission-cover about-vision-mission-cover-left">
                <div className="about-vision-mission-cover-inner">
                  <span className="about-vision-mission-cover-kicker">Vision</span>
                  <span className="about-vision-mission-cover-brand">aarna</span>
                  <span className="about-vision-mission-cover-copy">A destination for timeless wedding celebrations</span>
                </div>
              </div>

              <div className="about-vision-mission-cover about-vision-mission-cover-right">
                <div className="about-vision-mission-cover-inner">
                  <span className="about-vision-mission-cover-kicker">Mission</span>
                  <span className="about-vision-mission-cover-brand">aarna</span>
                  <span className="about-vision-mission-cover-copy">Every dream celebration, crafted with care</span>
                </div>
              </div>

              <div className="about-vision-mission-seal" />

              <div className="about-vision-mission-spine" />

              <div className="about-vision-mission-grid">
              <article className="about-vision-card">
                <div className="about-vision-card-glow" />
                <TypingHeading
                  text="Vision of"
                  triggerKey={`vision-card-label-${visionMissionInView ? 'in' : 'out'}`}
                  className="about-vision-card-eyebrow"
                  speed={32}
                  as="span"
                />
                <span className="about-vision-card-label"><span className="aarna-brand">aarna</span></span>
                <ul className="about-vision-card-list">
                  {visionPoints.map((point, index) => (
                    <motion.li
                      key={point}
                      initial={{ opacity: 0, y: index % 2 === 0 ? 22 : -22 }}
                      animate={visionMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: index % 2 === 0 ? 22 : -22 }}
                      transition={{ duration: 0.58, delay: 0.22 + index * 0.08, ease: EASE_OUT }}
                    >
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </article>

              <article className="about-vision-card about-mission-card">
                <div className="about-vision-card-glow" />
                <TypingHeading
                  text="Mission of"
                  triggerKey={`mission-card-label-${visionMissionInView ? 'in' : 'out'}`}
                  className="about-vision-card-eyebrow"
                  speed={32}
                  as="span"
                />
                <span className="about-vision-card-label"><span className="aarna-brand">aarna</span></span>
                <ul className="about-vision-card-list">
                  {missionPoints.map((point, index) => (
                    <motion.li
                      key={point}
                      initial={{ opacity: 0, y: index % 2 === 0 ? -22 : 22 }}
                      animate={visionMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: index % 2 === 0 ? -22 : 22 }}
                      transition={{ duration: 0.58, delay: 0.28 + index * 0.08, ease: EASE_OUT }}
                    >
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </article>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={promiseRef} className="promise-ref-section deferred-section">
        <div className="container">
          <motion.div
            className="promise-ref-grid"
            initial={{ opacity: 0, y: 50 }}
            animate={promiseInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.95, ease: EASE_OUT }}
          >
            <motion.div
              className="promise-ref-image-wrap"
              initial={{ opacity: 0, x: -26 }}
              animate={promiseInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -26 }}
              transition={{ duration: 0.85, ease: EASE_OUT }}
            >
              <motion.img
                src={aboutPromiseImage}
                alt="Bride holding bouquet"
                className="promise-ref-image"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                sizes="(max-width: 991px) 100vw, 50vw"
                initial={{ scale: 1.08 }}
                animate={promiseInView ? { scale: 1 } : { scale: 1.08 }}
                transition={{ duration: 1.25, ease: EASE_OUT }}
              />
              <motion.div
                className="promise-ref-image-curtain promise-ref-image-curtain-left"
                initial={{ x: 0 }}
                animate={promiseInView ? { x: '-100%' } : { x: 0 }}
                transition={{ duration: 1.05, ease: [0.77, 0, 0.18, 1], delay: 0.08 }}
              />
              <motion.div
                className="promise-ref-image-curtain promise-ref-image-curtain-right"
                initial={{ x: 0 }}
                animate={promiseInView ? { x: '100%' } : { x: 0 }}
                transition={{ duration: 1.05, ease: [0.77, 0, 0.18, 1], delay: 0.08 }}
              />
            </motion.div>

            <div className="promise-ref-content-card">
              <motion.div
                className="promise-ref-content-inner"
                initial={{ opacity: 0, x: 26 }}
                animate={promiseInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 26 }}
                transition={{ duration: 0.85, ease: EASE_OUT }}
              >
                <TypingHeading
                  text="OUR PROMISE"
                  triggerKey={`promise-kicker-${promiseInView ? 'in' : 'out'}`}
                  className="kicker promise-kicker-dark promise-kicker-typing promise-kicker-visible"
                  speed={45}
                  as="span"
                />
                <h2 className="promise-title-ref">
                  <RisingTypingText
                    text="Every celebration, thoughtfully crafted"
                    isActive={promiseInView}
                  />
                </h2>
                <motion.div
                  className="gold-rule promise-gold-rule"
                  initial={{ width: 0, opacity: 0 }}
                  animate={promiseInView ? { width: 60, opacity: 1 } : { width: 0, opacity: 0 }}
                  transition={{ duration: 0.7, delay: 0.26, ease: EASE_OUT }}
                />
                <motion.p
                  className="promise-desc-ref"
                  initial={{ opacity: 0, y: 16 }}
                  animate={promiseInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT }}
                >
                  At <span className="aarna-brand">aarna</span>, we blend elegance, comfort, and
                  attention to detail so your most meaningful moments feel effortless, memorable, and
                  beautifully yours.
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
