import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePageSeo, SITE_URL } from '../hooks/usePageSeo';
import '../styles/Gallery.css';

const CATEGORY_DETAILS = {
  all: {
    label: 'All Photos',
    title: 'Wedding Gallery',
    description:
      'Explore Aarna venue photos featuring celebration halls, sacred spaces, guest stays, dining, and outdoor wedding settings near Mysore.',
  },
  venues: {
    label: 'Venues',
    title: 'Venue Gallery',
    description:
      'See Aarna signature venues including the grand celebration hall and elegant event spaces designed for weddings near Mysore.',
  },
  lawn: {
    label: 'Outdoor Lawn',
    title: 'Outdoor Lawn Gallery',
    description:
      'Browse the outdoor lawn and open-air celebration spaces at Aarna for mehendi, sangeet, receptions, and scenic gatherings.',
  },
  dining: {
    label: 'Dining',
    title: 'Dining Gallery',
    description:
      'View Aarna dining and hospitality spaces created for smooth guest service, elegant seating, and memorable celebration meals.',
  },
  kitchen: {
    label: 'Kitchen',
    title: 'Kitchen Gallery',
    description:
      'Explore Aarna kitchen and catering support spaces built for efficient hospitality, event preparation, and large celebrations.',
  },
  temple: {
    label: 'Temple & Kalyani',
    title: 'Temple Gallery',
    description:
      'Discover the sacred temple and serene Kalyani spaces at Aarna for rituals, blessings, and traditional wedding moments.',
  },
  stay: {
    label: 'Stay',
    title: 'Stay Gallery',
    description:
      'See guest accommodation and stay spaces at Aarna designed for comfort, privacy, and destination wedding hospitality.',
  },
};

const galleryData = [
  {
    id: 1,
    cat: 'venues',
    img: '/images/ourspace_grandcelebration_hall.png',
    label: 'Grand Celebration Hall',
    desc: 'Signature indoor venue for weddings, receptions, and large family celebrations.',
  },
  {
    id: 2,
    cat: 'venues',
    img: '/images/all_services.png',
    label: 'Curated Venue Styling',
    desc: 'Elegant styling details crafted for refined celebration experiences.',
  },
  {
    id: 3,
    cat: 'venues',
    img: '/images/about-hero.jpg',
    label: 'Aarna Arrival View',
    desc: 'A welcoming first impression that sets the tone for a premium event day.',
  },
  {
    id: 4,
    cat: 'lawn',
    img: '/images/ourspace_outdoor_lawn.png',
    label: 'Outdoor Celebration Lawn',
    desc: 'Open-air space for mehendi, sangeet, welcome events, and graceful evening gatherings.',
  },
  {
    id: 5,
    cat: 'lawn',
    img: '/images/venue_arrangement.png',
    label: 'Outdoor Event Setup',
    desc: 'Flexible lawn arrangements for ceremonies, guest seating, and festive styling.',
  },
  {
    id: 6,
    cat: 'dining',
    img: '/images/ourspace_dining.png',
    label: 'Dining Area',
    desc: 'Spacious guest dining designed for comfort, flow, and refined hospitality.',
  },
  {
    id: 7,
    cat: 'dining',
    img: '/images/catering.png',
    label: 'Hospitality Service',
    desc: 'Thoughtful food presentation and guest service throughout the celebration.',
  },
  {
    id: 8,
    cat: 'kitchen',
    img: '/images/ourspace_wellequiped_kitchen.png',
    label: 'Well Equipped Kitchen',
    desc: 'Operational support space built for smooth catering and high-capacity events.',
  },
  {
    id: 9,
    cat: 'kitchen',
    img: '/images/ourspce_well_equiped_kitchen.png',
    label: 'Catering Preparation Area',
    desc: 'A practical kitchen setup for efficient event-day food preparation and service.',
  },
  {
    id: 10,
    cat: 'temple',
    img: '/images/ourspace_temple.png',
    label: 'Temple Space',
    desc: 'A peaceful spiritual setting for sacred rituals, blessings, and traditional ceremonies.',
  },
  {
    id: 11,
    cat: 'temple',
    img: '/images/ourspace_kalyani.png',
    label: 'Kalyani',
    desc: 'A serene ritual space that adds cultural depth to wedding celebrations.',
  },
  {
    id: 12,
    cat: 'stay',
    img: '/images/ourspace_guest_accommodation_room.png',
    label: 'Guest Accommodation Room',
    desc: 'Comfortable stay spaces for family and guests attending destination celebrations.',
  },
  {
    id: 13,
    cat: 'stay',
    img: '/images/room_booking.png',
    label: 'Stay Booking Experience',
    desc: 'Accommodation support for wedding guests and private resort stays.',
  },
  {
    id: 14,
    cat: 'stay',
    img: '/images/first.png',
    label: 'Resort Stay Ambience',
    desc: 'Calm, polished spaces designed to make every stay feel effortless and welcoming.',
  },
];

function useGalleryAnimations() {
  const [scrollDir, setScrollDir] = useState('down');

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollDir(y > lastY ? 'down' : 'up');
      lastY = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const els = document.querySelectorAll('.gallery-item');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('in-view');
            el.classList.remove('enter-up', 'enter-down');
            el.classList.add(scrollDir === 'down' ? 'enter-down' : 'enter-up');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    els.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [scrollDir]);
}

const Gallery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get('category') || 'all';
  const normalizedCategory = CATEGORY_DETAILS[requestedCategory] ? requestedCategory : 'all';
  const [filter, setFilter] = useState(normalizedCategory);

  useEffect(() => {
    setFilter(normalizedCategory);
  }, [normalizedCategory]);

  useEffect(() => {
    if (requestedCategory !== normalizedCategory) {
      setSearchParams(normalizedCategory === 'all' ? {} : { category: normalizedCategory }, {
        replace: true,
      });
    }
  }, [normalizedCategory, requestedCategory, setSearchParams]);

  const selectedCategory = CATEGORY_DETAILS[filter] || CATEGORY_DETAILS.all;
  const filteredImages = useMemo(
    () => (filter === 'all' ? galleryData : galleryData.filter((item) => item.cat === filter)),
    [filter]
  );

  usePageSeo({
    title: selectedCategory.title,
    description: selectedCategory.description,
    routePath: filter === 'all' ? '/gallery' : `/gallery?category=${filter}`,
    canonicalPath: '/gallery',
    robots:
      filter === 'all'
        ? undefined
        : 'noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    image:
      filter === 'all'
        ? `${SITE_URL}/images/ourspace_grandcelebration_hall.png`
        : `${SITE_URL}${filteredImages[0]?.img || '/images/ourspace_grandcelebration_hall.png'}`,
    imageAlt: `${selectedCategory.label} at Aarna Wedding Destination near Mysore`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: `${selectedCategory.label} | Aarna Wedding Destination`,
      url: `${SITE_URL}/gallery${filter === 'all' ? '' : `?category=${filter}`}`,
      description: selectedCategory.description,
      image: filteredImages.map((item) => `${SITE_URL}${item.img}`),
    },
  });

  useGalleryAnimations();

  const categories = Object.entries(CATEGORY_DETAILS).map(([id, details]) => ({
    id,
    label: details.label,
  }));

  const handleCategoryChange = (categoryId) => {
    setFilter(categoryId);
    setSearchParams(categoryId === 'all' ? {} : { category: categoryId });
  };

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="hero-bg-overlay"></div>
        <div className="container">
          <div className="gallery-hero-text">
            <span className="kicker-white">Venue Highlights</span>
            <h1>{selectedCategory.label}</h1>
            <p>{selectedCategory.description}</p>
          </div>
        </div>
      </section>

      <section className="gallery-content section-padding">
        <div className="container">
          <div className="gallery-filters" id="galleryFilters">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="gallery-grid" id="galleryContainer">
            {filteredImages.map((item, idx) => (
              <div
                key={item.id}
                className="gallery-item"
                data-reveal="zoom"
                style={{ animationDelay: `${Math.min(idx * 55, 420)}ms` }}
              >
                <img src={item.img} alt={item.label} loading="lazy" decoding="async" fetchPriority="low" sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw" />
                <div className="gallery-caption">
                  <h4>{item.label}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-cta">
        <div className="container">
          <div className="cta-box">
            <h2>Experience Aarna in Person</h2>
            <p>Plan a visit and explore the spaces that make Aarna feel unforgettable.</p>
            <Link to="/contact" className="btn btn-primary">
              Book Your Tour
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;

