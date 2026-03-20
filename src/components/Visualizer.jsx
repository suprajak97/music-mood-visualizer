import { motion } from 'framer-motion';

export const Visualizer = ({ mood, tempo = 120, energy = 0.5 }) => {
  const pulseDuration = 60 / tempo; // seconds per beat
  const energyFactor = energy * 2; // Scale factor for animations

  const getShapes = () => {
    switch (mood) {
      case 'Happy':
        // Pulsing, drifting blobs
        return Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="visualizer-shape"
            style={{
              width: (Math.random() * 60 + 40) * energyFactor,
              height: (Math.random() * 60 + 40) * energyFactor,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, rgba(253, 224, 71, 0.4), transparent)`,
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(8px)',
            }}
            animate={{
              scale: [1, 1.5 + energy, 1],
              x: [0, (Math.random() - 0.5) * 100 * energyFactor, 0],
              y: [0, (Math.random() - 0.5) * 100 * energyFactor, 0],
              opacity: [0.2, 0.4 + energy * 0.2, 0.2],
            }}
            transition={{
              duration: (pulseDuration * 4) / energyFactor,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ));
      case 'Sad':
        // Soft, falling lines
        return Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="visualizer-shape"
            style={{
              width: '1px',
              height: (Math.random() * 40 + 20) * (1 - energy),
              background: 'linear-gradient(to bottom, rgba(96, 165, 250, 0.4), transparent)',
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: '-10%',
            }}
            animate={{
              y: ['0vh', '110vh'],
              opacity: [0, 0.4 + (1 - energy) * 0.2, 0],
            }}
            transition={{
              duration: (Math.random() * 3 + 2) / (1 - energy + 0.5),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "linear"
            }}
          />
        ));
      case 'Angry':
        // Sharp, rotating squares and rings
        return Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="visualizer-shape"
            style={{
              width: (150 + i * 50) * energyFactor,
              height: (150 + i * 50) * energyFactor,
              border: `1px solid rgba(239, 68, 68, ${0.1 + i * 0.05})`,
              position: 'absolute',
              left: '50%',
              top: '50%',
              marginLeft: -((150 + i * 50) * energyFactor) / 2,
              marginTop: -((150 + i * 50) * energyFactor) / 2,
              borderRadius: i % 2 === 0 ? '0%' : '50%',
            }}
            animate={{
              scale: [1, 1 + energy * 0.2, 1],
              rotate: i % 2 === 0 ? [0, 90 * energyFactor] : [0, -90 * energyFactor],
              opacity: [0.1, 0.2 + energy * 0.2, 0.1],
            }}
            transition={{
              duration: (pulseDuration * 2) / energyFactor,
              repeat: Infinity,
              ease: "anticipate"
            }}
          />
        ));
      case 'Chill':
        // Massive, slow-moving auroras
        return Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="visualizer-shape"
            style={{
              width: '80vw',
              height: '80vh',
              borderRadius: '100%',
              background: `radial-gradient(circle, rgba(168, 85, 247, ${0.05 + i * 0.02}) 0%, transparent 60%)`,
              position: 'absolute',
              left: `${(i - 1.5) * 30}%`,
              top: `${(i % 2 - 0.5) * 40}%`,
              filter: `blur(${60 * energyFactor}px)`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 200 * energyFactor, 0],
              y: [0, (Math.random() - 0.5) * 200 * energyFactor, 0],
              scale: [1, 1.2 + energy * 0.1, 1],
            }}
            transition={{
              duration: (20 + i * 5) / energyFactor,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ));
      default:
        return null;
    }
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none',
      zIndex: 1
    }}>
      {getShapes()}
    </div>
  );
};
