import React from 'react';
import { ReduxProvider } from './src/providers/ReduxProvider';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ReduxProvider>
      <AppNavigator />
    </ReduxProvider>
  );
}
