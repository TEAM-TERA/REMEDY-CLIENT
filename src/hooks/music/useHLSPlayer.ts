import { useState, useEffect, useRef } from 'react';
import TrackPlayer, { Event, State, useTrackPlayerEvents } from 'react-native-track-player';
import axiosInstance from '../../modules/auth/api/axiosInstance';

interface MusicPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
}

interface HLSSegment {
  duration: number;
  url: string;
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

  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackTrackChanged, Event.PlaybackError], (event) => {
    if (event.type === Event.PlaybackState) {
      setState(prev => ({
        ...prev,
        isPlaying: event.state === State.Playing,
        isLoading: event.state === State.Loading || event.state === State.Buffering,
      }));
      
      if (event.state === State.Error) {
        setState(prev => ({ ...prev, error: '재생 중 오류가 발생했습니다' }));
      }
    }
    
    if (event.type === Event.PlaybackError) {
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
      // Progress 업데이트 실패 시 무시
    }
  };

  const parseHLSPlaylist = async (playlistUrl: string): Promise<HLSSegment[]> => {
    try {
      const response = await fetch(playlistUrl);
      const playlistText = await response.text();
      
      const lines = playlistText.split('\n');
      const segments: HLSSegment[] = [];
      let currentDuration = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('#EXTINF:')) {
          const durationMatch = line.match(/#EXTINF:([0-9.]+)/);
          if (durationMatch) {
            currentDuration = parseFloat(durationMatch[1]);
          }
        } else if (line && !line.startsWith('#')) {
          const segmentUrl = line.startsWith('http') 
            ? line 
            : `${axiosInstance.defaults.baseURL}/songs/${songId}/segments/${line}`;
          
          segments.push({
            duration: currentDuration,
            url: segmentUrl
          });
        }
      }
      
      return segments;
    } catch (error) {
      throw error;
    }
  };


  const loadMusic = async (songId: string) => {
    if (!songId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await TrackPlayer.reset();

      const hlsStreamUrl = `${axiosInstance.defaults.baseURL}/songs/${songId}/stream`;
      
      let processedHlsUrl = hlsStreamUrl;
      let trackTitle = '음악';
      let trackArtist = '알 수 없음';
      
      try {
        const response = await fetch(hlsStreamUrl);
        
        if (response.ok) {
          const text = await response.text();
          
          const processedM3U8 = text
            .split('\n')
            .map(line => {
              if (line && !line.startsWith('#') && !line.startsWith('http')) {
                const absoluteUrl = `${axiosInstance.defaults.baseURL}/songs/${songId}/segments/${line}`;
                return absoluteUrl;
              }
              return line;
            })
            .join('\n');
          
          const dataUrl = `data:application/vnd.apple.mpegurl;base64,${btoa(processedM3U8)}`;
          processedHlsUrl = dataUrl;
        }
      } catch (fetchError) {
      }

      try {
        const songInfoResponse = await fetch(`${axiosInstance.defaults.baseURL}/songs/${songId}`);
        if (songInfoResponse.ok) {
          const songInfo = await songInfoResponse.json();
          trackTitle = songInfo.title || '음악';
          trackArtist = songInfo.artist || '알 수 없음';
        }
      } catch (songInfoError) {
      }
      
      const track = {
        id: songId,
        url: processedHlsUrl,
        title: trackTitle,
        artist: trackArtist,
      };
      await TrackPlayer.add(track);

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      progressIntervalRef.current = setInterval(updateProgress, 1000);

      setState(prev => ({ ...prev, isLoading: false }));

      setTimeout(async () => {
        try {
          await TrackPlayer.play();
          setState(prev => ({ ...prev, isPlaying: true }));
        } catch (error) {
          // 자동 재생 실패 시 무시
        }
      }, 1000);

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : '음악 로드에 실패했습니다' 
      }));
    }
  };

  const togglePlay = async () => {
    try {
      const playerState = await TrackPlayer.getState();
      
      if (playerState === State.Playing) {
        await TrackPlayer.pause();
      } else {
        if (playerState === State.Buffering || playerState === State.Loading) {
          await TrackPlayer.stop();
          await TrackPlayer.play();
        } else {
          await TrackPlayer.play();
        }
      }
    } catch (error) {
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
    if (songId) {
      loadMusic(songId);
    }
  }, [songId]);

  return {
    ...state,
    loadMusic,
    togglePlay,
    seekTo,
  };
}