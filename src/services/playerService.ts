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

    // When a track ends, automatically play next track if available
    if (event.state === State.Ended) {
      console.log('🎵 Track ended, checking for next track...');

      try {
        const queue = await TrackPlayer.getQueue();
        const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();

        console.log('Current track ended. Queue length:', queue.length, 'Current index:', currentTrackIndex);

        if (queue.length > 1 && currentTrackIndex !== undefined && currentTrackIndex < queue.length - 1) {
          console.log('🎵 Auto-advancing to next track...');

          // Add a small delay for HLS streams
          setTimeout(async () => {
            try {
              await TrackPlayer.skipToNext();
              await TrackPlayer.play();
              console.log('✅ Successfully advanced to next track');
            } catch (skipError) {
              console.error('❌ Error during skip:', skipError);
            }
          }, 500);
        } else {
          console.log('🏁 End of playlist reached');
        }
      } catch (error) {
        console.error('❌ Error in auto-advance logic:', error);
      }
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
