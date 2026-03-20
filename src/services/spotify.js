const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = window.location.origin + window.location.pathname.replace(/\/$/, '') + '/callback';
if (REDIRECT_URI.includes('github.io')) {
  // Ensure the trailing slash or missing index.html doesn't break development redirects
}
const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
];

export const generateCodeVerifier = () => {
  const allowed = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let codeVerifier = '';
  for (let i = 0; i < 128; i++) {
    codeVerifier += allowed.charAt(Math.floor(Math.random() * allowed.length));
  }
  return codeVerifier;
};

export const generateCodeChallenge = async (codeVerifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const loginToSpotify = async () => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  localStorage.setItem('spotify_code_verifier', codeVerifier);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES.join(' '),
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });
  
  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const getToken = async (code) => {
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  
  return await response.json();
};

export const getCurrentlyPlaying = async (token) => {
  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (response.status === 401) {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }
  
  if (response.status === 204 || response.status > 400) return null;
  return await response.json();
};

export const getAudioFeatures = async (token, id) => {
  const response = await fetch(`https://api.spotify.com/v1/audio-features/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }
  
  return await response.json();
};
