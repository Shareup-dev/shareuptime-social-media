import React, {memo, useEffect, useReducer, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';

import Video from 'react-native-video';
import Icon from '../components/Icon';
import colors from '../config/colors';
import fileStorage from '../config/fileStorage';
import DownModal from '../components/drawers/DownModal';

const windowWidth = Dimensions.get('screen').width;

const StoryViewScreen = ({navigation, route}) => {
  const {
    stories_List: data,
    firstName,
    lastName,
    profilePicture,
  } = route.params;

  // const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [Loaded, setLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  //  ----------------------- TIMER REDUCER ----------------------------//
  const initState = {
    duration: 6000,
    startedTime: 0,
    pausedTime: 0,
  };

  const actions = {
    START_TIMER: 'START_TIMER',
    PAUSE_TIMER: 'PAUSE_TIMER',
    RESET_TIMER: 'RESET_TIMER',
  };

  const timerReducer = (prevState, action) => {
    switch (action.type) {
      case actions.START_TIMER:
        return {
          ...prevState,
          startedTime: action.startTime,
        };
      case actions.PAUSE_TIMER:
        return {
          ...prevState,
          pausedTime: action.pausedTime,
          duration: action.duration,
        };
      case actions.RESET_TIMER:
        return initState;

      default:
        return initState;
    }
  };
  const [timerState, dispatch] = useReducer(timerReducer, initState);

  const width = [];
  data.map(_ => width.push(useRef(new Animated.Value(0)).current));

  // Start progress animations
  const startProgress = () => {
    let startTime = new Date().valueOf();
    dispatch({type: actions.START_TIMER, startTime});

    Animated.timing(width[activeIndex], {
      toValue: windowWidth / data.length - 2,
      useNativeDriver: false,
      duration: timerState.duration,
    }).start(({finished}) => {
      if (finished)
        if (activeIndex !== data.length - 1) {
          dispatch({type: actions.RESET_TIMER});
          setLoaded(false);
          setActiveIndex(prev => prev + 1);
        } else navigation.popToTop();
    });
  };
  // Pause progress animations
  const pauseProgress = () => {
    let pausedTime = new Date().valueOf();
    const {duration, startedTime} = timerState;
    const currentDuration = duration - (pausedTime - startedTime);

    dispatch({
      type: actions.PAUSE_TIMER,
      pausedTime,
      duration: currentDuration,
    });
    Animated.timing(width[activeIndex]).stop();
  };

  // const handleCloseModel = () => {
  //   setMenuOpen(false);
  //   startProgress();
  // };

  // const handleDelete = () => {
  //   Alert.alert('Delete this?', 'Are you sure to delete this story?', [
  //     {text: "Don't delete", style: 'cancel', onPress: () => {}},
  //     {
  //       text: 'Delete',
  //       style: 'destructive',
  //       onPress: () => {},
  //     },
  //   ]);
  // };

  useEffect(() => {
    if (Loaded) {
      startProgress();
    }
    // return () => {
    //   Animated.timing(width[activeIndex]).stop();
    // };
  }, [Loaded]);

  // const DropDownMenu = () => {
  //   return (
  //     <View style={styles.menuContainer}>
  //       <View style={{alignItems: 'center'}}>
  //         <View
  //           style={{
  //             backgroundColor: '#cacaca',
  //             width: 80,
  //             height: 6,
  //             borderRadius: 6,
  //           }}
  //         />
  //       </View>
  //       <TouchableOpacity style={styles.menu}>
  //         <View>
  //           <Text style={styles.menuText}>Edit</Text>
  //           <Text>Edit the Caption</Text>
  //         </View>
  //         <Icon size={45} name={'edit'} type="Entypo" />
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.menu} onPress={handleDelete}>
  //         <View>
  //           <Text style={styles.menuText}>Delete</Text>
  //           <Text>Delete your story</Text>
  //         </View>
  //         <Icon size={45} name={'delete'} color="crimson" />
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.menu}>
  //         <View>
  //           <Text style={styles.menuText}>Hide this story</Text>
  //           <Text
  //             style={{
  //               maxWidth: windowWidth / 2,
  //             }}>{`Posted by @${route.params?.userName}`}</Text>
  //         </View>
  //         <Icon size={45} name={'eye-with-line'} type="Entypo" />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  const StorySlides = memo(() => {
    return (
      <View style={{position: 'absolute', zIndex: 10}}>
        <View style={{flexDirection: 'row'}}>
          {data.map((item, index) => (
            <View
              key={index}
              style={{
                paddingHorizontal: 1,
                width: windowWidth / data.length,
              }}>
              <View
                style={{
                  borderRadius: 6,
                  backgroundColor: '#CACACA',
                }}>
                <Animated.View
                  style={{
                    backgroundColor: '#00000099',
                    width: width[index],

                    borderRadius: 6,
                    height: 4,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <View style={styles.profileImg}>
              <Image
                source={require('../assets/icons/user-icon.png')}
                resizeMode={'center'}
                style={styles.userProfileImg}
              />
            </View>
            <Text style={styles.userName}>{`${firstName} ${lastName}`}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            {/* <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => {
                setMenuOpen(true);
                pauseProgress();
              }}>
              <Icon
                name={'options'}
                type={'SimpleLineIcons'}
                size={54}
                backgroundColor={'unset'}
                noBackground={true}
              />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={[styles.closeIcon, styles.shadow]}
              onPress={() => {
                navigation.popToTop();
              }}>
              <Icon
                name={'close'}
                type={'AntDesign'}
                size={54}
                backgroundColor={'unset'}
                noBackground={true}
              />
            </TouchableOpacity>
            {/* <DownModal isVisible={menuOpen} setIsVisible={handleCloseModel}>
              <DropDownMenu />
            </DownModal> */}
          </View>
        </View>
      </View>
    );
  }, []);
  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => {
          setPaused(true);
          pauseProgress();
        }}
        onPressOut={() => {
          setPaused(false);
          startProgress();
        }}>
        <StorySlides />
        {data[activeIndex]?.video ? (
          <Video
            ref={ref => (this.player = ref)}
            paused={paused}
            onLoad={_ => setLoaded(true)}
            resizeMode={'cover'}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000',
            }}
            source={{
              uri: fileStorage.baseUrl + data[activeIndex].video,
            }}
          />
        ) : (
          <Image
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000',
            }}
            onLoadEnd={_ => setLoaded(true)}
            source={{uri: fileStorage.baseUrl + data[activeIndex].image}}
          />
        )}
        <Text
          style={{
            zIndex: 100,
            position: 'absolute',
            bottom: 20,
            left: 15,
            fontSize: 16,
            fontWeight: '600',
            color: '#fff',
          }}>
      { data[activeIndex].caption}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default StoryViewScreen;

const styles = StyleSheet.create({
  menuContainer: {},
  menu: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomWidth: 0.6,
    // borderBottomColor: '#cacaca',
  },
  backgroundVideo: {
    flex: 1,
    zIndex: -5,
  },
  menuText: {
    fontWeight: '600',
    fontSize: 20,
    color: '#585858',
  },
  borderLine: {
    borderBottomWidth: 5,
    borderColor: colors.grayX11Gray,
    position: 'absolute',
    top: 50,
    zIndex: 1,
    width: '10%',
  },
  profileImg: {
    width: 56,
    height: 56,

    borderWidth: 2,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grayX11Gray,
    borderColor: colors.mediumGray,
  },
  container: {
    marginHorizontal: 8,
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  profileContainer: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  userProfileImg: {
    width: 32,
    height: 32,
  },
  userName: {
    maxWidth: windowWidth / 2,
    color: '#fdfdfd',
    textShadowColor: 'black',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 8,
    fontWeight: '800',
    marginLeft: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  shadow: {
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 8,
  },

  closeIcon: {},
});
