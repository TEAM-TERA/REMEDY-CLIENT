// src/modules/music/hooks/useSpotifyPlayer.ts
import { useEffect } from 'react';
import SpotifyRemote from 'react-native-spotify-remote';

export function useSpotifyPlayer(token: string | null) {
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        await SpotifyRemote.connect(token);
        console.log('Spotify Connected');
      } catch (err) {
        console.error('Spotify connect failed:', err);
      }
    })();
  }, [token]);

  const play = async (uri: string) => {
    try {
      await SpotifyRemote.playUri(uri);
    } catch (err) {
      console.error('Spotify play failed:', err);
    }
  };

  const pause = async () => {
    try {
      await SpotifyRemote.pause();
    } catch (err) {
      console.error('Spotify pause failed:', err);
    }
  };

  const resume = async () => {
    try {
      await SpotifyRemote.resume();
    } catch (err) {
      console.error('Spotify resume failed:', err);
    }
  };

  return { play, pause, resume };
}