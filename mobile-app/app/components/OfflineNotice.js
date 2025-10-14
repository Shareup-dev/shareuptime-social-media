import React, {useEffect} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';

import {useNetInfo} from '@react-native-community/netinfo';

import colors from '../config/colors';
import Text from './Text';

export default function OfflineNotice() {
  const {type, isInternetReachable} = useNetInfo();

 
  if (type !== 'unknown' && isInternetReachable === false)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No Internet Connection</Text>
      </View>
    );

  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.red,
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    top: StatusBar.currentHeight,
    width: '100%',
    zIndex: 1,
  },
  text: {
    color: colors.white,
    fontSize: 18,
  },
});
