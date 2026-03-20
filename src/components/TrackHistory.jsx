import { motion, AnimatePresence } from 'framer-motion';
import { History, X } from 'lucide-react';
import { useState } from 'react';

export const TrackHistory = ({ history }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="toggle-btn"
        style={{ right: 'auto', left: '2.5rem', bottom: '2.5rem' }}
      >
        <History size={20} />
        <span>Vibe History</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
              width: '320px',
              background: 'rgba(5, 5, 5, 0.8)',
              backdropFilter: 'blur(30px) saturate(150%)',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              zIndex: 200,
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              boxShadow: '20px 0 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="title-gradient" style={{ fontSize: '1.5rem', margin: 0 }}>History</h2>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.5 }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
              {history.length === 0 ? (
                <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Your music journey starts here...</p>
              ) : (
                history.map((item, i) => (
                  <motion.div
                    key={item.id + i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.03)',
                      padding: '12px',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <img 
                      src={item.albumArt} 
                      alt="Album Art" 
                      style={{ width: '48px', height: '48px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} 
                    />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.artist}
                      </p>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '2px 6px', 
                        background: 'rgba(255,255,255,0.1)', 
                        borderRadius: '4px',
                        marginTop: '4px',
                        display: 'inline-block',
                        fontWeight: 600,
                        color: item.moodColor
                      }}>
                        {item.mood}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 150,
            backdropFilter: 'blur(4px)',
          }}
        />
      )}
    </>
  );
};
