import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
import MagneticButton from '../components/MagneticButton';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container">
        <motion.div 
          className="not-found-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="not-found-icon">
            <FiAlertTriangle size={80} />
          </div>
          <h1 className="gradient-text">404</h1>
          <h2>Page Not Found</h2>
          <p>
            The page you are looking for might have been removed, 
            had its name changed, or is temporarily unavailable.
          </p>
          <div className="not-found-actions">
            <MagneticButton className="btn btn-primary" to="/">
              <FiHome /> Back to Home
            </MagneticButton>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative motifs */}
      <div className="nf-motif motif-1"></div>
      <div className="nf-motif motif-2"></div>
    </div>
  );
}
