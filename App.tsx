import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/modules/auth/auth-context';
import RootNavigation from './src/navigation';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

export default function App() {
    return (
        <GestureHandlerRootView>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <RootNavigation />
                </QueryClientProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}
