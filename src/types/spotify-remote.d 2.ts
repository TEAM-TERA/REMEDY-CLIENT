declare module 'react-native-spotify-remote' {
  const _default: {
    remote: {
      connect(token: string): Promise<void>;
      disconnect?(): void | Promise<void>;
      playUri(uri: string): Promise<void>;
      pause(): Promise<void>;
      resume(): Promise<void>;
    };
    auth: any;
    ApiScope: any;
    RepeatMode: any;
  };
  export default _default;
}
