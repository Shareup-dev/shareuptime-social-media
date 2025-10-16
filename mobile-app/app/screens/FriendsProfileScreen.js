import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import HeaderWithBackArrow from '../components/headers/HeaderWithBackArrow';
import Icon from '../components/Icon';
import Screen from '../components/Screen';
import colors from '../config/colors';
import authContext from '../Contexts/authContext';
import Card from '../components/lists/Card';
import ImageView from 'react-native-image-viewing';

import { ImagesAndVideosEmpty, TagsEmpty, ProfileTop } from '../components/profile';
import SwapCard from '../components/lists/SwapCard';
import postService from '../services/post.service';
import profileService from '../services/profile.service';
import FriendService from '../services/friends.service';
import userService from '../services/user.service';

const POSTS = 'posts';
const IMAGE_VIDEOS = 'images&videos';
const TAGS = 'tags';

const tabs = [
  { name: POSTS, icon: { name: 'rss', type: 'Feather' } },
  { name: IMAGE_VIDEOS, icon: { name: 'grid', type: 'Feather' } },
  { name: TAGS, icon: { image: require('../assets/icons/tag-icon.png') } },
];

export default function UserProfileScreen({ navigation, route }) {
  const {
    params: { user },
  } = route;
  const [currentTab, setCurrentTab] = useState(POSTS);

  const {
    userState: { userData: loginUser },
  } = useContext(authContext);

  const [userStatus, setUserStatus] = useState({ state: user, loading: false });

  useEffect(() => {
    const fetchUserProfile = () => {
      setUserStatus((prev) => ({ ...prev, loading: true }));
      FriendService.userStatus(user.id, loginUser.id)
        .then(({ data }) => setUserStatus((prev) => ({ ...prev, state: data })))
        .catch((e) => console.error(e.message))
        .finally(() => setUserStatus((prev) => ({ ...prev, loading: false })));
    };
    fetchUserProfile();
  }, []);

  const [userDetails, setUserDetails] = useState(user);
  const [posts, setPosts] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageSlider, setImageSlider] = useState({
    state: false,
    index: 0,
  });

  const [tags, setTags] = useState([]);

  const handleTapped = (name) => {
    setCurrentTab(name);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      postService.getPostByUserID(user.id),
      profileService.getAllMedia(user.id),
      userService.getUserById(user.id),
    ])
      .then((res) => {
        setPosts(res[0].data);
        setMedia(res[1].data);
        setUserDetails(res[2].data);
      })
      .catch((e) => console.error(e.message))
      .finally((_) => {
        setLoading(false);
      });
  }, []);

  const ListHeader = () => (
    <ProfileTop
      loading={loading}
      user={userDetails}
      currentTab={currentTab}
      numberOfPosts={posts.length}
      navigation={navigation}
      onIconBarTab={handleTapped}
      tabs={tabs}
      setUserStatus={setUserStatus}
      userStatus={userStatus}
    />
  );

  const PostsItem = ({ item }) =>
    item.hasOwnProperty('swaped') ? (
      /**
       * The Swap Should from backend as instance of post
       */
      // ToDO: Refactor to use one component for posts and swap.
      <SwapCard navigation={navigation} item={item} userId={item.userdata.id} />
    ) : (
      <Card user={item.userdata} postData={item} navigation={navigation} />
    );

  const { width } = Dimensions.get('window');
  const ImagesAndVideosItem = ({ item, index }) => (
    <TouchableOpacity onPress={(_) => setImageSlider({ state: true, index: index })}>
      <Image
        source={{ uri: item.mediaPath }}
        style={{
          width: (width - 28) / 3,
          borderRadius: 3,
          height: 150,
          margin: 4,
          backgroundColor: '#eee',
        }}
      />
    </TouchableOpacity>
  );
  const TagsItems = ({ item }) => <View />;

  return (
    <Screen style={styles.container}>
      <HeaderWithBackArrow
        title={user.firstName}
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

      <ImageView
        visible={imageSlider.state}
        images={media.map(({ media }) => ({ uri: media.mediaPath }))}
        keyExtractor={(item, index) => index.toString()}
        imageIndex={imageSlider.index}
        onRequestClose={() => {
          setImageSlider(false);
        }}
      />

  {currentTab === POSTS && (
        <FlatList
          data={posts}
          // removed unknown prop 've'
          renderItem={({ item }) => {
            return <PostsItem item={item} />;
          }}
          keyExtractor={(post, index) => index.toString()}
          ListHeaderComponent={ListHeader}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() =>
            !loading && posts.length === 0 ? (
              <Text style={styles.listEmptyText}>{`There is no posts!`}</Text>
            ) : (
              <>
                <ActivityIndicator size={30} />
                <Text style={[styles.listEmptyText, { marginVertical: 5 }]}>{`Loading..`}</Text>
              </>
            )
          }
          ListFooterComponent={() => <View style={styles.listFooter} />}
        />
      )}

  {currentTab === IMAGE_VIDEOS && (
        <FlatList
          data={media}
          numColumns={3}
          style={{ marginHorizontal: 2 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => <ImagesAndVideosItem item={item} index={index} />}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ImagesAndVideosEmpty}
        />
      )}

  {currentTab === TAGS && (
        <FlatList
          data={tags}
          showsVerticalScrollIndicator={false}
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
