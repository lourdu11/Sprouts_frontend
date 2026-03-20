import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Workshops', path: '/workshops' },
  { name: 'Internship', path: '/internship' },
  { name: 'Achievements', path: '/achievements' },
  { name: 'Contact', path: '/contact' },
];

const services = [
  'AI Training Programs',
  'AI Automation Services',
  'Web & AI Product Dev',
  'AI Freelance Hub',
  'Innovation Lab Programs',
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-gradient" />
      <div className="container">
        <div className="footer-grid">
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="footer-logo">
              <div className="logo-icon">
                <img src="https://ik.imagekit.io/Lourdu/Sprouts/logo.jpeg?updatedAt=1773849138906" alt="Sprouts Logo" />
              </div>
              <div>
                <h3>Sprouts</h3>
                <p>Edutech and IT services</p>
              </div>
            </div>
            <p className="footer-desc">
              Building a Learn–Build–Earn ecosystem empowering students with AI skills,
              real-world projects, and industry opportunities.
            </p>
            <div className="footer-social">
              <a href="https://www.linkedin.com/company/sprouts-pvt-ltd/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn"><FaLinkedin size={18} /></a>
              <a href="https://www.instagram.com/sprouts_orgs/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram"><FaInstagram size={18} /></a>
              <a href="https://wa.me/918610339739?text=Hi%20Sprouts%20Edutech%2C%20I'm%20interested%20in%20your%20services.%20Can%20you%20please%20provide%20more%20details%3F" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp"><FaWhatsapp size={18} /></a>
              <a href="mailto:sproutsorgs.official@gmail.com?subject=Inquiry%20regarding%20Sprouts%20Edutech%20Services&body=Dear%20Sprouts%20Edutech%20Team%2C%0D%0A%0D%0AI%20am%20interested%20in%20learning%20more%20about%20your%20services%20and%20workshops.%20Could%20you%20please%20provide%20more%20information%3F%0D%0A%0D%0AThank%20you." className="social-link" aria-label="Email"><FiMail size={18} /></a>
            </div>
            <div className="msme-badge">
              <span className="badge badge-green">✓ MSME Registered</span>
            </div>
          </motion.div>

          <motion.div
            className="footer-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="footer-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4>Services</h4>
            <ul>
              {services.map(service => (
                <li key={service}><span>{service}</span></li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="footer-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4>Contact Us</h4>
            <ul className="contact-list">
              <li><FiPhone size={14} /> <span><a href="https://wa.me/918610339739?text=Hi%20Sprouts%20Edutech%2C%20I'm%20interested%20in%20your%20services.%20Can%20you%20please%20provide%20more%20details%3F" target="_blank" rel="noopener noreferrer">8610339739</a> / <a href="https://wa.me/917845827272?text=Hi%20Sprouts%20Edutech%2C%20I'm%20interested%20in%20your%20services.%20Can%20you%20please%20provide%20more%20details%3F" target="_blank" rel="noopener noreferrer">7845827272</a></span></li>
              <li><FiMail size={14} /> <span><a href="mailto:sproutsorgs.official@gmail.com?subject=Inquiry%20regarding%20Sprouts%20Edutech%20Services&body=Dear%20Sprouts%20Edutech%20Team%2C%0D%0A%0D%0AI%20am%20interested%20in%20learning%20more%20about%20your%20services%20and%20workshops.%20Could%20you%20please%20provide%20more%20information%3F%0D%0A%0D%0AThank%20you.">sproutsorgs.official@gmail.com</a></span></li>
            </ul>
          </motion.div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Sprouts Edutech and IT services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
