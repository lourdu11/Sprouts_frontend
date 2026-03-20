import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiSend, FiCheckCircle, FiMapPin } from 'react-icons/fi';
import api from '../utils/api';
import './Contact.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ 
    opacity: 1, y: 0, 
    transition: { delay: (typeof i === 'number' ? i : 0) * 0.1, duration: 0.6 } 
  })
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/messages', {
        ...form,
        subject: 'General Inquiry' // Default subject
      });
      setSubmitted(true);
    } catch (err) {
      alert('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-hero section-alt">
        <div className="container">
          <motion.span className="badge badge-blue" variants={fadeUp} initial="hidden" animate="visible">Contact Us</motion.span>
          <motion.h1 className="section-title" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            Get in <span className="gradient-text">Touch</span>
          </motion.h1>
          <motion.p className="section-subtitle" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            Have questions? We'd love to hear from you
          </motion.p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <motion.div className="contact-info" variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2>Let's Connect</h2>
              <p>Have questions about our workshops, internships, or services? Reach out and we'll get back to you promptly.</p>


              <div className="contact-cards">
                <div className="contact-card glass">
                  <div className="cc-icon"><FiPhone size={22} /></div>
                  <div>
                    <h4>Call Us</h4>
                    <p><a href="https://wa.me/918610339739?text=Hi%20Sprouts%20Edutech%2C%20I'm%20interested%20in%20your%20services.%20Can%20you%20please%20provide%20more%20details%3F" target="_blank" rel="noopener noreferrer">8610339739</a></p>
                    <p><a href="https://wa.me/917845827272?text=Hi%20Sprouts%20Edutech%2C%20I'm%20interested%20in%20your%20services.%20Can%20you%20please%20provide%20more%20details%3F" target="_blank" rel="noopener noreferrer">7845827272</a></p>
                  </div>
                </div>
                <div className="contact-card glass">
                  <div className="cc-icon"><FiMail size={22} /></div>
                  <div>
                    <h4>Email Us</h4>
                    <p><a href="mailto:sproutsorgs.official@gmail.com?subject=Inquiry%20regarding%20Sprouts%20Edutech%20Services&body=Dear%20Sprouts%20Edutech%20Team%2C%0D%0A%0D%0AI%20am%20interested%20in%20learning%20more%20about%20your%20services%20and%20workshops.%20Could%20you%20please%20provide%20more%20information%3F%0D%0A%0D%0AThank%20you.">sproutsorgs.official@gmail.com</a></p>
                  </div>
                </div>
                <div className="contact-card glass">
                  <div className="cc-icon"><FiMapPin size={22} /></div>
                  <div>
                    <h4>Visit Us</h4>
                    <p>Irungalur, Trichy</p>
                    <p>Tamil Nadu, India</p>
                  </div>
                </div>
              </div>

              {/* Integrated Map - Using a more robust search-based embed URL */}
              <div className="contact-map-mini card" style={{ height: '320px', borderRadius: '15px', overflow: 'hidden', margin: '24px 0', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <iframe 
                  src="https://www.google.com/maps?q=Sprouts+Orgs+Irungalur+Trichy+Tamil+Nadu&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  title="Sprouts Orgs Location"
                ></iframe>
              </div>
            </motion.div>

            <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {submitted ? (
                <motion.div className="success-card card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
                  <div className="success-icon"><FiCheckCircle size={64} /></div>
                  <h2>Message Sent! 🎉</h2>
                  <p>Thank you for reaching out. We'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form className="contact-form card" onSubmit={handleSubmit}>
                  <h3>Send us a Message</h3>
                  <div className="input-group">
                    <label htmlFor="contact-name">Full Name</label>
                    <input type="text" id="contact-name" name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" />
                  </div>
                  <div className="input-group">
                    <label htmlFor="contact-email">Email</label>
                    <input type="email" id="contact-email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" />
                  </div>
                  <div className="input-group">
                    <label htmlFor="contact-phone">Phone</label>
                    <input type="tel" id="contact-phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Your phone number" />
                  </div>
                  <div className="input-group">
                    <label htmlFor="contact-message">Message</label>
                    <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} required placeholder="How can we help you?" rows={5} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Sending...' : <><FiSend /> Send Message</>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
