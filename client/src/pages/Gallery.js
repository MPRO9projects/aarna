import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/Gallery.css';

/* ── Custom Hook for Scroll Reveal ────────────────────────── */
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

  return scrollDir;
}

const Gallery = () => {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category') || 'all';
  const [filter, setFilter] = useState(urlCategory);
  
  // Initialize animations
  useGalleryAnimations();

  useEffect(() => {
    setFilter(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    // SEO
    document.title = "Gallery Collections | Aarna Luxury Resort";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Pure white spaces, refined gold accents, and timeless celebrations at Aarna Resort.');
  }, []);

  const galleryData = [
    /* WEDDING (10) */
    { id: 101, cat: 'wedding', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&w=800', label: 'Royal Mandap', desc: 'Grand floral setup' },
    { id: 102, cat: 'wedding', img: 'https://images.unsplash.com/photo-1544086161-127976eecf87?auto=format&w=800', label: 'Elegant Aisle', desc: 'Cormorant style decor' },
    { id: 103, cat: 'wedding', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&w=800', label: 'Reception Night', desc: 'Lights & luxury' },
    { id: 104, cat: 'wedding', img: 'https://images.unsplash.com/photo-1532007271951-c487760934ae?auto=format&w=800', label: 'Heritage Decor', desc: 'Traditional accents' },
    { id: 105, cat: 'wedding', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&w=800', label: 'Evening Vows', desc: 'Pure white lawn' },
    { id: 106, cat: 'wedding', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&w=800', label: 'Grand Banquet', desc: 'Gold theme dining' },
    { id: 107, cat: 'wedding', img: 'https://images.unsplash.com/photo-1465495910483-0d6749ee9f4a?auto=format&w=800', label: 'Couple Portraits', desc: 'Timeless moments' },
    { id: 108, cat: 'wedding', img: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&w=800', label: 'Signature Stage', desc: 'Floral backdrop' },
    { id: 109, cat: 'wedding', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&w=800', label: 'Night Sparkle', desc: 'Festive glow' },
    { id: 110, cat: 'wedding', img: 'https://images.unsplash.com/photo-1544086161-127976eecf87?auto=format&w=800', label: 'Mandap Close-up', desc: 'Fine details' },

    /* LAWN AREA (10) */
    { id: 201, cat: 'lawn', img: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&w=800', label: 'Emerald Lawn', desc: 'Sunset events' },
    { id: 202, cat: 'lawn', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&w=800', label: 'Garden Party', desc: 'Open air joy' },
    { id: 203, cat: 'lawn', img: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&w=800', label: 'Manicured Grass', desc: 'Natural serenity' },
    { id: 204, cat: 'lawn', img: 'https://images.unsplash.com/photo-1519225495806-7ad35266ae06?auto=format&w=800', label: 'Night Garden', desc: 'Fairytale lights' },
    { id: 205, cat: 'lawn', img: 'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?auto=format&w=800', label: 'Lawn Arrival', desc: 'Grand entry' },
    { id: 206, cat: 'lawn', img: 'https://images.unsplash.com/photo-1560067174-8943bdc73a42?auto=format&w=800', label: 'Quiet Corner', desc: 'Morning dew' },
    { id: 207, cat: 'lawn', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&w=800', label: 'Pavilion View', desc: 'Elegant architecture' },
    { id: 208, cat: 'lawn', img: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&w=800', label: 'Outdoor Lounge', desc: 'Relax & connect' },
    { id: 209, cat: 'lawn', img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&w=800', label: 'Sunset Deck', desc: 'Golden reflections' },
    { id: 210, cat: 'lawn', img: 'https://images.unsplash.com/photo-1551887373-6a99f7d0a5be?auto=format&w=800', label: 'Lawn Edge', desc: 'Where design meets nature' },

    /* DINING (10) */
    { id: 301, cat: 'dining', img: 'https://images.unsplash.com/photo-1550966841-3ee71448744b?auto=format&w=800', label: 'Grand Dining', desc: 'Refined service' },
    { id: 302, cat: 'dining', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&w=800', label: 'Garden Table', desc: 'Al fresco dining' },
    { id: 303, cat: 'dining', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&w=800', label: 'Luxury Hall', desc: 'Pure white theme' },
    { id: 304, cat: 'dining', img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&w=800', label: 'Fine Selection', desc: 'Gourmet experience' },
    { id: 305, cat: 'dining', img: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&w=800', label: 'Warm Ambiance', desc: 'Golden hour dinner' },
    { id: 306, cat: 'dining', img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&w=800', label: 'Private Dining', desc: 'Intimate circles' },
    { id: 307, cat: 'dining', img: 'https://images.unsplash.com/photo-1551887373-6a99f7d0a5be?auto=format&w=800', label: 'Buffet Setup', desc: 'Grand scale' },
    { id: 308, cat: 'dining', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&w=800', label: 'Terrace Dining', desc: 'Sky views' },
    { id: 309, cat: 'dining', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&w=800', label: 'Minimal Table', desc: 'Pure aesthetics' },
    { id: 310, cat: 'dining', img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&w=800', label: 'Evening Bistro', desc: 'Casual luxury' },

    /* KITCHEN (10) */
    { id: 401, cat: 'kitchen', img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&w=800', label: 'Culinary Hub', desc: 'Professional setup' },
    { id: 402, cat: 'kitchen', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&w=800', label: 'Gourmet Prep', desc: 'Master chefs' },
    { id: 403, cat: 'kitchen', img: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&w=800', label: 'Pantry Space', desc: 'Clean & organized' },
    { id: 404, cat: 'kitchen', img: 'https://images.unsplash.com/photo-1556911229-431f93f91bf7?auto=format&w=800', label: 'Modern Suite', desc: 'High-end equipment' },
    { id: 405, cat: 'kitchen', img: 'https://images.unsplash.com/photo-1505673539012-ee7507e84ba9?auto=format&w=800', label: 'Chef Table', desc: 'Art on plate' },
    { id: 406, cat: 'kitchen', img: 'https://images.unsplash.com/photo-1551218808-94e220e031a5?auto=format&w=800', label: 'Live Station', desc: 'Interactive dining' },
    { id: 407, cat: 'kitchen', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&w=800', label: 'Bakery Wing', desc: 'Fresh & sweet' },
    { id: 408, cat: 'kitchen', img: 'https://images.unsplash.com/photo-1516714435131-44eb1c85672a?auto=format&w=800', label: 'Herb Garden', desc: 'Farm to table' },
    { id: 409, cat: 'kitchen', img: 'https://images.unsplash.com/photo-1547928509-3f0f78dfeb3c?auto=format&w=800', label: 'Kitchen Light', desc: 'Bright workspace' },
    { id: 410, cat: 'kitchen', img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&w=800', label: 'Final Touches', desc: 'Obsessed with detail' },

    /* TEMPLE (10) */
    { id: 501, cat: 'temple', img: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&w=800', label: 'Sacred Sanctum', desc: 'Pure white stone' },
    { id: 502, cat: 'temple', img: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce453?auto=format&w=800', label: 'Temple Pillars', desc: 'Traditional carvings' },
    { id: 503, cat: 'temple', img: 'https://images.unsplash.com/photo-1544955319-75a7b6cfcc0e?auto=format&w=800', label: 'Peaceful Courtyard', desc: 'Zen architecture' },
    { id: 504, cat: 'temple', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&w=800', label: 'Sacred Ritual', desc: 'Spiritual light' },
    { id: 505, cat: 'temple', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&w=800', label: 'Temple Mandap', desc: 'Sacred weddings' },
    { id: 506, cat: 'temple', img: 'https://images.unsplash.com/photo-1524491989247-1277bf33168d?auto=format&w=800', label: 'Stone Entry', desc: 'Grand arrival' },
    { id: 507, cat: 'temple', img: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&w=800', label: 'Temple Light', desc: 'Morning aura' },
    { id: 508, cat: 'temple', img: 'https://images.unsplash.com/photo-1501117716987-c8e2a7b9f49c?auto=format&w=800', label: 'Sacred Garden', desc: 'Lotus pond' },
    { id: 509, cat: 'temple', img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&w=800', label: 'Temple Facade', desc: 'Eternal design' },
    { id: 510, cat: 'temple', img: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&w=800', label: 'Devotion', desc: 'Calm and quiet' },

    /* POOL (10) */
    { id: 601, cat: 'pool', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&w=800', label: 'Azure Infinity', desc: 'Sky reflections' },
    { id: 602, cat: 'pool', img: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&w=800', label: 'Pool Deck', desc: 'Sun-drenched luxury' },
    { id: 603, cat: 'pool', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&w=800', label: 'Night Pool', desc: 'Glow in dark' },
    { id: 604, cat: 'pool', img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&w=800', label: 'Crystal Clear', desc: 'Pure serenity' },
    { id: 605, cat: 'pool', img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&w=800', label: 'Pool Architecture', desc: 'Floating steps' },
    { id: 606, cat: 'pool', img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&w=800', label: 'Pool Side Dining', desc: 'Chilled vibes' },
    { id: 607, cat: 'pool', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&w=800', label: 'Zen Deck', desc: 'Minimal pool' },
    { id: 608, cat: 'pool', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&w=800', label: 'Party Pool', desc: 'Grand scale' },
    { id: 609, cat: 'pool', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&w=800', label: 'Azure Calm', desc: 'Morning swim' },
    { id: 610, cat: 'pool', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&w=800', label: 'Pool View', desc: 'Infinity horizon' },

    /* MEDITATION AREA (10) */
    { id: 701, cat: 'meditation', img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&w=800', label: 'Zen Deck', desc: 'Mindful moments' },
    { id: 702, cat: 'meditation', img: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&w=800', label: 'Yoga Pavilion', desc: 'Sunrise stretch' },
    { id: 703, cat: 'meditation', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&w=800', label: 'Forest Path', desc: 'Quiet walks' },
    { id: 704, cat: 'meditation', img: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&w=800', label: 'Meditation Room', desc: 'Pure peace' },
    { id: 705, cat: 'meditation', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&w=800', label: 'Calm Light', desc: 'Soft ambiance' },
    { id: 706, cat: 'meditation', img: 'https://images.unsplash.com/photo-1501117716987-c8e2a7b9f49c?auto=format&w=800', label: 'Zen Water', desc: 'Nature flow' },
    { id: 707, cat: 'meditation', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&w=800', label: 'Bamboo Grove', desc: 'Whispers of nature' },
    { id: 708, cat: 'meditation', img: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&w=800', label: 'Quiet Garden', desc: 'Lush greenery' },
    { id: 709, cat: 'meditation', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&w=800', label: 'Stone Path', desc: 'Guided paths' },
    { id: 710, cat: 'meditation', img: 'https://images.unsplash.com/photo-1560067174-8943bdc73a42?auto=format&w=800', label: 'Inner Peace', desc: 'Final sanctuary' },

    /* ROOMS (10) */
    { id: 801, cat: 'rooms', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&w=800', label: 'Presidential Suite', desc: 'Grand scale' },
    { id: 802, cat: 'rooms', img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&w=800', label: 'Classic Room', desc: 'Time-honored luxury' },
    { id: 803, cat: 'rooms', img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&w=800', label: 'Garden View', desc: 'Private terrace' },
    { id: 804, cat: 'rooms', img: 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2f12?auto=format&w=800', label: 'Luxury Bedding', desc: 'Pure comfort' },
    { id: 805, cat: 'rooms', img: 'https://images.unsplash.com/photo-1501117716987-c8e2a7b9f49c?auto=format&w=800', label: 'Suite Lounge', desc: 'Bespoke design' },
    { id: 806, cat: 'rooms', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&w=800', label: 'Window View', desc: 'Resort skyline' },
    { id: 807, cat: 'rooms', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&w=800', label: 'Deluxe Suite', desc: 'Premium suite' },
    { id: 808, cat: 'rooms', img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&w=800', label: 'Modern Art', desc: 'Curated rooms' },
    { id: 809, cat: 'rooms', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&w=800', label: 'Sunrise Suite', desc: 'Morning glow' },
    { id: 810, cat: 'rooms', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&w=800', label: 'Room End', desc: 'Pure luxury finish' },

    /* EVENTS (10) */
    { id: 901, cat: 'events', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&w=800', label: 'Corporate Gala', desc: 'Grand scale' },
    { id: 902, cat: 'events', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&w=800', label: 'Event Ballroom', desc: 'Exhibition space' },
    { id: 903, cat: 'events', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&w=800', label: 'Fashion Show', desc: 'Cinematic runway' },
    { id: 904, cat: 'events', img: 'https://images.unsplash.com/photo-1501117716987-c8e2a7b9f49c?auto=format&w=800', label: 'Product Launch', desc: 'Minimal backdrop' },
    { id: 905, cat: 'events', img: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&w=800', label: 'Music Night', desc: 'Acoustics & vibe' },
    { id: 906, cat: 'events', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&w=800', label: 'Fine Selection', desc: 'Gourmet banquet' },
    { id: 907, cat: 'events', img: 'https://images.unsplash.com/photo-1524491989247-1277bf33168d?auto=format&w=800', label: 'Theatre Style', desc: 'Conference wing' },
    { id: 908, cat: 'events', img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&w=800', label: 'Art Expo', desc: 'Clean white walls' },
    { id: 909, cat: 'events', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&w=800', label: 'Celebration', desc: 'Lights & life' },
    { id: 910, cat: 'events', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&w=800', label: 'Grand Finale', desc: 'Timeless events' },
  ];

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'lawn', label: 'Lawn Area' },
    { id: 'dining', label: 'Dining' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'temple', label: 'Temple' },
    { id: 'pool', label: 'Pool' },
    { id: 'meditation', label: 'Meditation Area' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'events', label: 'Other Events' }
  ];

  const filteredImages = (filter === 'all' || !filter) ? galleryData : galleryData.filter(d => d.cat === filter);

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="hero-bg-overlay"></div>
        <div className="container">
          <div className="gallery-hero-text">
            <span className="kicker-white">visual anthology</span>
            <h1>Gallery Collections</h1>
            <p>Pure white spaces · refined gold accents · timeless celebrations.</p>
          </div>
        </div>
      </section>

      <section className="gallery-content section-padding">
        <div className="container">
          <div className="gallery-filters" id="galleryFilters">
            {categories.map(cat => (
              <button 
                key={cat.id} 
                className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                onClick={() => setFilter(cat.id)}
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
                <img src={item.img} alt={item.label} loading="lazy" />
                <div className="gallery-caption">
                  <h4>{item.label}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gallery-cta">
        <div className="container">
          <div className="cta-box">
             <h2>Experience AARNA in Person</h2>
             <p>Ready to create your own timeless memories at our resort?</p>
             <a href="/contact" className="btn btn-primary">Book Your Tour</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
