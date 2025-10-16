import React, { useContext, useState, useCallback } from 'react';
import { StyleSheet, FlatList, ScrollView, View } from 'react-native';
import TextField from '../components/TextField';
import { HeaderTitle } from '../components/headers';
import { HeaderWithBackArrow } from '../components/headers';
import colors from '../config/colors';
// import routes from '../navigation/routes';
import { useFocusEffect } from '@react-navigation/native';
import authContext from '../Contexts/authContext';
import hangShareService from '../services/hangShare.service';
import SwapCard from '../components/lists/SwapCard';
import constants from '../config/constants';
import swapService from '../services/swap.service';
import { Texts } from '../Materials/Text';

export default function HangFlowScreen({ navigation, route }) {
  const postType = route.params;
  const { userState } = useContext(authContext);
  const [savedData, setSavedData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      switch (postType) {
        case constants.postTypes.HANG_SHARE:
          getAllHang(userState.userData.email);
          break;
        case constants.postTypes.SWAP:
          getAllSwap(userState.userData.email);
          break;
        default:
          break;
      }
    }, [postType, userState.userData.email]),
  );
  const getAllHang = (userEmail) => {
    hangShareService.getAllHangData().then((res) => {
      setSavedData(res.data);
    });
  };
  const getAllSwap = (userEmail) => {
    swapService.getAllSwap().then((res) => {
      setSavedData(res.data);
    });
  };

  const renderItem = ({ item }) => {
    return (
      <SwapCard
        navigation={navigation}
        route={route}
        item={item}
        userId={item.userdata.id}
        // onPress={() => { navigation.navigate(routes.POST_DETAILS_SCREEN, { postData: item }) }}
      />
    );
  };

  const hideActivityIndicator = () => {
    //setActivityIndicator(false);
  };
  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
      <HeaderWithBackArrow
        onBackButton={() => navigation.goBack()}
        title={
          <HeaderTitle>
            {' '}
            {postType === constants.postTypes.HANG_SHARE ? 'All In Hangs' : 'Swaps'}
          </HeaderTitle>
        }
        // rightComponent={
        //     <IconButton
        //         onPress={() => navigation.navigate(routes.KEEP_HANG,{postType:constants.postTypes.HANG_SHARE})}
        //         IconComponent={
        //           <Icon
        //             image={require('../assets/icons/squared-add-icon.png')}
        //             color={colors.iondigoDye}
        //             backgroundSizeRatio={0.8}
        //           />
        //         }
        //         style={styles.plusIcon}
        //     />
        // }
      />
      <View style={styles.searchContainer}>
        <TextField
          placeholder="Search"
          iconName="search1"
          iconType="AntDesign"
          style={styles.searchbar}
          //   ref={searchTextFieldRef}
          //   onChangeText={text => {
          //     onSearch(text);
          //     store.dispatch(recentSearchActions.setList(text))
          //   }}
        />
      </View>

      <FlatList
        initialNumToRender={10}
        data={savedData}
        // ListFooterComponent={ActivityIndicatorComponent}
        keyExtractor={(post) => post.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        onEndReached={hideActivityIndicator}
        ListEmptyComponent={() => (
          <Texts style={{ alignSelf: 'center', marginVertical: 50 }} size={15}>
            No posts Available
          </Texts>
        )}
      />
    </ScrollView>
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
    flexDirection: 'column',
  },
  listItem: {
    borderRadius: 10,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  searchbar: {
    marginBottom: 10,
  },
  tab: {
    marginRight: 10,
    width: '30%',
    height: 30,
  },
  tabs: {
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
