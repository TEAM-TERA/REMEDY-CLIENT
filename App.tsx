import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/modules/auth/auth-context';
import RootNavigation from './src/navigation';
import TrackPlayer, { Capability, RepeatMode } from 'react-native-track-player';
import { FPSCounter } from './src/components/FPSCounter';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분
      refetchOnMount: false, // 마운트 시 자동 refetch 방지
      refetchOnWindowFocus: false, // 포커스 시 자동 refetch 방지
      refetchOnReconnect: true, // 네트워크 재연결 시에만 refetch
    },
  },
});

export default function App() {
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await TrackPlayer.setupPlayer({
          autoHandleInterruptions: false,
          autoUpdateMetadata: true,
          waitForBuffer: true,
        });

        await TrackPlayer.updateOptions({
            capabilities: [
              Capability.Play,
              Capability.Pause,
              Capability.SeekTo,
            ],
            compactCapabilities: [
              Capability.Play,
              Capability.Pause,
            ],
        });

        // 무한 반복 모드를 기본값으로 설정
        await TrackPlayer.setRepeatMode(RepeatMode.Track);
        console.log('🔁 기본 무한 반복 모드 설정 완료');
      } catch (e) {
        console.warn('TrackPlayer setup failed:', e);
      }
    })();

    return () => {
      if (mounted) {
        TrackPlayer.reset(); 
        mounted = false;
      }
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RootNavigation />
          <FPSCounter />
        </QueryClientProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
