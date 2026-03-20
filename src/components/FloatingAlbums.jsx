import { motion } from 'framer-motion';

export const FloatingAlbums = ({ isAntigravity = true }) => {
  // Simulate some background drifting objects
  const objects = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 30 + 30,
    delay: Math.random() * -20,
    opacity: Math.random() * 0.1 + 0.05,
    blur: Math.random() * 4,
    z: Math.random() * -100, // Z-depth simulation
  }));

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0,
      perspective: '1000px'
    }}>
      {objects.map((obj) => (
        <motion.div
          key={obj.id}
          style={{
            position: 'absolute',
            left: `${obj.x}%`,
            top: `${obj.y}%`,
            width: obj.size,
            height: obj.size,
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: `blur(${obj.blur}px)`,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            opacity: obj.opacity,
            z: obj.z,
          }}
          animate={isAntigravity ? {
            x: [0, (Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400, 0],
            y: [0, (Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 0.9, 1],
          } : {}}
          transition={{
            duration: obj.duration,
            repeat: Infinity,
            delay: obj.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};
