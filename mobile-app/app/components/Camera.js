import React from 'react';

import {StyleSheet, Dimensions, StatusBar} from 'react-native';
import CameraHeader from './headers/CameraHeader';

export default function AppCamera({
  children,
  style,
  type,
  statusPadding = true,
  forwardRef,
}) {
  // return (
  //   <Camera
  //     ratio={'16:9'}
  //     ref={forwardRef}
  //     type={type}
  //     behavior={Platform.OS === 'ios' ? 'height' : 'height'}
  //     style={[
  //       styles.camera,
  //       {paddingTop: statusPadding ? StatusBar.currentHeight : 0},
  //       style,
  //     ]}>
  //     <CameraHeader title="Story " />
  //     {children}
  //   </Camera>
  // );
  return <></>;
}

const styles = StyleSheet.create({
  screen: {
    padding: 0,
    // paddingTop: StatusBar.currentHeight,
    // to add a top padding same as the hight of the statusbar hight of any device
    // and it will not add extra padding with SafeAreaView in ios
    flex: 1,
  },
  camera: {
    padding: 0,
    flex: 1,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  },
});
