import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView} from 'react-native';

import OfflineNotice from './app/components/OfflineNotice';
import Toast from 'react-native-toast-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ShareupAuthentication from './app/util/ShareupAuthentication';

export default function App() {
  return (
    <>
      {/* <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} /> */}
      <SafeAreaView></SafeAreaView>
      <OfflineNotice />
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
          <ShareupAuthentication />
        </NavigationContainer>
      </GestureHandlerRootView>
      <Toast />
    </>
  );
}
