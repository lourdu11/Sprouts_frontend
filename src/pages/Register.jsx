import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheckCircle, FiSend } from 'react-icons/fi';
import api from '../utils/api';
import './Register.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } })
};

export default function Register() {
  const { eventId } = useParams();
  const [form, setForm] = useState({ name: '', email: '', phone: '', college: '', course: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);
  const [showEmbeddedForm, setShowEmbeddedForm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${eventId}`);
      setEvent(res.data);
    } catch (err) {
      console.error('Error fetching event for registration:', err);
    }
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to database via API
      await api.post('/register', { ...form, eventId });
      
      setSubmitted(true);
      
      // Show embedded form after short delay
      if (event?.googleFormUrl) {
        setTimeout(() => {
          setShowEmbeddedForm(true);
        }, 3000);
      }
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showEmbeddedForm && event?.googleFormUrl) {
    // Convert regular form link to embedded link if it isn't already
    let embedUrl = event.googleFormUrl;
    if (embedUrl.includes('viewform')) {
      embedUrl = embedUrl.replace('viewform', 'viewform?embedded=true');
    } else if (!embedUrl.includes('embedded=true')) {
      embedUrl += (embedUrl.includes('?') ? '&' : '?') + 'embedded=true';
    }

    return (
      <div className="register-page embedded-form-view">
        <section className="section" style={{ paddingTop: 120 }}>
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="iframe-container card glass">
              <div className="iframe-header">
                <h3>Final Step: Complete Google Form</h3>
                <Link to="/workshops" className="btn btn-secondary btn-sm">Done? Back to Workshops</Link>
              </div>
              <iframe 
                src={embedUrl} 
                width="100%" 
                height="800" 
                frameBorder="0" 
                marginHeight="0" 
                marginWidth="0"
                title="Google Form"
              >
                Loading…
              </iframe>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="register-page">
        <section className="section" style={{ paddingTop: 160 }}>
          <div className="container">
            <motion.div className="success-card card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
              <div className="success-icon"><FiCheckCircle size={64} /></div>
              <h2>Registration Successful! 🎉</h2>
              <p>Your details have been collected. You will be redirected to the Google Form in 3 seconds for final submission.</p>
              <div style={{ marginTop: 20, display: 'flex', gap: 15, justifyContent: 'center' }}>
                <Link to="/workshops" className="btn btn-secondary">Back to Workshops</Link>
                {event?.googleFormUrl && (
                  <a href={event.googleFormUrl} className="btn btn-primary">Go to Google Form Now</a>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="register-page">
      <section className="page-hero section-alt">
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Link to={`/workshop/${eventId}`} className="back-link"><FiArrowLeft /> Back to Event</Link>
          </motion.div>
          <motion.h1 className="section-title" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            Register for <span className="gradient-text">Event</span>
          </motion.h1>
          <motion.p className="section-subtitle" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            Fill in your details to secure your spot
          </motion.p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.form className="register-form card" onSubmit={handleSubmit} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Enter your full name" />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required placeholder="Enter your email" />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="Enter your phone number" />
            </div>
            <div className="input-group">
              <label htmlFor="college">College / Institution</label>
              <input type="text" id="college" name="college" value={form.college} onChange={handleChange} required placeholder="Enter your college name" />
            </div>
            <div className="input-group">
              <label htmlFor="course">Course / Branch</label>
              <input type="text" id="course" name="course" value={form.course} onChange={handleChange} required placeholder="E.g., B.Tech CSE, B.Sc Computer Science" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Submitting...' : (<><FiSend /> Submit Registration</>)}
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
