import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import RootNavigation from './src/navigation';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigation />
    </QueryClientProvider>
  );
}