declare module 'react-native-spotify-remote' {
  // 기본 내보내기 객체에 remote 등이 들어있는 형태
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
