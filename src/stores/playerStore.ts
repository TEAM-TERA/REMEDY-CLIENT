import { create } from 'zustand';
import TrackPlayer, { TrackType, Event, Capability } from 'react-native-track-player';
import Config from 'react-native-config';

type PlayerState = {
  queue: string[];
  currentId: string | null;
  autoPlay: boolean;
  isShuffleEnabled: boolean;
  isRepeatEnabled: boolean;
  isPlaylistMode: boolean; // Track if we're in playlist mode
  playlistMetas: Array<{title?: string; artist?: string; artwork?: string}>; // Store playlist metadata
  setQueue: (ids: string[]) => void;
  setCurrentId: (id: string | null) => void;
  setAutoPlay: (enabled: boolean) => void;
  setShuffleEnabled: (enabled: boolean) => void;
  setRepeatEnabled: (enabled: boolean) => void;
  skipToSongInPlaylist: (songId: string) => Promise<void>; // New function for skipping within playlist
  playIfDifferent: (songId: string, meta?: { title?: string; artist?: string; artwork?: string }) => Promise<void>;
  playPlaylist: (songIds: string[], startIndex?: number, songMetas?: Array<{title?: string; artist?: string; artwork?: string}>) => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentId: null,
  autoPlay: true,
  isShuffleEnabled: false,
  isRepeatEnabled: false,
  isPlaylistMode: false,
  playlistMetas: [],
  setQueue: (ids) => set({ queue: ids }),
  setAutoPlay: (enabled) => set({ autoPlay: enabled }),
  setShuffleEnabled: (enabled) => set({ isShuffleEnabled: enabled }),
  setRepeatEnabled: (enabled) => set({ isRepeatEnabled: enabled }),
  setCurrentId: (id) => {
    console.log('🔄 [STORE] playerStore.setCurrentId 호출됨:', {
      newId: id,
      type: typeof id,
      timestamp: new Date().toISOString()
    });
    set({ currentId: id });
  },
  skipToSongInPlaylist: async (songId) => {
    const { queue, isPlaylistMode } = get();

    if (!isPlaylistMode || !queue.includes(songId)) {
      console.log('Not in playlist mode or song not in queue');
      return;
    }

    try {
      const trackPlayerQueue = await TrackPlayer.getQueue();
      const targetIndex = trackPlayerQueue.findIndex(track => track.id === songId);

      if (targetIndex !== -1) {
        console.log('🎵 Skipping to song in playlist:', songId, 'at index:', targetIndex);
        await TrackPlayer.skip(targetIndex);
        await TrackPlayer.play();
        set({ currentId: songId });
        console.log('✅ Successfully skipped to song in playlist');
      } else {
        console.log('Song not found in TrackPlayer queue');
      }
    } catch (error) {
      console.error('Error skipping to song in playlist:', error);
    }
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

      // Set up TrackPlayer options for single track playback
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SeekTo,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
        progressUpdateEventInterval: 2,
        stopWithApp: false,
      });

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

      set({
        currentId: songId,
        queue: [songId], // Single track queue
        isPlaylistMode: false, // Single song mode
        playlistMetas: []
      });
      console.log('✅ Current ID set to:', songId);
    } catch (e) {
      console.error('❌ Failed to play song:', e);
    }
  },
  playPlaylist: async (songIds, startIndex = 0, songMetas = []) => {
    if (!songIds || songIds.length === 0) return;

    const streamBase = Config.MUSIC_STREAM_BASE_URL || Config.MUSIC_API_BASE_URL;
    console.log('🎵 Attempting to play playlist:', songIds);

    try {
      await TrackPlayer.reset();
      console.log('✅ TrackPlayer reset');

      // Add all tracks to TrackPlayer
      const tracks = songIds.map((songId, index) => {
        const meta = songMetas[index] || {};
        return {
          id: songId,
          url: `${streamBase}/hls/${songId}/playlist.m3u8`,
          title: meta.title || `음악 ${index + 1}`,
          artist: meta.artist || '알 수 없음',
          artwork: meta.artwork,
          type: TrackType.HLS,
        };
      });

      await TrackPlayer.add(tracks);
      console.log('✅ All tracks added to player');

      // Enable auto-advance to next track
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext],
        progressUpdateEventInterval: 1, // More frequent updates
        stopWithApp: false,
        alwaysShowPlayer: true,
      });

      // Skip to the start index if specified
      if (startIndex > 0 && startIndex < tracks.length) {
        await TrackPlayer.skip(startIndex);
      }

      await TrackPlayer.play();
      console.log('✅ Playlist play command sent');

      const startSongId = songIds[startIndex] || songIds[0];
      set({
        queue: songIds,
        currentId: startSongId,
        isPlaylistMode: true, // Enable playlist mode
        playlistMetas: songMetas // Store playlist metadata
      });
      console.log('✅ Queue and current ID set:', { queue: songIds, currentId: startSongId, isPlaylistMode: true });
    } catch (e) {
      console.error('❌ Failed to play playlist:', e);
    }
  },
  playNext: async () => {
    const { queue, currentId } = get();
    if (!queue || queue.length === 0 || !currentId) return;
    const idx = queue.indexOf(currentId);

    if (idx < queue.length - 1) {
      // Use TrackPlayer's built-in next if available
      try {
        const trackPlayerQueue = await TrackPlayer.getQueue();
        const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();

        if (trackPlayerQueue.length > 1 && currentTrackIndex !== undefined && currentTrackIndex < trackPlayerQueue.length - 1) {
          await TrackPlayer.skipToNext();
          const nextTrack = trackPlayerQueue[currentTrackIndex + 1];
          set({ currentId: nextTrack.id });
          return;
        }
      } catch (error) {
        console.log('TrackPlayer skip failed, using manual approach:', error);
      }

      // Fallback to manual approach - maintain playlist mode
      const nextId = queue[idx + 1];
      if (nextId) {
        const { isPlaylistMode, playlistMetas } = get();
        if (isPlaylistMode) {
          // Use skipToSongInPlaylist to maintain playlist context
          await get().skipToSongInPlaylist(nextId);
        } else {
          // Single song mode
          await get().playIfDifferent(nextId);
        }
      }
    }
  },
  playPrevious: async () => {
    const { queue, currentId } = get();
    if (!queue || queue.length === 0 || !currentId) return;
    const idx = queue.indexOf(currentId);

    if (idx > 0) {
      // Use TrackPlayer's built-in previous if available
      try {
        const trackPlayerQueue = await TrackPlayer.getQueue();
        const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();

        if (trackPlayerQueue.length > 1 && currentTrackIndex !== undefined && currentTrackIndex > 0) {
          await TrackPlayer.skipToPrevious();
          const prevTrack = trackPlayerQueue[currentTrackIndex - 1];
          set({ currentId: prevTrack.id });
          return;
        }
      } catch (error) {
        console.log('TrackPlayer skip failed, using manual approach:', error);
      }

      // Fallback to manual approach - maintain playlist mode
      const prevId = queue[idx - 1];
      if (prevId) {
        const { isPlaylistMode, playlistMetas } = get();
        if (isPlaylistMode) {
          // Use skipToSongInPlaylist to maintain playlist context
          await get().skipToSongInPlaylist(prevId);
        } else {
          // Single song mode
          await get().playIfDifferent(prevId);
        }
      }
    }
  },
}));

