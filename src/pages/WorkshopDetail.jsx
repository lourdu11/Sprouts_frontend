import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiDollarSign, FiArrowLeft, FiCheckCircle, FiUser, FiAward } from 'react-icons/fi';
import api from '../utils/api';
import MagneticButton from '../components/MagneticButton';
import TiltCard from '../components/TiltCard';
import './WorkshopDetail.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: (typeof i === 'number' ? i : 0) * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function WorkshopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="workshop-detail-page">
        <section className="section" style={{ paddingTop: 140, textAlign: 'center' }}>
          <div className="container">
            <div className="loader">Loading Event Details...</div>
          </div>
        </section>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="section" style={{ paddingTop: 140, textAlign: 'center' }}>
        <div className="container">
          <h2>Event not found</h2>
          <MagneticButton className="btn btn-primary" to="/workshops" style={{ marginTop: 20 }}>
            Back to Workshops
          </MagneticButton>
        </div>
      </div>
    );
  }

  return (
    <div className="workshop-detail-page">
      <section className="page-hero section-alt">
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <MagneticButton className="back-link-btn" to="/workshops">
              <FiArrowLeft /> Back to Workshops
            </MagneticButton>
          </motion.div>
          <motion.div className="detail-header" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            <span className={`badge ${event.computedStatus === 'Upcoming' ? 'badge-green' : 'badge-orange'}`}>{event.computedStatus}</span>
            <h1 className="section-title">{event.title}</h1>
            <div className="detail-meta">
              <span>
                <FiCalendar /> {event.startDate && event.endDate ? `${event.startDate} to ${event.endDate}` : new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span>
                <FiClock /> {event.startTime && event.endTime ? `${event.startTime} to ${event.endTime}` : event.duration}
              </span>
              <span><FiDollarSign /> {event.price}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="detail-grid">
            <div className="detail-main">
              {event.image && (
                <motion.div className="detail-hero-image card glass" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
                  <img src={event.image.startsWith('http') ? event.image : `${api.defaults.baseURL.replace('/api', '')}${event.image}`} alt={event.title} />
                </motion.div>
              )}
              <motion.div className="detail-block" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2>About This Workshop</h2>
                {event.description.split('\n').map((p, i) => <p key={i}>{p}</p>) || <p>{event.description}</p>}
              </motion.div>

              {event.topics?.length > 0 && (
                <motion.div className="detail-block" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
                  <h2>Topics Covered</h2>
                  <div className="topics-list">
                    {event.topics.map((t, i) => (
                      <span key={i} className="topic-tag"><FiCheckCircle /> {t}</span>
                    ))}
                  </div>
                </motion.div>
              )}

              {event.benefits?.length > 0 && (
                <motion.div className="detail-block" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
                  <h2>Benefits</h2>
                  <ul className="benefits-list">
                    {event.benefits.map((b, i) => (
                      <li key={i}><FiCheckCircle className="benefit-check" /> {b}</li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {event.certificateImage && (
                <motion.div className="detail-block certificate-preview-section" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
                  <h2>Workshop Certificate</h2>
                  <p>Upon successful completion, you will receive an industry-recognized certificate from Sprouts Edutech and IT services.</p>
                  <div className="certificate-img-wrap card glass">
                    <img 
                      src={event.certificateImage.startsWith('http') ? event.certificateImage : `${api.defaults.baseURL.replace('/api', '')}${event.certificateImage}`} 
                      alt="Workshop Certificate" 
                    />
                    <div className="cert-badge"><FiAward /> Verified Certificate</div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="detail-sidebar">
              <TiltCard>
                <motion.div className="sidebar-card card glass" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  {event.computedStatus === 'Upcoming' && (
                    <MagneticButton className="btn btn-primary" to={`/register/${event._id}`} style={{ width: '100%', marginBottom: 16 }}>
                      Register Now
                    </MagneticButton>
                  )}
                  <div className="sidebar-info">
                    <div className="sidebar-row">
                      <FiCalendar />
                      <div>
                        <strong>Date</strong>
                        <p>{event.startDate && event.endDate ? `${event.startDate} to ${event.endDate}` : new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="sidebar-row">
                      <FiClock />
                      <div>
                        <strong>Time</strong>
                        <p>{event.startTime && event.endTime ? `${event.startTime} to ${event.endTime}` : event.duration}</p>
                      </div>
                    </div>
                    <div className="sidebar-row">
                      <FiDollarSign />
                      <div>
                        <strong>Price</strong>
                        <p>{event.price}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TiltCard>

              {event.trainerName && (
                <TiltCard>
                  <motion.div className="sidebar-card card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
                    <h3><FiUser /> Trainer</h3>
                    <p className="trainer-name">{event.trainerName}</p>
                    <p className="trainer-bio">{event.trainerBio}</p>
                  </motion.div>
                </TiltCard>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
