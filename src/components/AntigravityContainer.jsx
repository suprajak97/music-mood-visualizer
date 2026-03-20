import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export const AntigravityContainer = ({ children, isAntigravity = true }) => {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100, mass: 0.5 };
  const floatX = useSpring(mouseX, springConfig);
  const floatY = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(floatY, [-100, 100], [5, -5]);
  const rotateY = useTransform(floatX, [-100, 100], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isAntigravity) {
        mouseX.set(0);
        mouseY.set(0);
        return;
      }
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth) - 0.5;
      const y = (clientY / innerHeight) - 0.5;
      
      mouseX.set(x * 100);
      mouseY.set(y * 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isAntigravity, mouseX, mouseY]);

  return (
    <motion.div 
      ref={containerRef}
      style={{ 
        x: floatX, 
        y: floatY,
        rotateX: rotateX,
        rotateY: rotateY,
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        perspective: '1200px',
        transformStyle: 'preserve-3d'
      }}
    >
      <div style={{ transform: 'translateZ(50px)' }}>
        {children}
      </div>
    </motion.div>
  );
};
