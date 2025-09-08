import TrackPlayer, { State } from 'react-native-track-player';

let _isSetup = false;

export async function ensureSetup() {
  if (_isSetup) return;
  await TrackPlayer.setupPlayer({});
  _isSetup = true;
}

type LoadParams = {
  id: string;
  title: string;
  artist: string;
  artwork?: string;
  previewUrl: string;
};

export async function loadAndPlayPreview({
    id, title, artist, artwork, previewUrl,
  }: {
    id: string; title: string; artist: string; artwork?: string; previewUrl: string;
  }) {
    if (!previewUrl) throw new Error('NO_PREVIEW_URL');
    await TrackPlayer.reset();
    await TrackPlayer.add({ id, url: previewUrl, title, artist, artwork, duration: 30 });
    await TrackPlayer.play();
  }
  
  export async function togglePlay() {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) await TrackPlayer.pause();
    else await TrackPlayer.play();
  }

export async function play() {
  await ensureSetup();
  await TrackPlayer.play();
}

export async function pause() {
  await ensureSetup();
  await TrackPlayer.pause();
}


export async function seekTo(seconds: number) {
  await ensureSetup();
  await TrackPlayer.seekTo(seconds);
}

export async function getPosition() {
  return TrackPlayer.getPosition();
}
export async function getDuration() {
  return TrackPlayer.getDuration();
}
