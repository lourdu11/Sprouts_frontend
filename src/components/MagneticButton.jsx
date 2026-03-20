import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function MagneticButton({ children, className, onClick, to, style }) {
  const ref = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const onMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    mouseX.set(distanceX * 0.4);
    mouseY.set(distanceY * 0.4);
  };

  const onMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (to) {
    return (
      <Link to={to} style={{ display: 'inline-block', textDecoration: 'none', ...style }}>
        <motion.div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className={className}
          style={{ x, y }}
        >
          {children}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={className}
      style={{ ...style, x, y }}
    >
      {children}
    </motion.button>
  );
}
