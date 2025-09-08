import { useEffect, useState } from 'react';
import { getPosition, getDuration } from '../../utils/spotifyPreviewPlayer';

export function usePreviewProgress(pollMs = 250) {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    let mounted = true;
    const interval = setInterval(async () => {
      try {
        const pos = await getPosition();
        const dur = await getDuration();

        if (mounted) {
          setPosition(pos ?? 0);
          setDuration(dur ?? 30);
        }
      } catch (e) {
        console.warn('Failed to get progress:', e);
      }
    }, pollMs);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [pollMs]);

  return { position, duration };
}
