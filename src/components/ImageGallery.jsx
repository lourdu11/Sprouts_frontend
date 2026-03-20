import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import api from '../utils/api';
import './ImageGallery.css';

const ImageGallery = ({ images: incomingImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const images = useMemo(() => {
    if (!incomingImages) return [];
    if (Array.isArray(incomingImages)) {
      return incomingImages.flatMap(img => 
        typeof img === 'string' ? img.split(',').map(s => s.trim()).filter(Boolean) : img
      );
    }
    if (typeof incomingImages === 'string') {
      return incomingImages.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [incomingImages]);

  if (!images || images.length === 0) return null;

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const base = api.defaults.baseURL.replace('/api', '');
    return (base.endsWith('/') ? base.slice(0, -1) : base) + (url.startsWith('/') ? url : '/' + url);
  };

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, images.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => { touchStart.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e) => { touchEnd.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    touchStart.current = null;
    touchEnd.current = null;
  };

  return (
    <div 
      className="premium-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="carousel-track" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, i) => (
          <motion.div 
            key={i} 
            className="carousel-item"
            initial={false}
            animate={{ scale: i === currentIndex ? 1 : 0.95, opacity: i === currentIndex ? 1 : 0.6 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.img 
              src={getImageUrl(img)} 
              alt={`Slide ${i + 1}`} 
              onError={(e) => { e.target.src = 'https://ik.imagekit.io/Lourdu/Sprouts/logo.jpeg?updatedAt=1773849138906'; }} 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
            <div className="carousel-overlay" />
          </motion.div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button className="carousel-nav prev" onClick={(e) => { e.stopPropagation(); prevSlide(); }}>
            <FiArrowLeft />
          </button>
          <button className="carousel-nav next" onClick={(e) => { e.stopPropagation(); nextSlide(); }}>
            <FiArrowRight />
          </button>

          <div className="carousel-dots">
            {images.map((_, i) => (
              <button 
                key={i} 
                className={`dot ${i === currentIndex ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); goToSlide(i); }}
              />
            ))}
          </div>

          <div className="carousel-counter">
            Slide {currentIndex + 1}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageGallery;
