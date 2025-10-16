import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { HeaderWithBackArrow } from '../components/headers';
import Separator from '../components/Separator';
import Screen from '../components/Screen';
import UserProfilePicture from '../components/UserProfilePicture';
import colors from '../config/colors';
import { Texts } from '../Materials/Text';
import defaultStyles from '../config/GlobalStyles';
import Bar from '../components/tab-bar/Bar';
import userService from '../services/user.service';
import routes from '../navigation/routes';
//Route = {SelectedTab,user,tabes,showHeader}

export default function ListOfFriendsAndFollowers({ navigation, route }) {
  const [currentTab, setCurrentTab] = useState(route.params.SelectedTab);
  const user = route.params.user;
  const tabes = route.params.tabes;
  const showHeader = route.params.showHeader;
  const [data, setData] = useState([
    {
      email: 'sree@gmail.com',
      firstName: 'Sree hariii',
      id: 1654156409074,
      lastName: 'Harikrishnan',
      profilePicture: 'profile-image-sree@gmail.com-1654340598380.jpg',
      profilePicturePath:
        'https://shareup.s3.us-west-2.amazonaws.com/profile_picture/1654156409074/profile-image-sree@gmail.com-1654340598380.jpg',
    },
    {
      email: 'harshu@gmail.com',
      firstName: 'Harshu',
      id: 1654671096566,
      lastName: 'Hari',
      profilePicture: 'profile-image-sree@gmail.com-1654340598380.jpg',
      profilePicturePath: 'https://shareup.s3.us-west-2.amazonaws.com/profile_picture/default.jpg',
    },
    {
      email: 'hari@gmail.com',
      firstName: 'Hari',
      id: 1654417515355,
      lastName: 'Harikrishnan',
      profilePicture: 'profile-image-sree@gmail.com-1654340598380.jpg',
      profilePicturePath:
        'https://shareup.s3.us-west-2.amazonaws.com/profile_picture/1654417515355/profile-image-hari@gmail.com-1655299255608.jpg',
    },
  ]);

  useEffect(() => {
    console.log(currentTab.length);
    switch (currentTab) {
      case 'Friends':
        //API for get friends
        userService
          .getFriends(user.email)
          .then((res) => {
            setData(res.data);
          })
          .catch((e) => console.error(e));

        break;
      case 'Followers':
        //API for get followers
        userService
          .getFollowers(user.email)
          .then((res) => {
            setData(res.data);
          })
          .catch((e) => console.error(e));
        break;
      case 'Following':
        //API for get following
        userService
          .getFollowing(user.email)
          .then((res) => {
            setData(res.data);
          })
          .catch((e) => console.error(e));
        break;

      default:
        break;
    }
  }, [currentTab]);

  const handleTabbed = (name) => {
    setCurrentTab(name);
  };

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
            userProfilePicture={item.profilePicturePath}
            size={40}
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
    <View style={{ backgroundColor: colors.white }}>
      {showHeader && (
        <HeaderWithBackArrow
          title={`${user.firstName} ${user.lastName}`}
          onBackButton={() => {
            navigation.goBack();
          }}
        />
      )}
      <View style={{ marginLeft: 15, marginHorizontal: 10 }}>
        <Bar
          tabes={tabes}
          onTab={handleTabbed}
          currentTab={currentTab}
          underLineWidth={currentTab.length * 8}
          underLineHight={4}
          activeUnderLineColor={colors.dark}
        />
      </View>
      <Separator style={{ marginTop: -11, marginBottom: 10 }} />
      <FlatList data={data} renderItem={renderItem} />
    </View>
  );
}
