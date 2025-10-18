import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Text,
} from 'react-native';

import colors from '../config/colors';

import { RNCamera } from 'react-native-camera';
import CameraBottomActions from '../components/CameraBottomActions';
import CameraHeader from '../components/headers/CameraHeader';
import Icon from '../components/Icon';
import { launchImageLibrary } from 'react-native-image-picker';
import AuthContext from '../authContext';
import Video from 'react-native-video';
import ReelService from '../services/Reels.service';
import { ProgressBar } from 'react-native-paper';

export default function AddReelScreen({ navigation }) {
  let cameraRef;
  // playerRef is not used
  // let playerRef = useRef();

  const windowWidth = Dimensions.get('screen').width;

  const { userData } = useContext(AuthContext)?.userState;

  const [isUploading, setIsUploading] = useState(false);
  const [screen, setScreen] = useState('capture');
  const [cameraType, setCameraType] = useState('back');
  const [capturing, setCapturing] = useState(false);
  const [story, setReel] = useState({});

  // const [timer, setTimer] = useState(0);
  // const [duration, setDuration] = useState(20000);
  const [caption, setCaption] = useState('');

  async function StopRecording() {
    // stopInterval();
    await cameraRef.stopRecording();
    setCapturing(false);
  }

  // const startInterval = _ =>
  //   setInterval(() => {
  //     if(timer === 30) {
  //       return StopRecording();
  //     }
  //     setTimer(prev => prev + 1);
  //   }, 1000);

  // const stopInterval = _ => clearInterval(startInterval);

  async function onCapture() {
    if (capturing) {
      return StopRecording();
    }
    setCapturing(true);

    // startInterval();
    cameraRef
      .recordAsync({
        maxDuration: 10,
        quality: RNCamera.Constants.VideoQuality['288p'],
      })
      .then((res) => console.log(res));

    // setReel(video);
    setScreen('view');
  }

  // useEffect(() => {
  //   return () => {
  //     stopInterval();
  //   };
  // }, []);

  const imagePickHandler = () => {
    launchImageLibrary({
      quality: 0.5,
      mediaType: 'video',
      durationLimit: 1,
      selectionLimit: 1,
      maxHeight: 500,
      maxWidth: 320,
      videoQuality: 'medium',
    })
      .then((res) => {
        if (res.didCancel) return;
        else if (res.assets[0].duration > 30) {
          Alert.alert('Ops..', "Sorry you can't upload this video", [null], {
            cancelable: true,
          });
        } else {
          setReel(res.assets[0]);
          setScreen('view');
        }
      })
      .catch((e) => {
        console.error('Error reading an image', e?.message || e);
      });
  };

  const handelRevertCamera = () => {
    setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const addReelHandler = async () => {
    setIsUploading(true);

    let reelData = new FormData();

    const uniId = new Date().valueOf();
    reelData.append('caption', caption);
    reelData.append('stryfiles', {
      name: `story-video-${uniId}.mp4`,
      type: 'video/mp4',
      uri: story.uri,
    });

    ReelService.addStory(userData.id, reelData)
      .then((res) => res)
      .catch((e) => console.error(e.message))
      .finally((_) => {
        setIsUploading(false);
        navigation.goBack();
      });
  };

  function timeConvert(num) {
    var hours = Math.floor(num / 60);
    var minutes = num % 60 < 10 ? '0' + (num % 60) : num % 60;
    return hours + ' : ' + minutes;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      {screen === 'capture' ? (
        <RNCamera
          style={styles.camera}
          ratio={'16:9'}
          captureAudio={true}
          ref={(ref) => {
            cameraRef = ref;
          }}
          type={cameraType}
        >
          <CameraBottomActions
            onlyVideo={true}
            title="Reels"
            onPickFile={imagePickHandler}
            navigation={navigation}
            onCapture={onCapture}
            onRevertCamera={handelRevertCamera}
            mode={'video'}
            capturing={capturing}
          />
        </RNCamera>
      ) : (
        <View style={styles.storyImgViewer}>
          <CameraHeader title="Story" onClosePress={() => setScreen('capture')} />
          <View style={styles.forwardArrow}>
            <TextInput
              placeholder="Caption"
              value={caption}
              onChangeText={(e) => setCaption(e)}
              multiline
              style={styles.caption}
            />
            <TouchableOpacity activeOpacity={0.6} disabled={isUploading} onPress={addReelHandler}>
              <Icon
                type={'AntDesign'}
                color={'#333'}
                name={'arrowright'}
                size={50}
                style={{
                  marginLeft: 5,
                }}
              />
            </TouchableOpacity>
          </View>

          <Video
            resizeMode={'cover'}
            style={[styles.backgroundVideo]}
            source={{ uri: story.uri }}
            repeat
          />
        </View>
      )}
      <ProgressBar indeterminate={isUploading} visible={isUploading} color={'crimson'} />
    </View>
  );
}
const styles = StyleSheet.create({
  caption: {
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    borderRadius: 30,
    fontSize: 18,
    maxHeight: 100,
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
  storyImgViewer: {
    flex: 1,
  },
  forwardArrow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
