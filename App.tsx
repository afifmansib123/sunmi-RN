import React from 'react';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { AppNavigator } from '@/navigation/AppNavigator';

export default function App() {
  return (
    <ReduxProvider>
      <AppNavigator />
    </ReduxProvider>
  );
}
