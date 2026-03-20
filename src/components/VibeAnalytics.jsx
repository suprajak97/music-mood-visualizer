import { motion } from 'framer-motion';

export const VibeAnalytics = ({ features, onOverride }) => {
  if (!features) return null;

  const metrics = [
    { label: 'Energy', value: features.energy, color: '#fde047' },
    { label: 'Valence', value: features.valence, color: '#60a5fa' },
    { label: 'Tempo', value: features.tempo / 200, color: '#a855f7', displayValue: Math.round(features.tempo) + ' BPM' },
    { label: 'Dance', value: features.danceability, color: '#ef4444' },
  ];

  const moodColors = {
    Happy: '#fde047',
    Sad: '#60a5fa',
    Angry: '#ef4444',
    Chill: '#a855f7'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel"
      style={{
        position: 'fixed',
        right: '2.5rem',
        top: '2.5rem',
        width: '240px',
        padding: '1.5rem',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '0.9rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vibe Analytics</h3>
        {(features.isSimulated || features.isManual) && (
          <span style={{ 
            fontSize: '0.6rem', 
            padding: '2px 6px', 
            background: features.isManual ? 'rgba(0,255,150,0.2)' : 'rgba(255,150,0,0.2)', 
            color: features.isManual ? '#00ffa3' : '#ff9800', 
            borderRadius: '4px', 
            fontWeight: 800 
          }}>
            {features.isManual ? 'MANUAL' : 'SIMULATED'}
          </span>
        )}
      </div>
      
      {metrics.map((m) => (
        <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>{m.label}</span>
            <span>{m.displayValue || Math.round((m.value || 0) * 100) + '%'}</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(m.value * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ height: '100%', background: m.color, borderRadius: '2px' }}
            />
          </div>
        </div>
      ))}

      <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
        <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correct Vibe</p>
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'space-between' }}>
          {['Happy', 'Sad', 'Angry', 'Chill'].map(m => (
            <button
              key={m}
              onClick={() => onOverride(m)}
              className="mood-btn"
              style={{
                flex: 1,
                padding: '8px 4px',
                background: features.mood === m ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: `1px solid ${features.mood === m ? moodColors[m] : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '8px',
                color: features.mood === m ? 'white' : 'rgba(255,255,255,0.4)',
                fontSize: '0.6rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                fontWeight: 700,
                boxShadow: features.mood === m ? `0 0 15px ${moodColors[m]}33` : 'none'
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
