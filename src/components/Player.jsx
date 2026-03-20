import { motion } from 'framer-motion';

export const Player = ({ track, mood, isAntigravity = true }) => {
  if (!track) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="player-card"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '24px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        zIndex: 10,
        maxWidth: '300px'
      }}
    >
      <motion.img
        src={track.item.album.images[0].url}
        alt="Album Art"
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}
        animate={isAntigravity ? {
          y: [0, -10, 0],
          rotate: [0, 2, 0, -2, 0]
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>{track.item.name}</h2>
        <p style={{ opacity: 0.7, margin: '4px 0 0' }}>{track.item.artists[0].name}</p>
      </div>

      <div style={{
        marginTop: '8px',
        padding: '6px 12px',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '100px',
        fontSize: '0.85rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        Mood: {mood}
      </div>
    </motion.div>
  );
};
