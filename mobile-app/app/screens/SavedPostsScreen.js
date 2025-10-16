import React, { useContext, useState, useCallback } from 'react';
import { StyleSheet, FlatList } from 'react-native';

import Screen from '../components/Screen';
import { HeaderTitle, HeaderWithBackArrow } from '../components/headers';
import colors from '../config/colors';
import routes from '../navigation/routes';
import SavedListItem from '../components/lists/SavedListItem';
import { useFocusEffect } from '@react-navigation/native';
import authContext from '../Contexts/authContext';
import postService from '../services/post.service';
import constants from '../config/constants';
import swapService from '../services/swap.service';
import { Texts } from '../Materials/Text';

export default function SavedPostsScreen({ navigation, route }) {
  const { params } = route;
  const { userState } = useContext(authContext);
  const [savedData, setSavedData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getSavedPost(userState.userData.id);
    }, []),
  );
  const getSavedPost = (id) => {
    if (params.category === constants.postTypes.SWAP) {
      swapService.getSavedPost(id).then((res) => {
        setSavedData(res.data);
      });
    } else if (params.category === constants.postTypes.HANG_SHARE) {
    } else {
      postService.getSavedPost(id).then((res) => {
        setSavedData(res.data);
      });
    }
  };
  const renderItem = ({ item }) => {
    return (
      <SavedListItem
        style={styles.listItem}
        user={item.userdata}
        postData={item}
        navigation={navigation}
        //reloadPosts={loadNews}
        postType={item.allPostsType}
        onPress={() => {
          navigation.navigate(routes.POST_DETAILS_SCREEN, { postData: item });
        }}
      />
    );
  };

  const hideActivityIndicator = () => {
    //setActivityIndicator(false);
  };
  return (
    <Screen>
      <HeaderWithBackArrow
        onBackButton={() => navigation.goBack()}
        title={<HeaderTitle>Saved</HeaderTitle>}
      />

      <FlatList
        style={styles.list}
        initialNumToRender={10}
        data={savedData}
        // ListFooterComponent={ActivityIndicatorComponent}
        keyExtractor={(post) => post.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        onEndReached={hideActivityIndicator}
        ListEmptyComponent={() => (
          <Texts style={{ alignSelf: 'center', marginVertical: 50 }}>No posts Available</Texts>
        )}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  shadowBox: {
    backgroundColor: 'coral',
    height: 50,
    shadowColor: 'red',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  listItem: {
    // borderRadius: 10,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
