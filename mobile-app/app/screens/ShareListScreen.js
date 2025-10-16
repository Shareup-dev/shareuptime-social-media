import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native';
import { HeaderWithBackArrow } from '../components/headers';
import Screen from '../components/Screen';
import UserProfilePicture from '../components/UserProfilePicture';
import colors from '../config/colors';
import { Texts } from '../Materials/Text';
import defaultStyles from '../config/GlobalStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import routes from '../navigation/routes';
import Separator from '../components/Separator';
import postService from '../services/post.service';
import constants from '../config/constants';

export default function ShareListScreen({ navigation, route }) {
  const postData = route.params.postData;
  const parent = route.params.parent;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (parent === constants.constant.SHOW_SHARELIST)
      postService.getShareList(postData.id).then((res) => {
        console.log(res.data);
        setData(res.data);
      });
    else if (parent === constants.constant.SHOW_TAGLIST) setData(postData.taggedList);
  }, []);

  const renderItem = ({ item }) => {
    console.log(item);
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(routes.FRIEND_PROFILE, {
            user: item,
          })
        }
      >
        <View
          style={[
            defaultStyles.listItemTitle,
            { flexDirection: 'row', alignItems: 'center', marginTop: 15, marginLeft: 25 },
          ]}
        >
          <UserProfilePicture
            userProfilePicture={item?.profilePicturePath}
            size={35}
            style={{ marginRight: 10 }}
          />
          <Texts size={15} style={{ fontWeight: 'bold' }}>
            {' '}
            {`${item.firstName} ${item.lastName}`}{' '}
          </Texts>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Screen style={{ backgroundColor: colors.white }}>
      <HeaderWithBackArrow
        title={'Share'}
        onBackButton={() => {
          navigation.goBack();
        }}
      />
      <Separator style={styles.separator} />
      <FlatList data={data} renderItem={renderItem} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  ProfilePicture: {},
});
