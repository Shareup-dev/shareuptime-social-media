import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  Dimensions,
  Text,
} from 'react-native';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import Icon from '../Icon';
import Loading from '../Loading';
import BottomCard from '../Reels/ReelPlayerBottomCard';

const { width, height } = Dimensions.get('window');
const RenderReels = ({ item, index, navigation }) => {
  const {
    id,
    reactions,
    userdata: user,
    content,
    published,
    numberOfComments,
    numberOfReaction,
    reelLiked,
  } = item;

  const reelState = useSelector((state) => state.reelActiveIndex);
  const [paused, setPaused] = useState(false);

  const [mute, setMute] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPaused(!(reelState.activeIndex === index));
  }, [reelState.activeIndex]);

  return (
    <KeyboardAvoidingView>
      <TouchableOpacity
        style={{
          justifyContent: 'space-between',
          width: width,
          height: height - StatusBar.currentHeight,
          backgroundColor: '#000',
        }}
        activeOpacity={1}
        onPress={(_) => setMute((prev) => !prev)}
        onLongPress={(_) => loaded && setPaused((prev) => !prev)}
      >
        <View style={styles.Header}>
          <Text style={styles.HeaderText}>Share Reels</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              onPress={(_) => setMute((prev) => !prev)}
            >
              <Icon
                noBackground
                type="MaterialCommunityIcons"
                size={35}
                backgroundSizeRatio={0.8}
                color="#fff"
                name={mute ? 'volume-off' : 'volume-high'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={(_) => navigation.goBack()}>
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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {paused && loaded ? (
            <View
              style={{
                backgroundColor: '#33333320',
                padding: 15,
                borderRadius: 40,
              }}
            >
              <Icon
                name={'pause'}
                noBackground
                type="Fontisto"
                size={35}
                backgroundSizeRatio={0.6}
                color="#fff"
                style={{ opacity: 0.4 }}
              />
            </View>
          ) : (
            mute && (
              <View
                style={{
                  backgroundColor: '#33333320',
                  padding: 15,
                  borderRadius: 40,
                }}
              >
                <Icon
                  name={'volume-off'}
                  noBackground
                  type="Fontisto"
                  size={35}
                  backgroundSizeRatio={0.6}
                  color="#fff"
                  style={{ opacity: 0.4 }}
                />
              </View>
            )
          )}
        </View>

        <View style={styles.video}>
          {!loaded ? (
            <View
              style={{
                width: width,
                height: height,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Loading noBackground />
            </View>
          ) : null}

          <Video
            style={{
              width: width,
              height: height - StatusBar.currentHeight,
              zIndex: -10,
            }}
            maxBitRate={2000000} // 2 megabits
            onLoadStart={(_) => setLoaded(false)}
            source={{ uri: item?.video_url }}
            repeat
            onLoad={(_) => setLoaded(true)}
            muted={mute}
            paused={paused}
            resizeMode="cover"
          />
        </View>
        <BottomCard
          numberOfComments={numberOfComments}
          numberOfReaction={numberOfReaction}
          reelLiked={reelLiked}
          rid={id}
          reactions={reactions}
          user={user}
          navigation={navigation}
          content={content}
          publishedDate={published}
        />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default RenderReels;

const styles = StyleSheet.create({
  Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomColor: '#cacaca',
    borderBottomWidth: 1,
    paddingVertical: 10,
    backgroundColor: '#33333325',
  },

  forwardArrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
    paddingRight: 15,
    paddingLeft: 10,
  },
  HeaderText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '600',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  video: {
    position: 'absolute',
    flex: 1,
    zIndex: -10,
  },
});
