export const detectMood = (energy, valence) => {
  // High energy + high valence = Happy
  // Low energy + low valence = Sad
  // High energy + low valence = Angry
  // Otherwise = Chill
  
  if (energy > 0.5 && valence > 0.5) return 'Happy';
  if (energy <= 0.5 && valence <= 0.5) return 'Sad';
  if (energy > 0.5 && valence <= 0.5) return 'Angry';
  return 'Chill'; // Low energy + High valence
};

export const getMoodColors = (mood) => {
  switch (mood) {
    case 'Happy': return { bg: 'var(--bg-happy)', accent: '#fde047' };
    case 'Sad': return { bg: 'var(--bg-sad)', accent: '#60a5fa' };
    case 'Angry': return { bg: 'var(--bg-angry)', accent: '#ef4444' };
    case 'Chill': return { bg: 'var(--bg-chill)', accent: '#a855f7' };
    default: return { bg: '#000', accent: '#fff' };
  }
};
