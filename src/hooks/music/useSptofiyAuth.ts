import { useState, useEffect } from 'react';
import { authorize, refresh, AuthConfiguration } from 'react-native-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const spotifyAuthConfig: AuthConfiguration = {
  clientId: 'YOUR_CLIENT_ID',
  redirectUrl: 'remedy://auth-callback', // Spotify Dashboard에 등록된 Redirect URI
  scopes: [
    'user-read-email',
    'user-read-private',
    'streaming',
    'user-modify-playback-state',
    'user-read-playback-state',
  ],
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  },
};

export function useSpotifyAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const refreshToken = await AsyncStorage.getItem('spotifyRefreshToken');
      if (refreshToken) {
        try {
          const result = await refresh(spotifyAuthConfig, { refreshToken });
          setAccessToken(result.accessToken);
          await AsyncStorage.setItem('spotifyAccessToken', result.accessToken);
        } catch (err) {
          console.warn('refresh failed', err);
        }
      }
    })();
  }, []);

  const login = async () => {
    try {
      const result = await authorize(spotifyAuthConfig);
      setAccessToken(result.accessToken);
      await AsyncStorage.setItem('spotifyAccessToken', result.accessToken);
      await AsyncStorage.setItem('spotifyRefreshToken', result.refreshToken ?? '');
    } catch (err) {
      console.error('Spotify login error:', err);
    }
  };

  return { accessToken, login };
}
