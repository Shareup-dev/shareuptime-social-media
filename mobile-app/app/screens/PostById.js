import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { HeaderWithBackArrow } from '../components/headers';
import Card from '../components/lists/Card';
import SharedPostCard from '../components/lists/SharedPostCard';
import SwapCard from '../components/lists/SwapCard';
import Loading from '../components/Loading';
import constants from '../config/constants';
import routes from '../navigation/routes';
import hangShareService from '../services/hangShare.service';
import postService from '../services/post.service';
import swapService from '../services/swap.service';

export default function PostById({ navigation, route }) {
  const { params } = route;
  const [post, setPost] = useState({
    state: null,
    loading: false,
  });

  const postTypeService = () => {
    switch (params.postType) {
      case 'swap':
        return swapService.getSwapById(params.id);
      case 'share':
        return postService.getSharedPostById(params.id);
      case 'hangShare':
        return hangShareService.getHangShareByID(params.id);
      default:
        return postService.getPostByPostId(params.id);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchPost = () => {
        if (params?.id) {
          setPost((prev) => ({ ...prev, loading: true }));

          postTypeService()
            .then(({ data }) => setPost((prev) => ({ ...prev, state: data })))
            .catch((e) => {
              console.error(e.message);
              setPost((prev) => ({ ...prev, state: null }));
            })
            .finally((_) => setPost((prev) => ({ ...prev, loading: false })));
        }
      };

      fetchPost();
    }, [params.id]),
  );

  const RenderCard = ({ item }) => {
    {
      switch (item?.allPostsType) {
        case constants.postTypes.SWAP:
          return (
            <SwapCard navigation={navigation} route={route} item={item} userId={item.userdata.id} />
          );
        case constants.postTypes.SWAP:
          return (
            <SwapCard navigation={navigation} route={route} item={item} userId={item.userdata.id} />
          );
        case 'share':
          return (
            <SharedPostCard
              user={item.userdata}
              postData={item}
              navigation={navigation}
              postType={item.allPostsType}
            />
          );
        case constants.postTypes.HANG_SHARE:
          return (
            <SwapCard navigation={navigation} route={route} item={item} userId={item.userdata.id} />
          );
        case 'post':
          return (
            <Card
              user={item.userdata}
              postData={item}
              navigation={navigation}
              postType={item.allPostsType}
            />
          );
        default:
          return (
            <View
              style={{
                alignItems: 'center',
                marginVertical: 25,
              }}
            >
              <Text>Post not found</Text>
            </View>
          );
      }
    }
  };
  const { width, height } = Dimensions.get('window');

  return (
    <View>
      <HeaderWithBackArrow
        onBackButton={(_) => navigation.navigate(routes.APP_NAVIGATOR)}
        title="View Post"
      />
      <View style={styles.container}>
        <View style={{ height: height, width: width, backgroundColor: '#fff' }}>
          {post.loading ? (
            <Loading text="Fetching Post" />
          ) : (
            <View>
              {post.state ? (
                <RenderCard item={post.state} />
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text>Post not found</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    flex: 1,
  },
});
