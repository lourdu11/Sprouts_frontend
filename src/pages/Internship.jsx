import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBrain, FaPython, FaJava, FaLaptopCode, FaRobot, FaChartBar } from 'react-icons/fa';
import { FiCpu, FiCode, FiTrendingUp, FiArrowRight, FiAward, FiCheckCircle, FiSend, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import api from '../utils/api';
import './Internship.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ 
    opacity: 1, y: 0, 
    transition: { delay: (typeof i === 'number' ? i : 0) * 0.1, duration: 0.6 } 
  })
};

const programs = [
  { image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=300&h=300&fit=crop', title: 'Artificial Intelligence', desc: 'Master the fundamentals and advanced concepts of AI.' },
  { image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&h=300&fit=crop', title: 'Data Science', desc: 'Learn to extract insights from complex data sets.' },
  { image: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=300&h=300&fit=crop', title: 'Machine Learning', desc: 'Build predictive models and algorithms.' },
  { image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=300&h=300&fit=crop', title: 'Deep Learning', desc: 'Explore neural networks and cognitive computing.' },
  { image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=300&h=300&fit=crop', title: 'Core Programming', desc: 'Python programming, Java, C programming.' },
  { image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=300&h=300&fit=crop', title: 'Full Stack Development', desc: 'End-to-end web development with modern stacks.' },
  { image: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=300&h=300&fit=crop', title: 'Data Analytics', desc: 'Sql, Powerbi, Tableau – Data Analytics.' },
  { image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=300&h=300&fit=crop', title: 'Robotics and IoT', desc: 'Building smart hardware and connected systems.' },
  { image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=300&h=300&fit=crop', title: 'Career & Placement', desc: 'Professional guidance and industry placement support.' },
];

const benefits = [
  'Real-time industry projects',
  'Industry-recognized certificates',
  'Letter of recommendation',
  'Flexible remote/hybrid options',
  'Expert mentorship',
  'Portfolio-ready projects',
];

export default function Internship() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', college: '', course: '', track: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/internships', form);
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="internship-page">
      <section className="page-hero section-alt">
        <div className="container">
          <motion.span className="badge badge-blue" variants={fadeUp} initial="hidden" animate="visible">Internship Program</motion.span>
          <motion.h1 className="section-title" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            Real-Time <span className="gradient-text">Internships</span>
          </motion.h1>
          <motion.p className="section-subtitle" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            Gain hands-on industry experience with our structured internship programs
          </motion.p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="section-title">Internship <span className="gradient-text">Tracks</span></h2>
            <p className="section-subtitle">Choose from our diverse range of internship programs</p>
          </motion.div>
          <div className="grid-3">
            {programs.map((p, i) => (
              <motion.div
                key={p.title}
                className="card intern-card"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className="card-image-wrapper">
                  <img className="card-image" src={p.image} alt={p.title} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&h=300&fit=crop'; }} />
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="apply-intern">
        <div className="container">
          <div className="intern-split">
            <motion.div className="intern-info" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Why Intern with <span className="gradient-text">Sprouts?</span></h2>
              <p style={{ color: 'var(--subtext)', lineHeight: 1.8, marginBottom: 32 }}>
                Our internship programs are designed to bridge the gap between academics and industry.
                You'll work on real projects, get mentored by professionals, and build a portfolio that stands out.
              </p>
              <div className="benefits-grid">
                {benefits.map((b, i) => (
                  <motion.div key={b} className="benefit-item" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                    <span className="benefit-dot" />
                    {b}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className="intern-form-wrap" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {submitted ? (
                <div className="success-card card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="success-icon"><FiCheckCircle size={64} /></div>
                  <h2>Application Sent! 🎉</h2>
                  <p>Thank you for applying. Our team will review your details and contact you soon.</p>
                  <button className="btn btn-secondary" onClick={() => setSubmitted(false)}>Submit Another</button>
                </div>
              ) : (
                <form className="intern-form card" onSubmit={handleSubmit}>
                  <h3>Apply for Internship</h3>
                  <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Enter your name" />
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label>Email</label>
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="Email address" />
                    </div>
                    <div className="input-group">
                      <label>Phone</label>
                      <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required placeholder="Phone number" />
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label>College Name</label>
                      <input type="text" value={form.college} onChange={e => setForm({...form, college: e.target.value})} required placeholder="Your college" />
                    </div>
                    <div className="input-group">
                      <label>Course</label>
                      <input type="text" value={form.course} onChange={e => setForm({...form, course: e.target.value})} required placeholder="e.g. B.E CSE" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Internship Track</label>
                    <select value={form.track} onChange={e => setForm({...form, track: e.target.value})} required>
                      <option value="">Select a track</option>
                      {programs.map(p => <option key={p.title} value={p.title}>{p.title}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Submitting...' : <><FiSend /> Submit Application</>}
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
