### Lesson 2 - Project Setup ###

we will be using expo to build this app. 

1. create the project :

npx create-expo-app@latest DeliverApp --template blank-typescript

2. now we will install all dependencies we will be using throughout the project 
some versions of these are more stable ill be installing those. 

npm install --legacy-peer-deps \
  @reduxjs/toolkit react-redux \
  @react-navigation/native@^7.1.8 \
  @react-navigation/bottom-tabs@^7.4.0 \
  @react-navigation/stack@^7.7.2 \
  react-native-screens@~4.16.0 \
  react-native-safe-area-context@~5.6.0 \
  react-native-gesture-handler@~2.28.0 \
  react-native-reanimated@~4.1.1 \
  expo-secure-store@^15.0.8


