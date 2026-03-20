import { motion } from 'framer-motion';
import './Preloader.css';

export default function Preloader() {
  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="preloader-content">
        <motion.div
          className="preloader-logo"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img src="https://ik.imagekit.io/Lourdu/Sprouts/logo.jpeg?updatedAt=1773849138906" alt="Sprouts Logo" />
        </motion.div>

        <motion.div
          className="preloader-bar-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="preloader-bar"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div
          className="preloader-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="preloader-text-inner">
            <h2 className="brand-name">Sprouts</h2>
            <span className="brand-tagline">Edutech and IT services</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
