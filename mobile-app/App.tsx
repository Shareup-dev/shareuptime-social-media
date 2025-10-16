import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import OfflineNotice from '@/components/OfflineNotice';
import ShareupAuthentication from '@/util/ShareupAuthentication';
import store from '@/redux/store';
import AppNavigator from '@/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
            <OfflineNotice />
            <ShareupAuthentication />
            <AppNavigator />
            <Toast />
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
