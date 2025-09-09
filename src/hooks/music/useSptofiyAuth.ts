import { useState, useEffect } from 'react';
import { authorize, refresh, AuthConfiguration } from 'react-native-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

const spotifyAuthConfig: AuthConfiguration = {
  clientId: Config.SPOTIFY_CLIENT_ID!,
  redirectUrl: 'remedy://auth-callback',
  scopes: [
    'app-remote-control',
    'user-modify-playback-state',
    'user-read-playback-state',
    'user-read-email',
    'user-read-private',
    'streaming',
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
      if (!refreshToken) return;
      try {
        const result = await refresh(spotifyAuthConfig, { refreshToken });
        setAccessToken(result.accessToken);
        await AsyncStorage.setItem('spotifyAccessToken', result.accessToken);
        if (result.refreshToken) {
          await AsyncStorage.setItem('spotifyRefreshToken', result.refreshToken);
        }
      } catch (err) {
        console.warn('spotify token refresh failed', err);
      }
    })();
  }, []);

  const login = async () => {
    try {
      const result = await authorize(spotifyAuthConfig);
      setAccessToken(result.accessToken);
      await AsyncStorage.setItem('spotifyAccessToken', result.accessToken);
      if (result.refreshToken) {
        await AsyncStorage.setItem('spotifyRefreshToken', result.refreshToken);
      }
    } catch (err) {
      console.error('Spotify login error:', err);
    }
  };

  return { accessToken, login };
}
