import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiDollarSign, FiArrowRight, FiBookOpen, FiCpu, FiCode, FiActivity, FiGlobe } from 'react-icons/fi';
import { FaRobot, FaBrain, FaDatabase, FaLayerGroup } from 'react-icons/fa';
import api from '../utils/api';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';
import './Workshops.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: (typeof i === 'number' ? i : 0) * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  })
};

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

const getEventIcon = (title) => {
  const t = title.toLowerCase();
  if (t.includes('ai') || t.includes('intelligence')) return <FaBrain />;
  if (t.includes('machine') || t.includes('robot')) return <FaRobot />;
  if (t.includes('data') || t.includes('science') || t.includes('analytics')) return <FaDatabase />;
  if (t.includes('web') || t.includes('full stack') || t.includes('frontend')) return <FiGlobe />;
  if (t.includes('python') || t.includes('code') || t.includes('programming')) return <FiCode />;
  if (t.includes('iot') || t.includes('hardware')) return <FiCpu />;
  return <FiBookOpen />;
};

export default function Workshops() {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvents();
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvents();
  }, [fetchEvents]);

  const filtered = useMemo(() => events.filter(e => e.computedStatus === activeTab), [events, activeTab]);

  if (loading) {
    return (
      <div className="workshops-page">
        <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loader">Loading Workshops...</div>
        </section>
      </div>
    );
  }

  const splitTitle = "Our Workshops & Events".split(" ");

  return (
    <div className="workshops-page">
      <section className="page-hero section-alt">
        {/* Floating Motifs for Workshops */}
        <div className="ws-float motif-1"><FiCpu /></div>
        <div className="ws-float motif-2"><FiCode /></div>
        <div className="ws-float motif-3"><FaBrain /></div>

        <div className="container">
          <motion.span className="badge badge-blue" variants={fadeUp} initial="hidden" animate="visible">Learning Hub</motion.span>
          
          <motion.h1 className="section-title" variants={staggerContainer} initial="hidden" animate="visible">
            {splitTitle.map((word, i) => (
              <motion.span key={i} variants={wordReveal} style={{ display: 'inline-block', marginRight: '0.25em' }}>
                {(word === "Workshops" || word === "Events") ? <span className="gradient-text">{word}</span> : word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p className="section-subtitle" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            Hands-on learning experiences designed to bridge the gap between theory and industry.
          </motion.p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="tabs-container">
            <div className="tabs">
              {['Upcoming', 'Completed'].map(tab => (
                <button 
                  key={tab} 
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`} 
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'Upcoming' ? <FiActivity /> : <FiBookOpen />}
                  {tab} Events
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {filtered.length === 0 ? (
                <div className="empty-state card glass">
                  <p>No {activeTab.toLowerCase()} events at the moment. Stay tuned!</p>
                </div>
              ) : (
                <div className="events-grid">
                  {filtered.map((event, i) => (
                    <TiltCard key={event._id}>
                      <motion.div
                        className="card event-card premium-ws-card"
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={i}
                      >
                        <div className="event-image">
                          {event.image ? (
                            <img 
                              src={event.image ? (event.image.startsWith('http') ? event.image : `${api.defaults.baseURL.replace('/api', '')}${event.image}`) : 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400&h=400&fit=crop'} 
                              alt={event.title} 
                              className="ws-card-img" 
                              loading="lazy"
                            />
                          ) : (
                            <motion.div 
                              className="event-image-overlay"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                            >
                              <div className="ws-icon-large">{getEventIcon(event.title)}</div>
                            </motion.div>
                          )}
                          <span className={`badge event-status-badge ${event.computedStatus === 'Upcoming' ? 'badge-green' : 'badge-orange accent-glow'}`}>
                            {event.computedStatus}
                          </span>
                        </div>
                        <div className="event-body">
                          <motion.h3 
                            initial={{ opacity: 0 }} 
                            whileInView={{ opacity: 1 }} 
                            transition={{ delay: 0.2 }}
                          >
                            {event.title}
                          </motion.h3>
                          <p className="event-desc">{event.description}</p>
                          
                          <div className="event-meta">
                            <motion.span variants={fadeUp} custom={i+1}>
                              <FiCalendar /> {event.startDate && event.endDate ? `${event.startDate} to ${event.endDate}` : new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </motion.span>
                            <motion.span variants={fadeUp} custom={i+2}>
                              <FiClock /> {event.startTime && event.endTime ? `${event.startTime} to ${event.endTime}` : event.duration}
                            </motion.span>
                            <motion.span variants={fadeUp} custom={i+3} className="price-tag"><FiDollarSign /> {event.price}</motion.span>
                          </div>

                          <div className="event-actions">
                            <MagneticButton className="btn btn-secondary btn-sm" to={`/workshop/${event._id}`}>
                              View Details
                            </MagneticButton>
                            {event.computedStatus === 'Upcoming' && (
                              <MagneticButton className="btn btn-primary btn-sm" to={`/register/${event._id}`}>
                                Register Now <FiArrowRight />
                              </MagneticButton>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </TiltCard>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
