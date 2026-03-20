import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaRobot, FaBrain, FaChartLine, FaLaptopCode, FaMessage } from 'react-icons/fa6';
import { FiAward, FiBookOpen, FiCpu, FiMessageSquare, FiMapPin, FiCalendar, FiArrowRight, FiArrowLeft, FiUsers, FiCheckCircle, FiClock, FiX } from 'react-icons/fi';
import api from '../utils/api';
import ImageGallery from '../components/ImageGallery';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';
import './Home.css';

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

const getHighlightIcon = (tag) => {
  switch (tag) {
    case 'Award': return <FiAward />;
    case 'Lecture': return <FiBookOpen />;
    case 'Workshop': return <FiCpu />;
    case 'Podcast': return <FiMessageSquare />;
    default: return <FiAward />;
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: (typeof i === 'number' ? i : 0) * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  })
};

import aiTrainingImg from '../assets/services/ai-training.png';
import aiAutomationImg from '../assets/services/ai-automation.png';
import webAiDevImg from '../assets/services/web-ai-dev.png';
import aiFreelanceImg from '../assets/services/ai-freelance.png';
import innovationLabImg from '../assets/services/innovation-lab.png';

const services = [
  { image: aiTrainingImg, title: 'AI Training Programs', desc: 'Courses in AI, Data Science, ML, DL, and Python.' },
  { image: aiAutomationImg, title: 'AI Automation Services', desc: 'Chatbots, WhatsApp automation, and business AI solutions.' },
  { image: webAiDevImg, title: 'Web & AI Product Development', desc: 'AI-powered applications and tools.' },
  { image: aiFreelanceImg, title: 'AI Freelance Hub', desc: 'Real project opportunities for students and freelancers.' },
  { image: innovationLabImg, title: 'Innovation Lab Programs', desc: 'AI labs and industry exposure for colleges.' }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const wordReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Home() {
  const [company, setCompany] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [compRes, eventRes] = await Promise.all([
        api.get('/company'),
        api.get('/events')
      ]);
      setCompany(compRes.data);
      setEvents(eventRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [fetchData]);

  const highlights = company?.highlights || [];
  const clients = company?.clients || [];
  const upcomingOnly = events.filter(e => e.computedStatus === 'Upcoming');
  const displayWorkshops = upcomingOnly.length > 0 
    ? upcomingOnly.slice(0, 3) 
    : [...events].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  const splitTitle = "Learn – Build – Earn Ecosystem".split(" ");

  return (
    <div className="home-page">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="container hero-container">
          <motion.div className="hero-content" initial="hidden" animate="visible">
            <motion.span className="badge badge-blue" variants={fadeUp} custom={0}>
              #1 AI Student Workforce Initiative
            </motion.span>
            
            <motion.h1 className="hero-title" variants={staggerContainer}>
              {splitTitle.map((word, i) => (
                <motion.span key={i} variants={wordReveal} style={{ display: 'inline-block', marginRight: '0.25em' }}>
                  {word === "Earn" ? <span className="gradient-text">{word}</span> : word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p variants={fadeUp} custom={2}>
              Bridging the gap between academic learning and industry needs through emerging technologies and real-world innovation.
            </motion.p>

            <motion.div className="hero-btns" variants={fadeUp} custom={3}>
              <MagneticButton className="btn btn-primary btn-lg" to="/workshops">
                Explore Workshops <FiArrowRight />
              </MagneticButton>
              <MagneticButton className="btn btn-secondary btn-lg" to="/about">
                Learn More
              </MagneticButton>
            </motion.div>

            <motion.div className="hero-stats" variants={fadeUp} custom={4}>
              <div className="stat-item">
                <span className="stat-number">10+</span>
                <span className="stat-label">AI Workshops</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">2000+</span>
                <span className="stat-label">Students Trained</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5+</span>
                <span className="stat-label">Industry Partners</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT PREVIEW ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="about-preview-grid">
            <motion.div 
              className="about-preview-image"
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop" 
                alt="AI Innovation" 
                className="about-side-img"
                loading="lazy"
              />
              <div className="image-overlay-glow"></div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="badge badge-blue">Who we are</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Scaling AI Education for the <span className="gradient-text">Next Generation</span></h2>
              <p style={{ color: 'var(--subtext)', lineHeight: 1.8, marginBottom: 24 }}>
                Sprouts Edutech and IT Services is an MSME-registered initiative focused on making AI education affordable and practical. 
                We build a "Learn–Build–Earn" ecosystem where students gain industry-ready skills and work on real-world projects.
              </p>
              <Link to="/about" className="btn btn-outline">Read Our Full Story <FiArrowRight /></Link>
            </motion.div>
            
            <motion.div className="about-preview-img-wrap" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <TiltCard className="preview-card card glass" style={{ zIndex: 1 }}>
                <div className="preview-icon"><FiCheckCircle size={32} /></div>
                <h3>MSME Registered</h3>
                <p>Officially accredited education and IT services provider.</p>
              </TiltCard>
              <TiltCard className="preview-card card glass" style={{ marginTop: 120, marginLeft: 40, zIndex: 2 }}>
                <div className="preview-icon"><FiAward size={32} /></div>
                <h3>Award Winning</h3>
                <p>Recognized for excellence in AI training and entrepreneurship.</p>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW ===== */}
      <section className="section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="badge badge-blue">Our Services</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginTop: '16px' }}>Our <span className="gradient-text">Core Services</span></h2>
            <p className="section-subtitle">Bridging the technology gap with comprehensive AI solutions</p>
          </motion.div>
            <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {services.map((s, i) => (
                <TiltCard key={s.title}>
                  <motion.div 
                    className="card service-card-home"
                    variants={fadeUp} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true }} 
                    custom={i}
                  >
                    <div className="card-image-wrapper">
                      <img 
                        className="card-image" 
                        src={s.image} 
                        alt={s.title} 
                        loading="lazy"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&h=400&fit=crop'; }} 
                      />
                    </div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </motion.div>
                </TiltCard>
              ))}
            </div>
        </div>
      </section>

      {/* ===== UPCOMING/LATEST WORKSHOPS PREVIEW ===== */}
      {displayWorkshops.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="section-title">{upcomingOnly.length > 0 ? 'Upcoming' : 'Latest'} <span className="gradient-text">Workshops</span></h2>
              <p className="section-subtitle">{upcomingOnly.length > 0 ? "Don't miss out on our latest AI and tech training sessions" : "Explore our recently completed training sessions and workshops"}</p>
            </motion.div>
            <div className="grid-3">
              {displayWorkshops.map((event, i) => (
                <TiltCard key={event._id}>
                  <motion.div 
                    className="card event-card-preview"
                    variants={fadeUp} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true }} 
                    custom={i}
                  >
                    <div className="card-image-wrapper">
                      <img 
                        className="card-image"
                        src={event.image ? (event.image.startsWith('http') ? event.image : `http://localhost:5000${event.image}`) : 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300&h=300&fit=crop'} 
                        alt={event.title} 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&h=300&fit=crop'; }} 
                      />
                    </div>
                    <h3>{event.title}</h3>
                    <div className="event-preview-meta">
                      <span><FiCalendar /> {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      <span><FiClock /> {event.duration}</span>
                    </div>
                    <MagneticButton className="btn btn-secondary btn-sm" to={`/workshops/${event._id}`} style={{ marginTop: '16px', width: '100%' }}>
                      View Details
                    </MagneticButton>
                  </motion.div>
                </TiltCard>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link to="/workshops" className="btn btn-outline">View All Workshops <FiArrowRight /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== HIGHLIGHTS ===== */}
      <section className="section section-alt">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="section-title">Featured <span className="gradient-text">Highlights</span></h2>
            <p className="section-subtitle">Our achievements and contributions across Tamil Nadu</p>
          </motion.div>
          <div className="ach-grid">
            {(highlights.length > 0 ? highlights : [
              { title: 'Best Entrepreneur Award', desc: 'Recognized by Startup TN', tag: 'Award', location: 'Chennai', date: '2023', images: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?q=80&w=600&h=400&fit=crop' },
              { title: 'Workshop at Hope Worldwide', desc: 'Social impact through AI education', tag: 'Workshop', location: 'Trichy', date: '2024', images: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&h=400&fit=crop' },
              { title: 'Guest Lecture at Saranathan', desc: 'Industry insights for engineering students', tag: 'Lecture', location: 'Trichy', date: '2024', images: 'https://images.unsplash.com/photo-1523240715639-9942f0d96d6b?q=80&w=600&h=400&fit=crop' },
              { title: 'AI Tech Podcast', desc: 'Featured on MS University Radio', tag: 'Podcast', location: 'Tirunelveli', date: '2023', images: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&h=400&fit=crop' },
            ]).slice(0, 4).map((h, i) => {
              const images = normalizeImages(h.images);
              return (
                <motion.div 
                  key={h._id || i} 
                  className="ach-card"
                  variants={fadeUp} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true }}
                  custom={i}
                >
                  <div className="ach-image-wrap">
                    <ImageGallery images={images.length > 0 ? images : ['https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&h=400&fit=crop']} />
                    <span className="ach-tag">{getHighlightIcon(h.tag)} {h.tag || 'Award'}</span>
                  </div>
                  <div className="ach-content">
                    <h3>{h.title}</h3>
                    <div className="ach-meta">
                      {h.location && <span><FiMapPin /> {h.location}</span>}
                      {h.date && <span><FiCalendar /> {h.date}</span>}
                    </div>
                    <p>{h.description || h.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/achievements" className="btn btn-outline">Explore All Achievements <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* ===== CLIENTS ===== */}
      <section className="section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="section-title">Our <span className="gradient-text">Clients</span></h2>
            <p className="section-subtitle">Trusted by innovative companies</p>
          </motion.div>
          <div className="clients-row">
            {(clients.length > 0 ? clients : [
              { name: 'Roriri Softwares', location: 'Tirunelveli' },
              { name: 'Learnix Thrive', location: 'Bangalore' },
            ]).map((c, i) => (
              <motion.div 
                key={c._id || i} 
                className="client-card card glass" 
                whileHover={{ y: -10 }} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedClient(c)}
                style={{ cursor: 'pointer' }}
              >
                <div className="client-logo-wrap">
                  {c.logo ? (
                    <img src={c.logo} alt={c.name} />
                  ) : (
                    <div className="client-logo-placeholder">{c.name.charAt(0)}</div>
                  )}
                </div>
                <h3>{c.name}</h3>
                <p>{c.location}</p>
                {c.description && (
                  <button className="btn-text" style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--soft-blue)', fontWeight: 600 }}>
                    View Case Study <FiArrowRight size={12} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CLIENT DETAIL MODAL ===== */}
      <AnimatePresence>
        {selectedClient && (
          <div className="modal-overlay" onClick={() => setSelectedClient(null)}>
            <motion.div 
              className="modal-card client-detail-modal card glass"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedClient(null)}><FiX /></button>
              
              <div className="client-detail-header">
                <div className="client-logo-large">
                  {selectedClient.logo ? (
                    <img src={selectedClient.logo} alt={selectedClient.name} />
                  ) : (
                    <div className="client-logo-placeholder">{selectedClient.name.charAt(0)}</div>
                  )}
                </div>
                <div>
                  <h2>{selectedClient.name}</h2>
                  <p className="client-location"><FiMapPin /> {selectedClient.location}</p>
                </div>
              </div>

              <div className="client-detail-body">
                <h3>About the Collaboration</h3>
                <p>{selectedClient.description || "We have established a successful partnership focused on technology innovation and student empowerment."}</p>
              </div>
              
              <div className="client-detail-footer">
                <MagneticButton className="btn btn-secondary" onClick={() => setSelectedClient(null)}>Close</MagneticButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== LOCATION SECTION ===== */}
      <section className="section section-alt">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="section-title">Visit <span className="gradient-text">Our Center</span></h2>
            <p className="section-subtitle">Located in the heart of Irungalur, Trichy</p>
          </motion.div>
          
          <div className="location-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', marginTop: '40px', alignItems: 'center' }}>
            <motion.div 
              className="location-info card glass"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="contact-item" style={{ marginBottom: '24px' }}>
                <FiMapPin size={24} style={{ color: 'var(--soft-blue)', marginBottom: '12px' }} />
                <h3>Address</h3>
                <p style={{ color: 'var(--subtext)' }}>Irungalur, Trichy,<br />Tamil Nadu, India</p>
              </div>
              <div className="contact-item" style={{ marginBottom: '24px' }}>
                <FiClock size={24} style={{ color: 'var(--soft-blue)', marginBottom: '12px' }} />
                <h3>Working Hours</h3>
                <p style={{ color: 'var(--subtext)' }}>Monday - Saturday<br />9:30 AM - 6:30 PM</p>
              </div>
              <MagneticButton className="btn btn-outline btn-sm" to="/contact">
                Get Directions <FiArrowRight />
              </MagneticButton>
            </motion.div>

            <motion.div 
              className="location-map card"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              style={{ padding: '0', overflow: 'hidden', height: '350px', border: '1px solid var(--border-color)' }}
            >
              <iframe 
                src="https://www.google.com/maps?q=Sprouts+Orgs+Irungalur+Trichy+Tamil+Nadu&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                title="Sprouts Orgs Irungalur Map"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section cta-section">
        <div className="container">
          <motion.div className="cta-card card blue-gradient" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2>Ready to Start Your <span className="text-white">AI Journey?</span></h2>
            <p>Join our upcoming workshops or collaborate with us on industry projects.</p>
            <div className="cta-btns">
              <MagneticButton className="btn btn-white" to="/workshops">
                View Workshops
              </MagneticButton>
              <MagneticButton className="btn btn-secondary" to="/contact">
                Contact Us
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
