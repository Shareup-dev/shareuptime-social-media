import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';

import HeaderWithBackArrow from '../components/headers/HeaderWithBackArrow';
import Icon from '../components/Icon';
import Screen from '../components/Screen';
import colors from '../config/colors';
import authContext from '../authContext';
import UserService from '../services/user.service';
import Card from '../components/lists/Card';

import { ImagesAndVideosEmpty, TagsEmpty, ProfileTop } from '../components/profile';
import SwapCard from '../components/lists/SwapCard';

const POSTS = 'posts';
const IMAGE_VIDEOS = 'images&videos';
const TAGS = 'tags';

const tabs = [
  { name: POSTS, icon: { name: 'rss', type: 'Feather' } },
  { name: IMAGE_VIDEOS, icon: { name: 'grid', type: 'Feather' } },
  { name: TAGS, icon: { image: require('../assets/icons/tag-icon.png') } },
];

export default function UserProfileScreen({ navigation, route }) {
  const [currentTab, setCurrentTab] = useState(POSTS);
  const { userState } = useContext(authContext);
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState([]);
  const [imagesAndVideos, setImagesAndVideos] = useState([]);
  const [tags, setTags] = useState([]);

  const userEmail = route.params;

  const handleTapped = (name) => {
    setCurrentTab(name);
  };

  const getUserPosts = () => {
    // PostService.getPostsForUser(userEmail)
    //   .then(res => {
    //     setPosts(res.data);
    //   })
    //   .catch(err => console.error(err));
  };
  const getUserData = () => {
    UserService.getUserByEmail(userEmail)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getUserData();
    getUserPosts();
  }, []);

  const ListHeader = () => (
    <ProfileTop
      currentTab={currentTab}
      numberOfPosts={posts.length}
      navigation={navigation}
      onIconBarTab={handleTapped}
      tabs={tabs}
    />
  );

  const PostsItem = ({ item }) =>
    item.hasOwnProperty('swaped') ? (
      /**
       * The Swap Should from backend as instance of post
       */
      // ToDO: Refactor to use one component for posts and swap.
      <SwapCard
        navigation={navigation}
        // route={route}
        item={item}
        userId={item.user.id}
      />
    ) : (
      <Card
        user={item.user}
        postId={item.id}
        userId={item.user.id}
        firstName={item.user.firstName}
        lastName={item.user.lastName}
        profileImage={item.user.profilePicturePath}
        date={item.lastEdited}
        postText={item.content}
        postImages={item.media}
        reactions={item.reactions}
        comments={item.comments}
        navigation={navigation}
      />
    );

  const ImagesAndVideosItem = ({ item }) => <View />;
  const TagsItems = ({ item }) => <View />;

  return (
    <Screen style={styles.container}>
      <HeaderWithBackArrow
        title={userData.firstName}
        onBackButton={() => navigation.goBack()}
        leftComponent={
          <Icon
            name="lock"
            type="Feather"
            backgroundSizeRatio={0.8}
            size={30}
            style={styles.headerLockIcon}
          />
        }
      />

      {currentTab === POSTS && (
        <FlatList
          data={posts}
          renderItem={PostsItem}
          keyExtractor={(post) => post.id.toString()}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={() => (
            <Text style={styles.listEmptyText}>Start adding your posts!</Text>
          )}
          ListFooterComponent={() => <View style={styles.listFooter} />}
        />
      )}

      {currentTab === IMAGE_VIDEOS && (
        <FlatList
          data={imagesAndVideos}
          renderItem={ImagesAndVideosItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ImagesAndVideosEmpty}
          ListFooterComponent={() => <View style={styles.listFooter} />}
        />
      )}

      {currentTab === TAGS && (
        <FlatList
          data={tags}
          renderItem={TagsItems}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={TagsEmpty}
          ListFooterComponent={() => <View style={styles.listFooter} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerLockIcon: {
    marginRight: 5,
  },
  listEmptyText: {
    marginVertical: 30,
    alignSelf: 'center',
    fontSize: 15,
    color: colors.LightGray,
  },
  listFooter: {
    marginBottom: 50,
  },
  listHeaderContainer: {
    marginBottom: 20,
  },
});
