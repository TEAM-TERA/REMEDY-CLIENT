import { create } from 'zustand';
import TrackPlayer, { TrackType } from 'react-native-track-player';
import Config from 'react-native-config';

type PlayerState = {
  queue: string[];
  currentId: string | null;
  setQueue: (ids: string[]) => void;
  playIfDifferent: (songId: string, meta?: { title?: string; artist?: string; artwork?: string }) => Promise<void>;
  playNext: () => Promise<void>;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentId: null,
  setQueue: (ids) => set({ queue: ids }),
  playIfDifferent: async (songId, meta) => {
    const { currentId } = get();
    if (currentId === songId) return;
    const streamBase = Config.MUSIC_STREAM_BASE_URL || Config.MUSIC_API_BASE_URL;
    const streamUrl = `${streamBase}/hls/${songId}/playlist.m3u8`;
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: songId,
        url: streamUrl,
        title: meta?.title || '음악',
        artist: meta?.artist || '알 수 없음',
        artwork: meta?.artwork,
        type: TrackType.HLS,
      });
      await TrackPlayer.play();
      set({ currentId: songId });
    } catch (e) {
    }
  },
  playNext: async () => {
    const { queue, currentId } = get();
    if (!queue || queue.length === 0 || !currentId) return;
    const idx = queue.indexOf(currentId);
    const nextId = queue[(idx + 1) % queue.length];
    if (!nextId || nextId === currentId) return;
    await get().playIfDifferent(nextId);
  },
}));


