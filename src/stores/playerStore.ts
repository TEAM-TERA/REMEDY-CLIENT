import { create } from 'zustand';
import TrackPlayer, { TrackType } from 'react-native-track-player';
import Config from 'react-native-config';

type PlayerState = {
  queue: string[];
  currentId: string | null;
  setQueue: (ids: string[]) => void;
  setCurrentId: (id: string | null) => void;
  playIfDifferent: (songId: string, meta?: { title?: string; artist?: string; artwork?: string }) => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentId: null,
  setQueue: (ids) => set({ queue: ids }),
  setCurrentId: (id) => {
    console.log('🔄 [STORE] playerStore.setCurrentId 호출됨:', {
      newId: id,
      type: typeof id,
      timestamp: new Date().toISOString()
    });
    set({ currentId: id });
  },
  playIfDifferent: async (songId, meta) => {
    const { currentId } = get();
    if (currentId === songId) {
      console.log('⏭️ Same song already playing, skipping:', songId);
      return;
    }
    const streamBase = Config.MUSIC_STREAM_BASE_URL || Config.MUSIC_API_BASE_URL;
    const streamUrl = `${streamBase}/hls/${songId}/playlist.m3u8`;
    console.log('🎵 Attempting to play:', songId);
    console.log('🔗 Stream URL:', streamUrl);
    console.log('📝 Meta:', meta);
    try {
      await TrackPlayer.reset();
      console.log('✅ TrackPlayer reset');

      await TrackPlayer.add({
        id: songId,
        url: streamUrl,
        title: meta?.title || '음악',
        artist: meta?.artist || '알 수 없음',
        artwork: meta?.artwork,
        type: TrackType.HLS,
      });
      console.log('✅ Track added to player');

      await TrackPlayer.play();
      console.log('✅ Play command sent');

      const state = await TrackPlayer.getPlaybackState();
      console.log('🎮 Playback state after play:', state);

      set({ currentId: songId });
      console.log('✅ Current ID set to:', songId);
    } catch (e) {
      console.error('❌ Failed to play song:', e);
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
  playPrevious: async () => {
    const { queue, currentId } = get();
    if (!queue || queue.length === 0 || !currentId) return;
    const idx = queue.indexOf(currentId);
    const prevId = queue[(idx - 1 + queue.length) % queue.length];
    if (!prevId || prevId === currentId) return;
    await get().playIfDifferent(prevId);
  },
}));

