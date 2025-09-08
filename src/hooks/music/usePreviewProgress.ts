import { useEffect, useState } from 'react';
import { getPosition, getDuration } from '../../utils/spotifyPreviewPlayer';

export function usePreviewProgress(pollMs = 250) {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    let mounted = true;
    const tick = async () => {
      const [p, d] = await Promise.all([getPosition(), getDuration()]);
      if (mounted) {
        setPosition(p || 0);
        if (d) setDuration(d);
      }
    };
    tick();
    const id = setInterval(tick, pollMs);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [pollMs]);

  return { position, duration };
}