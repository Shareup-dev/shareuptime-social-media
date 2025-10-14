import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';

import Icon from './Icon';
import colors from '../config/colors';

/**
 * @param {*} onPickFile: required
 * @param {*} onCapture: required
 * @param {*} onRevertCamera: required
 */
export default function CameraBottomActions({
  onPickFile,
  onCapture,
  onRevertCamera,
  mode,
  setMode,
  title,
  capturing = false,
  navigation,
  onlyVideo = false,
}) {
  const styles = StyleSheet.create({
    modeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#00000035',
      // width: '100%',
      // position: 'absolute',
      // bottom: 0,
    },
    Header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      borderBottomColor: '#cacaca',
      borderBottomWidth: 1,
      paddingVertical: 10,
      backgroundColor: '#33333325',
    },
    HeaderText: {
      color: '#fff',
      fontSize: 25,
      fontWeight: '600',
    },
    iconContainer: {
      flexDirection: 'row',
    },
    modeActive: {
      fontWeight: '800',
      fontSize: 18,
      color: 'darkred',
    },
    modeText: {
      fontWeight: '700',
      color: '#fdfdfd',
      fontSize: 17,
      marginHorizontal: 5,
    },
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems:'baseline',
      position: 'absolute',
      bottom: 0,
      zIndex: 1,
      paddingHorizontal: 20,
      height: 120,
    },
    bottomBtn: {
      paddingVertical: 10,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    captureButtonContainer: {
      height: 86,
      width: 86,
      borderRadius: 60,
      backgroundColor: colors.LightGray,
      justifyContent: 'center',
      alignItems: 'center',
    },
    captureButton: {
      backgroundColor: mode === 'video' ? 'darkred' : colors.white,
      borderRadius: capturing && mode === 'video' ? 5 : 60,
      width: capturing && mode === 'video' ? 50 : 76,
      height: capturing && mode === 'video' ? 50 : 76,
    },
    recordingText: {
      fontWeight: '500',
      fontSize: 17,
      color: '#fdfdfd',
    },
    recordingIcon: {
      width: 15,
      height: 15,
      borderRadius: 10,
      backgroundColor: 'crimson',
      marginHorizontal: 10,
      marginVertical: 10,
    },
    recordingContainer: {
      alignItems: 'center',
      backgroundColor: '#000',
      flexDirection: 'row',
    },
  });

  return (
    <>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <View style={styles.container}>
        <TouchableOpacity onPress={onPickFile}>
          <Icon type={'FontAwesome'} name={'file-photo-o'} size={64} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButtonContainer}
          onPress={onCapture}>
          <View style={styles.captureButton} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onRevertCamera}>
          <Icon type={'Ionicons'} name={'camera-reverse-outline'} size={64} />
        </TouchableOpacity>
      </View>
      <View style={styles.Header}>
        <Text style={styles.HeaderText}>{title}</Text>
        <View style={styles.iconContainer}>
         
          <TouchableOpacity onPress={_ => navigation.goBack()}>
            <Icon
              noBackground
              type="MaterialCommunityIcons"
              size={35}
              backgroundSizeRatio={1}
              name={'close'}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
      {capturing ? (
        <View style={styles.recordingContainer}>
          {/* <View style={styles.recordingIcon} /> */}
          {/* <Text style={styles.recordingText}>{` Recording..`}</Text> */}
        </View>
      ) : !onlyVideo && (

        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={styles.bottomBtn}
            onPress={() => setMode('photo')}>
            <Icon
              style={styles.icon}
              name={'camera'}
              noBackground
              color={mode === 'photo' ? 'crimson' : '#fff'}
              type="Entypo"></Icon>
            <Text
              style={[
                styles.modeText,
                {color: mode === 'photo' ? 'crimson' : '#fff'},
              ]}>
              Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMode('video')}
            style={styles.bottomBtn}>
            <Icon
              style={styles.icon}
              name={'video-camera'}
              noBackground
              color={mode === 'video' ? 'crimson' : '#fff'}
              type="Entypo"
            />
            <Text
              style={[
                styles.modeText,
                {color: mode === 'video' ? 'crimson' : '#fff'},
              ]}>
              Video
            </Text>
          </TouchableOpacity>
        </View>
      )}

    </>
  );
}
