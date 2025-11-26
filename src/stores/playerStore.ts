import { create } from 'zustand';
import TrackPlayer, { TrackType, State, Event } from 'react-native-track-player';
import Config from 'react-native-config';

type PlayerState = {
  queue: string[];
  currentId: string | null;
  setQueue: (ids: string[]) => void;
  setCurrentId: (id: string | null) => void;
  playIfDifferent: (songId: string, meta?: { title?: string; artist?: string; artwork?: string }, forcePlay?: boolean) => Promise<void>;
  playNext: () => Promise<void>;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentId: null,
  setQueue: (ids) => set({ queue: ids }),
  setCurrentId: (id) => {
    set({ currentId: id });
  },
  playIfDifferent: async (songId, meta, forcePlay = false) => {
    const { currentId } = get();

    if (currentId === songId && !forcePlay) {
      return;
    }

    const streamBase = Config.MUSIC_STREAM_BASE_URL || Config.MUSIC_API_BASE_URL;
    const streamUrl = `${streamBase}/hls/${songId}/playlist.m3u8`;

    try {
      await TrackPlayer.reset();

      const trackData = {
        id: songId,
        url: streamUrl,
        title: meta?.title || '음악',
        artist: meta?.artist || '알 수 없음',
        artwork: meta?.artwork,
        type: TrackType.HLS,
      };

      await TrackPlayer.add(trackData);

      await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        subscription.remove();
        reject(new Error('재생 시작 타임아웃'));
      }, 5000); // 5초 타임아웃

      const subscription = TrackPlayer.addEventListener(Event.PlaybackState, (event: any) => {
        if (event.state === State.Playing) {
          clearTimeout(timeout);
          subscription.remove();
          resolve();
        } else if (event.state === State.Error) {
          clearTimeout(timeout);
          subscription.remove();
          reject(new Error('재생 실패'));
        }
      });

      TrackPlayer.play();
    });

      set({ currentId: songId });
    } catch (e) {
      console.error('음악 재생 실패:', e);
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


