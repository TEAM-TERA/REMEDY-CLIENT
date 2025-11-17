import { useState, useEffect, useRef } from 'react';
import { Image } from 'react-native';
import TrackPlayer, { Event, State, useTrackPlayerEvents, TrackType} from 'react-native-track-player';
import axiosInstance from '../../modules/auth/api/axiosInstance';
import Config from 'react-native-config';

interface MusicPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
}

export function useHLSPlayer(songId?: string) {
  const [state, setState] = useState<MusicPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: false,
    error: null,
  });

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  type TrackEvent =
    | { type: 'playback-state'; state: number }
    | { type: 'playback-error'; code?: string; message?: string }
    | { type: 'playback-active-track-changed'; index?: number; track?: string | number };
    
  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackActiveTrackChanged, Event.PlaybackError], (event: TrackEvent) => {
    if (event.type === 'playback-state') {
      setState(prev => ({
        ...prev,
        isPlaying: event.state === State.Playing,
        isLoading: event.state === State.Loading || event.state === State.Buffering,
      }));
      
      if (event.state === State.Error) {
        setState(prev => ({ ...prev, error: '재생 중 오류가 발생했습니다' }));
      }
    }
    
    if (event.type === 'playback-error') {
      setState(prev => ({ ...prev, error: '재생 에러가 발생했습니다' }));
    }
  });

  const updateProgress = async () => {
    try {
      const progress = await TrackPlayer.getProgress();
      const position = progress.position;
      const duration = progress.duration;
      
      setState(prev => ({
        ...prev,
        currentTime: position,
        duration: duration || 0,
      }));
    } catch (error) {
    }
  };



  const loadMusic = async (songId?: string, hlsPath?: string, imgUrl?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await TrackPlayer.reset();

      if (!hlsPath || hlsPath.trim() === '' || hlsPath === 'undefined') {
        console.warn('⚠️ Invalid hlsPath, using default:', hlsPath);
        hlsPath = `hls/${songId}/playlist.m3u8`;
      }

      const streamBase = Config.MUSIC_API_BASE_URL;
      const hlsStreamUrl = `${streamBase}/${hlsPath}`;

      try {
        const m3u8Response = await fetch(hlsStreamUrl);

        if (!m3u8Response.ok) {
          throw new Error(`M3U8 파일을 찾을 수 없습니다 (${m3u8Response.status})`);
        }

        const m3u8Text = await m3u8Response.text();

        if (m3u8Text.trim().startsWith('<html') || m3u8Text.trim().startsWith('<!DOCTYPE')) {
          throw new Error('M3U8 파일이 존재하지 않습니다');
        }

        console.log('M3U8 Content:', m3u8Text);
        
        const lines = m3u8Text.split('\n');
        const firstSegment = lines.find(line => line.trim() && !line.startsWith('#'));
        if (firstSegment) {
          const segmentUrl = firstSegment.startsWith('http') 
            ? firstSegment 
            : `${hlsStreamUrl.substring(0, hlsStreamUrl.lastIndexOf('/'))}/${firstSegment.trim()}`;
          console.log('First Segment URL:', segmentUrl);

          const segmentResponse = await fetch(segmentUrl, { method: 'HEAD' });
          console.log('Segment accessible:', segmentResponse.status);
        }
      } catch (debugError) {
        console.error('Debug fetch error:', debugError);
      }
      let trackTitle = '음악';
      let trackArtist = '알 수 없음';

      try {
        const songInfoResponse = await fetch(`${axiosInstance.defaults.baseURL}/songs/${songId}`);
        if (songInfoResponse.ok) {
          const songInfo = await songInfoResponse.json();
          trackTitle = songInfo.title || '음악';
          trackArtist = songInfo.artist || '알 수 없음';
          if (!imgUrl) {
            imgUrl = songInfo.albumImagePath;
          }
        }
      } catch (songInfoError) {
        console.error('노래 정보 조회 실패:', songInfoError);
      }

      const serverImageUrl = Image.resolveAssetSource(require('../../assets/images/normal_music.png')).uri;

      const track = {
        id: songId,
        url: hlsStreamUrl,
        title: trackTitle,
        artist: trackArtist,
        artwork: imgUrl && imgUrl.trim() !== '' ? imgUrl : serverImageUrl,
        album: trackTitle,
        genre: 'Music',
        type: TrackType.HLS,
        date: new Date().toISOString(),
      };
  
      console.log('Adding track:', track);
      await TrackPlayer.add(track);
  
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      progressIntervalRef.current = setInterval(updateProgress, 1000);
  
      setState(prev => ({ ...prev, isLoading: false }));
      
      try {
        await TrackPlayer.play();
        setState(prev => ({ ...prev, isPlaying: true }));
      } catch (playError) {
        console.error('Play error:', playError);
        setState(prev => ({ ...prev, error: '재생 실패' }));
      }
  
    } catch (error) {
      console.error('음악 로드 실패:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : '음악 로드에 실패했습니다' 
      }));
    }
  };

  const togglePlay = async () => {
    try {
      if (state.isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.error('Toggle play error:', error);
      setState(prev => ({ ...prev, error: '재생에 실패했습니다' }));
    }
  };

  const seekTo = async (position: number) => {
    try {
      await TrackPlayer.seekTo(position);
      setState(prev => ({ ...prev, currentTime: position }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'seek에 실패했습니다' }));
    }
  };

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadSong = async () => {
      if (!songId) return;

      try {
        const songInfoResponse = await fetch(`${axiosInstance.defaults.baseURL}/songs/${songId}`);
        if (songInfoResponse.ok) {
          const songInfo = await songInfoResponse.json();
          const hlsPath = songInfo.hlsPath || `hls/${songId}/playlist.m3u8`;
          const imgUrl = songInfo.albumImagePath;
          await loadMusic(songId, hlsPath, imgUrl);
        } else {
          const hlsPath = `hls/${songId}/playlist.m3u8`;
          await loadMusic(songId, hlsPath);
        }
      } catch (error) {
        console.error('곡 정보 조회 실패:', error);
        const hlsPath = `hls/${songId}/playlist.m3u8`;
        await loadMusic(songId, hlsPath);
      }
    };

    loadSong();
  }, [songId]);

  return {
    ...state,
    loadMusic,
    togglePlay,
    seekTo,
  };
}