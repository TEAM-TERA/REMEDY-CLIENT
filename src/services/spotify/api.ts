import axios from 'axios';
import { getSpotifyAccessToken } from './client';

const spotify = axios.create({ baseURL: 'https://api.spotify.com/v1' });

export type SpotifyTrack = {
  id: string;
  title: string;
  artist: string;
  duration: number;
  imageUrl?: string;
  previewUrl?: string;
};

export async function searchTracks(q: string, signal?: AbortSignal): Promise<SpotifyTrack[]> {
  const token = await getSpotifyAccessToken();

  const { data } = await spotify.get('/search', {
    params: { q, type: 'track', limit: 20 },
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });

  const items = (data?.tracks?.items ?? []) as any[];
  const playable = items.filter((t) => !!t.preview_url);

  return items.map((t) => {
    const imgs = t.album?.images ?? [];
    const imageUrl = imgs[1]?.url || imgs[0]?.url || imgs[2]?.url;
    return {
      id: t.id,
      title: t.name,
      artist: t.artists?.map((a: any) => a.name).join(', ') ?? '',
      duration: Math.round((t.duration_ms ?? 0) / 1000),
      imageUrl,
      previewUrl: t.preview_url,
    } as SpotifyTrack;
  });
}
