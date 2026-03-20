import React, { useEffect, useState } from 'react';
import { FiAward, FiBookOpen, FiCpu, FiMessageSquare, FiMapPin, FiCalendar } from 'react-icons/fi';
import api from '../utils/api';
import ImageGallery from '../components/ImageGallery';
import './Achievements.css';

// Normalize images to always be a flat array of URL strings
const normalizeImages = (images) => {
  if (!images) return [];
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed.flat().filter(Boolean) : [parsed].filter(Boolean);
    } catch (e) {
      return images.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  if (Array.isArray(images)) return images.flat().filter(Boolean);
  return [images].filter(Boolean);
};

export default function Achievements() {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchHighlights = async () => {
      try {
        const res = await api.get('/company');
        // Structure: { about, highlights: [], clients: [] }
        const data = res.data.highlights || [];
        const normalized = data.map(h => ({
          ...h,
          images: normalizeImages(h.images)
        }));
        setHighlights(normalized);
      } catch (err) {
        console.error('Error fetching highlights:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  const getIcon = (tag) => {
    switch (tag) {
      case 'Award': return <FiAward />;
      case 'Lecture': return <FiBookOpen />;
      case 'Workshop': return <FiCpu />;
      case 'Podcast': return <FiMessageSquare />;
      default: return <FiAward />;
    }
  };

  const sections = [
    { title: "Featured Achievements", tag: "Award" },
    { title: "Guest Lectures & Sessions", tag: "Lecture" },
    { title: "Workshops & Community Impact", tag: "Workshop" },
    { title: "Media & Podcast", tag: "Podcast" }
  ];

  // Grouping logic (case-insensitive)
  const tagGroups = sections.map(section => {
    const items = highlights.filter(h => 
      (h.tag || 'Award').toString().trim().toLowerCase() === section.tag.toLowerCase()
    );
    return { ...section, items };
  }).filter(g => g.items.length > 0);

  // Catch-all for items with unexpected tags
  const matchedIds = new Set(tagGroups.flatMap(g => g.items.map(i => i._id || i.title)));
  const otherItems = highlights.filter(h => !matchedIds.has(h._id || h.title));
  if (otherItems.length > 0) {
    tagGroups.push({ title: "Other Highlights", tag: "Other", items: otherItems });
  }

  if (loading) return (
    <div className="achievements-page" style={{ padding: '100px', textAlign: 'center' }}>
      <h2>Loading Achievements...</h2>
    </div>
  );

  return (
    <div className="achievements-page">
      <section className="ach-hero">
        <div className="container">
          <h1 className="hero-title-animated">Achievements</h1>
          <p>Celebrating our path of innovation and community impact.</p>
        </div>
      </section>

      {tagGroups.map((group) => (
        <section key={group.title} className="ach-section">
          <div className="container">
            <h2 className="ach-section-title">{group.title}</h2>
            <div className={group.tag === 'Award' ? 'ach-hero-grid' : 'ach-grid'}>
              {group.items.map((item, i) => (
                <div key={item._id || i} className="ach-card">
                  <div className="ach-image-wrap">
                    <ImageGallery images={item.images && item.images.length > 0 ? item.images : ['https://ik.imagekit.io/Lourdu/Sprouts/logo.jpeg?updatedAt=1773849138906']} />
                    <span className="ach-tag">{getIcon(item.tag)} {item.tag || 'Award'}</span>
                  </div>
                  <div className="ach-content" style={{ background: '#ffffff', opacity: 1, visibility: 'visible', display: 'block' }}>
                    <h3 style={{ color: '#000000', opacity: 1, fontWeight: '800' }}>{item.title}</h3>
                    <div className="ach-meta" style={{ color: '#0066cc', opacity: 1, fontWeight: '700', display: 'flex', gap: '15px', marginBottom: '10px' }}>
                      {item.location && <span><FiMapPin /> {item.location}</span>}
                      {item.date && <span><FiCalendar /> {item.date}</span>}
                    </div>
                    <p style={{ color: '#444444', opacity: 1, display: 'block', lineHeight: '1.6' }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
