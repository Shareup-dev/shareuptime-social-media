import React, { useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, Animated, StatusBar, Alert } from 'react-native';

import colors from '../config/colors';
import { useDispatch } from 'react-redux';
import { RNCamera } from 'react-native-camera';
import CameraBottomActions from '../components/CameraBottomActions';
import { launchImageLibrary } from 'react-native-image-picker';
import routes from '../navigation/routes';
import { postDataSliceAction } from '../redux/postDataSlice';

export default function ShareupCameraScreen({ navigation, route }) {
  let cameraRef;
  const postType = route.params;
  const dispatch = useDispatch();
  // State
  const [mode, setMode] = useState('photo');
  const [cameraType, setCameraType] = useState('back');
  const [capturing] = useState(false);
  const scale = useRef(new Animated.Value(0)).current;
  // const [duration, setDuration] = useState(10000);

  async function onCapture() {
    if (mode === 'photo') {
      await cameraRef
        .takePictureAsync({
          skipProcessing: true,
          quality: 0.5,
        })
        .then((res) => {
          const uris = [res].map((item) => {
            return item.uri;
          });

          dispatch(postDataSliceAction.setImages(uris));

          navigation.navigate(routes.ADD_POST, {
            postType: postType,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
    // else if (mode === 'video') {
    //   if (capturing) {
    //     return StopRecording();
    //   }
    //   setCapturing(true);
    //   startProgress();

    //   const video = await cameraRef.recordAsync({
    //     // maxDuration: 10,
    //     // quality: RNCamera.Constants.VideoQuality['288p'],
    //     quality: RNCamera.Constants.VideoQuality['480p'],
    //     orientation: 'portrait',
    //     mirrorVideo: Platform.OS == 'ios', // allows me to get a .mp4 video on iOS (it's .mov otherwise)
    //     mute: false,
    //     codec: Platform.OS == 'ios' ? RNCamera.Constants.VideoCodec.H264 : undefined,
    // })
    //     .then(data => {  })
    //     .catch(error => { console.error(error); })

    //   //setStory(video);
    // }
    //setScreen('view');
  }

  const imagePickHandler = () => {
    launchImageLibrary({
      //quality: 0.5,
      mediaType: mode,
      durationLimit: 1,
      // maxHeight: 500,
      //maxWidth: 320,
      videoQuality: 'medium',
      selectionLimit: 5,
    })
      .then((res) => {
        if (res.didCancel) return;
        else if (res.assets[0].duration > 3000) {
          Alert.alert('Ops..', "Sorry you can't upload this video", [null], {
            cancelable: true,
          });
        } else {
          const uris = res.assets.map((item) => {
            return item.uri;
          });

          dispatch(postDataSliceAction.setImages(uris));

          navigation.navigate(routes.ADD_POST, {
            postType: postType,
          });
          //   setStory(res.assets[0]);
          //   setScreen('view');
        }
      })
      .catch((e) => {
        console.error('Error reading an image', e?.message);
      });

    // if (result.didCancel === true) {
    //   return;
    // }
  };

  const handelRevertCamera = () => {
    setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  // addStoryHandler removed: posting stories is out of scope for this screen right now

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0000" barStyle="light-content" />
      <RNCamera
        style={[styles.camera]}
        ratio={'16:9'}
        captureAudio={true}
        ref={(ref) => {
          cameraRef = ref;
        }}
        type={cameraType}
      >
        <CameraBottomActions
          title={'Post'}
          onPickFile={imagePickHandler}
          onCapture={onCapture}
          onRevertCamera={handelRevertCamera}
          mode={mode}
          capturing={capturing}
          setMode={setMode}
          navigation={navigation}
        />
        <Animated.View style={[styles.progressBar, { transform: [{ scaleX: scale }] }]} />
      </RNCamera>
      {/* <ProgressBar indeterminate={isUploading} visible={isUploading} color={colors.iondigoDye}  /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  caption: {
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    borderRadius: 30,
    justifyContent: 'center',
    fontSize: 18,
    maxHeight: 100,
    height: '100%',
    width: '85%',
  },
  backgroundVideo: {
    flex: 1,
    zIndex: -5,
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  },
  progressBar: {
    backgroundColor: 'crimson',
    position: 'absolute',
    bottom: 0,
    width: 2.1,
    height: 6,
  },
  storyImgViewer: {
    flex: 1,
  },
  forwardArrow: {
    marginBottom: '8%',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    bottom: 20,
    paddingRight: 15,
    paddingLeft: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: colors.white,
  },
});
