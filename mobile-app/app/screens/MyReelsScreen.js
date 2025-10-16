import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import Screen from '../components/Screen';
import HeaderWithBackArrow from '../components/headers/HeaderWithBackArrow';
import TabBar from '../components/tab-bar/Bar';

import colors from '../config/colors';
import defaultStyle from '../config/styles';
import fileStorage from '../config/fileStorage';
import store from '../redux/store';
import reelScreenDetector from '../redux/reelScreenDetector';
import routes from '../navigation/routes';
import axios from 'axios';
const width = Dimensions.get('window').width / 2 - 15;
const height = Dimensions.get('window').height / 3;

const tabes = [{ name: 'My Reels' }, { name: 'Followed' }, { name: 'Explore' }];


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
    // Keep only allReels for now; other lists removed as unused
    return allReels;
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
