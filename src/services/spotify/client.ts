import axios from 'axios';
import Config from 'react-native-config';

let accessToken: string | null = null;
let expiresAt = 0;

export async function getSpotifyAccessToken() {
  const now = Date.now();
  if (accessToken && now < expiresAt - 60_000) return accessToken;

  const body = new URLSearchParams({ grant_type: 'client_credentials' }).toString();

  const res = await axios.post(
    'https://accounts.spotify.com/api/token',
    body,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      auth: {
        username: Config.SPOTIFY_CLIENT_ID!,
        password: Config.SPOTIFY_CLIENT_SECRET!,
      },
    }
  );

  accessToken = res.data.access_token as string;
  expiresAt = now + (res.data.expires_in as number) * 1000;
  return accessToken!;
}
