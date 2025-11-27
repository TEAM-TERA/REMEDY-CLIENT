import TrackPlayer, { Event, State, Capability } from 'react-native-track-player';

export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });
  
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });
  
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop();
  });
  
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });
  
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });
  
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    TrackPlayer.seekTo(event.position);
  });

  TrackPlayer.addEventListener(Event.PlaybackState, async (event) => {
    console.log('PlaybackService - 재생 상태 변경:', event.state);

    // 트랙 종료 시 무한 반복으로 자동 재시작 (RepeatMode.Track이 처리)
    if (event.state === State.Ended) {
      console.log('🔁 Track ended - Infinite repeat mode will handle restart');
    }
  });

  TrackPlayer.addEventListener('playback-queue-ended', async (event) => {
    console.log('PlaybackService - 큐 종료:', event);
    // Queue has ended, all tracks have been played
  });

  TrackPlayer.addEventListener('playback-active-track-changed', async (event) => {
    console.log('PlaybackService - 활성 트랙 변경:', event);
    // Update playerStore with new current track
    if (event.track) {
      console.log('New active track:', event.track.title);
    }
  });
}
