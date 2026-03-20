import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken, getCurrentlyPlaying, getAudioFeatures, loginToSpotify } from './services/spotify';
import { detectMood, getMoodColors } from './utils/moodDetector';
import { AntigravityContainer } from './components/AntigravityContainer';
import { Player } from './components/Player';
import { Visualizer } from './components/Visualizer';
import { FloatingAlbums } from './components/FloatingAlbums';
import { ParticleBackground } from './components/ParticleBackground';
import { VibeAnalytics } from './components/VibeAnalytics';
import { TrackHistory } from './components/TrackHistory';
import { Zap, ZapOff } from 'lucide-react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('spotify_access_token'));
  const [track, setTrack] = useState(null);
  const [features, setFeatures] = useState(null);
  const [mood, setMood] = useState('Chill');
  const [isAntigravity, setIsAntigravity] = useState(true);
  const [history, setHistory] = useState([]);
  const [overrides, setOverrides] = useState(() => {
    const saved = localStorage.getItem('vibe_overrides');
    return saved ? JSON.parse(saved) : {};
  });

  const handleOverride = (moodName) => {
    if (!track?.item?.id) return;
    
    const moodMap = {
      'Happy': { energy: 0.8, valence: 0.8 },
      'Sad': { energy: 0.2, valence: 0.2 },
      'Angry': { energy: 0.9, valence: 0.1 },
      'Chill': { energy: 0.3, valence: 0.7 }
    };

    const moodFeatures = moodMap[moodName];
    const newOverride = {
      ...moodFeatures,
      mood: moodName,
      isManual: true,
      tempo: features?.tempo || 120,
      danceability: features?.danceability || 0.5
    };

    const newOverrides = { ...overrides, [track.item.id]: newOverride };
    setOverrides(newOverrides);
    localStorage.setItem('vibe_overrides', JSON.stringify(newOverrides));
    
    setFeatures(newOverride);
    setMood(moodName);
  };

  // Handle OAuth Callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      getToken(code).then((data) => {
        if (data.access_token) {
          localStorage.setItem('spotify_access_token', data.access_token);
          setToken(data.access_token);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      });
    }
  }, []);

  // Poll for Currently Playing
  useEffect(() => {
    if (!token) return;

    const fetchTrack = async () => {
      try {
        const currentTrack = await getCurrentlyPlaying(token);
        if (currentTrack?.item?.id && currentTrack.item.id !== track?.item?.id) {
          setTrack(currentTrack);
          
          let audioFeatures;
          if (overrides[currentTrack.item.id]) {
            audioFeatures = overrides[currentTrack.item.id];
          } else {
            try {
              audioFeatures = await getAudioFeatures(token, currentTrack.item.id);
              if (audioFeatures.error) throw new Error(audioFeatures.error.message);
              if (typeof audioFeatures.energy === 'undefined') throw new Error('Missing audio features');
            } catch (err) {
              console.warn('Spotify Audio Features restricted. Using Stable Vibe Simulation.');
              const hash = currentTrack.item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
              audioFeatures = {
                energy: (hash % 100) / 100,
                valence: ((hash * 7) % 100) / 100,
                tempo: 60 + (hash % 120),
                danceability: ((hash * 3) % 100) / 100,
                isSimulated: true
              };
            }
          }

          setFeatures(audioFeatures);
          
          const detectedMood = detectMood(audioFeatures.energy, audioFeatures.valence);
          setMood(detectedMood);
          
          // Add to history
          const moodColors = getMoodColors(detectedMood);
          const historyItem = {
            id: currentTrack.item.id,
            name: currentTrack.item.name,
            artist: currentTrack.item.artists[0].name,
            albumArt: currentTrack.item.album.images[Math.min(currentTrack.item.album.images.length - 1, 1)].url,
            mood: detectedMood,
            moodColor: moodColors.accent,
            timestamp: Date.now()
          };
          
          setHistory(prev => [historyItem, ...prev.filter(i => i.id !== historyItem.id)].slice(0, 10));
        } else if (!currentTrack) {
          setTrack(null);
        }
      } catch (err) {
        if (err.status === 401) {
          localStorage.removeItem('spotify_access_token');
          setToken(null);
        }
      }
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 5000);
    return () => clearInterval(interval);
  }, [token, track]);

  const moodColors = getMoodColors(mood);

  if (!token) {
    return (
      <div className="app-container" style={{ background: '#050505' }}>
        <ParticleBackground mood="Chill" />
        <Visualizer mood="Chill" />
        <AntigravityContainer>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="login-card"
          >
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="title-gradient"
            >
              Music Mood
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{ marginBottom: '3rem' }}
            >
              Experience your music in zero gravity.
            </motion.p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loginToSpotify} 
              className="login-btn"
            >
              Connect to Spotify
            </motion.button>
          </motion.div>
        </AntigravityContainer>
        <FloatingAlbums />
      </div>
    );
  }

  return (
    <div className="app-container animated-bg" style={{ 
      '--current-bg': moodColors.bg,
    }}>
      <ParticleBackground mood={mood} />
      <AnimatePresence mode="wait">
        <Visualizer 
          key={mood} 
          mood={mood} 
          tempo={features?.tempo} 
          energy={features?.energy}
        />
      </AnimatePresence>
      
      <FloatingAlbums isAntigravity={isAntigravity} />
      
      <TrackHistory history={history} />
      <VibeAnalytics features={features} onOverride={handleOverride} />
      
      <AntigravityContainer isAntigravity={isAntigravity}>
        <AnimatePresence mode="wait">
          {track ? (
            <Player key={track.item.id} track={track} mood={mood} isAntigravity={isAntigravity} />
          ) : (
            <motion.div 
              key="no-track"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel"
            >
              <p>No track playing on Spotify...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </AntigravityContainer>

      <motion.button 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onClick={() => setIsAntigravity(!isAntigravity)}
        className="toggle-btn"
        title="Toggle Antigravity"
      >
        {isAntigravity ? <Zap size={20} /> : <ZapOff size={20} />}
        <span>{isAntigravity ? 'Antigravity ON' : 'Antigravity OFF'}</span>
      </motion.button>
    </div>
  );
}

export default App;
