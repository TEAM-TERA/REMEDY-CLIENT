import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/modules/auth/auth-context';
import RootNavigation from './src/navigation';
import TrackPlayer, { Capability } from 'react-native-track-player';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await TrackPlayer.setupPlayer({
          autoHandleInterruptions: true,
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
        console.log('TrackPlayer 설정 완료');
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
        </QueryClientProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
