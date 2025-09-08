declare module 'react-native-spotify-remote' {
    export interface SpotifyRemoteType {
      connect: (token: string) => Promise<void>;
      playUri: (uri: string, startPositionMs?: number) => Promise<void>;
      pause: () => Promise<void>;
      resume: () => Promise<void>;
    }
  
    const SpotifyRemote: SpotifyRemoteType;
    export default SpotifyRemote;
  }
  