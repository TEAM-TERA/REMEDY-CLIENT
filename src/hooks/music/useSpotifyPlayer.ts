import { useEffect } from 'react';
//import { remote } from 'react-native-spotify-remote';

export function useSpotifyPlayer(token: string | null) {
  useEffect(() => {
    if (!token) return;

    let unsubConnected: (() => void) | undefined;

    (async () => {
      try {
        //const ok = await remote.connect(token);
        console.log('remote.connect ->', ok);

        // 준비 완료 이벤트
        const onConnected = () => console.log('remoteConnected (player ready)');
        //remote.addListener('remoteConnected', onConnected);
        //unsubConnected = () => remote.removeListener('remoteConnected', onConnected);
      } catch (e) {
        console.error('Spotify connect failed', e);
      }
    })();

    return () => {
      try {
        unsubConnected?.();
        //remote.disconnect();
      } catch {}
    };
  }, [token]);

  const play = async (uri: string) => {
    try {
      //await remote.playUri(uri);
    } catch (err) {
      console.error('Spotify play failed:', err);
    }
  };

  const pause = async () => {
    try {
      //await remote.pause();
    } catch (err) {
      console.error('Spotify pause failed:', err);
    }
  };

  const resume = async () => {
    try {
      //await remote.resume();
    } catch (err) {
      console.error('Spotify resume failed:', err);
    }
  };

  return { play, pause, resume };
}
