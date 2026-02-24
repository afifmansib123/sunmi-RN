### Lesson 3 - creating necessary files ###

1. we creae babel.config.js for module exports.

  module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: ['react-native-reanimated/plugin'],
    };
  };

2. create .env  with BASE_URL

3. update tsconfig.ts

  {
    "extends": "expo/tsconfig.base",
    "compilerOptions": {
      "strict": true,
      "baseUrl": ".",
      "paths": { "@/*": ["src/*"] }
    }
  }

4. new App.tsx 
This is the entry point of the entire app.
ReduxProvider wraps everything so every screen can access Redux.
AppNavigator handles all routing (login vs main app).

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

