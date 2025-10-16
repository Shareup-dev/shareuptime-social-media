import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import Screen from '../components/Screen';
import HeaderWithBackArrow from '../components/headers/HeaderWithBackArrow';
import TabBar from '../components/tab-bar/Bar';
import LongCard from '../components/lists/LongCard';

import colors from '../config/colors';
import defaultStyle from '../config/styles';
import fileStorage from '../config/fileStorage';
import store from '../redux/store';
import reelScreenDetector from '../redux/reelScreenDetector';
import StoriesService from '../services/story.service';
import routes from '../navigation/routes';
import authContext from '../authContext';
import axios from 'axios';
const width = Dimensions.get('window').width / 2 - 15;
const height = Dimensions.get('window').height / 3;

const tabes = [{ name: 'My Reels' }, { name: 'Followed' }, { name: 'Explore' }];
const dummyThumbnails = [
  require('../assets/images/reel1.png'),
  require('../assets/images/2.jpg'),
  require('../assets/images/3.jpg'),
  require('../assets/images/4.jpg'),
  require('../assets/images/5.jpg'),
  require('../assets/images/6.jpg'),
  require('../assets/images/7.jpg'),
  require('../assets/images/8.jpg'),
  require('../assets/images/9.jpg'),
  require('../assets/images/10.jpg'),
  require('../assets/images/11.jpg'),
  require('../assets/images/12.jpg'),
  require('../assets/images/13.jpg'),
  require('../assets/images/14.jpg'),
  require('../assets/images/15.jpg'),
];
const reels = [
  {
    id: 1,
    name: 'Jane',
    time: '23 hrs',
    image: require('../assets/images/reel1.png'),
  },
  {
    id: 2,
    name: 'Jane',
    time: '23 hrs',
    image: require('../assets/images/2.jpg'),
  },
  {
    id: 3,
    name: 'Jane',
    time: '23 hrs',
    image: require('../assets/images/3.jpg'),
  },
  {
    id: 4,
    name: 'Jane',
    time: '23 hrs',
    image: require('../assets/images/4.jpg'),
  },
  {
    id: 5,
    name: 'Jane',
    time: '23 hrs',
    image: require('../assets/images/5.jpg'),
  },
  {
    id: 6,
    name: 'Jane',
    time: '23 hrs',
    image: require('../assets/images/6.jpg'),
  },
  {
    id: 7,
    name: 'Jane',
    time: '23 hrs',
    image: require('../assets/images/7.jpg'),
  },
  {
    id: 8,
    name: 'Jane',
    time: '23 hrs',
    image: require('../assets/images/8.jpg'),
  },
];

const followed = [
  {
    id: 1,
    name: 'Jane',
    time: '23 hrs',
    image: fileStorage.baseUrl + '/data/assets/images/reel2.png',
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
];
const explore = [
  {
    id: 1,
    name: 'Jane',
    time: '23 hrs',
    image: fileStorage.baseUrl + '/data/assets/images/',
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
];
const myReels = [
  {
    id: 1,
    name: 'Jane',
    time: '23 hrs',
    image: fileStorage.baseUrl + '/data/assets/images/',
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
];

export default function SwapScreen({ navigation }) {
  const [allReels, setAllReels] = useState([]);
  const [currentTab, setCurrentTab] = useState(tabes[0].name);
  const handleTabbed = (name) => {
    setCurrentTab(name);
  };

  useEffect(() => {
    // ReelService.getReels().then(reelsResp => {
    //   reelsResp.data.forEach(reel => {
    //     reel.thumbnail =
    //       dummyThumbnails[Math.floor(Math.random() * dummyThumbnails.length)];
    //   });
    //   setAllReels(reelsResp.data);
    // });
    store.dispatch(reelScreenDetector.actions.setReelScreen());

    // StoriesService.getStories()
    // .then(({data}) => setAllReels(data))
    // .catch(e => console.error(e.message));

    axios
      .get('https://6252a9697f7fa1b1dde87a9c.mockapi.io/api/v1/reels')
      .then(({ data }) => setAllReels(data));

    return () => {
      navigation.addListener('blur', () => {
        store.dispatch(reelScreenDetector.actions.unSetReelScreen());
      });
    };
  }, []);
  const renderList = () => {
    if (currentTab === tabes[0].name) return allReels;
    if (currentTab === tabes[1].name) return followed;
    if (currentTab === tabes[2].name) return explore;
  };

  return (
    <Screen style={styles.container}>
      <HeaderWithBackArrow
        title={currentTab}
        onBackButton={() => navigation.goBack()}
        rightComponent={
          <View style={styles.tabBar}>
            <TabBar
              tabes={tabes}
              currentTab={currentTab}
              activeUnderLineColor={colors.LightGray}
              onTab={handleTabbed}
              fontSize={12}
              underLineWidth={25}
              underLineHight={2}
            />
          </View>
        }
      />

      <FlatList
        contentContainerStyle={[defaultStyle.listContentContainerStyle, styles.list]}
        data={renderList()}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.REEL_PLAYER, { index, data: renderList() });
            }}
          >
            <View style={[styles.container]}>
              <Image source={{ uri: fileStorage.baseUrl + item.image }} style={styles.image} />
            </View>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
  },
  list: {
    paddingTop: 50,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.white,
    marginHorizontal: 1.5,
  },
  image: {
    width: width,
    height: height,
    resizeMode: 'cover',
    borderRadius: 10,
    backgroundColor: colors.LightGray,
  },
  titlesContainer: {
    zIndex: 1,
    bottom: 1,
    margin: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.dark,
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: -3,
  },
  subTitle: {
    color: colors.dark,
    marginTop: 5,
  },
  privacyBadge: {
    marginTop: 10,
    flexDirection: 'row',
  },
});
