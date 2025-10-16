import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import { Header, HeaderTitle } from '../components/headers';
import authContext from '../authContext';
import UserService from '../services/user.service';
import defaultStyles from '../config/styles';
//import FriendService from '../services/FriendService';
import ListItem from '../components/lists/ListItem';
import Icon from '../components/Icon';
import Screen from '../components/Screen';
import colors from '../../app/config/colors';
import routes from '../navigation/routes';

export default function AllFriendsScreen({ navigation }) {
  const [friends, setFriends] = useState([]);
  // removed state unused
  useState([]);
  const { userData: loggedInUser } = useContext(authContext).userState;

  useEffect(() => {
    UserService.getFriends(loggedInUser.email).then((resp) => {
      resp.data.forEach((dost) => dost.email);
      setFriends(resp.data);
    });
  }, []);

  const UnfriendConfirmationDialog = (friend) => {
    return Alert.alert('Confirm', `Are you sure you want to Unfriend ${friend.firstName} ?`, [
      {
        text: 'Yes',
        onPress: () => {
          // setremoved((previousState) => {
          //   return [...previousState, friend];
          // })
          UserService.deleteFriend(loggedInUser.id, friend.id).then(() => {
            setFriends((previousFriends) => {
              return previousFriends.filter((dost) => dost.email !== friend.email);
            });
          });
        },
      },
      { text: 'No', onPress: () => {} },
    ]);
  };
  const _onClickAddFriends = () => {
    navigation.navigate(routes.Add_NEW_FRIEND);
  };

  const renderFriendsList = () => {
    if (friends.length === 0) {
      return (
        <View style={styles.noFriendsContainer}>
          <Text style={styles.noFriendsText}>No Friends Found</Text>
          <TouchableOpacity
            style={styles.addFriendsButton}
            color={colors.LightGray}
            onPress={() => {
              navigation.navigate(routes.Add_NEW_FRIEND);
            }}
          >
            <Text>Add Friends</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={friends}
          ListHeaderComponent={() => <></>}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListItem
              user={item}
              image={item.profilePicturePath}
              title={item.firstName}
              tabTitle={'Unfriend'}
              color={colors.iondigoDye}
              fontColor={colors.white}
              subTitle="Connected"
              showCloseButton={false}
              fullWidth={true}
              onPress={UnfriendConfirmationDialog}
              style={[defaultStyles.listItemStyle, defaultStyles.lightShadow]}
              displayLeft={true}
            />
          )}
        />
      </View>
    );
  };

  return (
    <Screen>
      <Header
        backgroundColor={colors.white}
        left={
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" type="Ionicons" size={25} backgroundSizeRatio={1} />
          </TouchableWithoutFeedback>
        }
        middle={<HeaderTitle>All Friends</HeaderTitle>}
      />
      {renderFriendsList()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  noFriendsContainer: {
    paddingTop: 125,
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
  },
  noFriendsText: {
    fontSize: 25,
    marginBottom: 25,
  },
  addFriendsButton: {
    backgroundColor: colors.LightGray,
    padding: 12,
    paddingHorizontal: 40,
    borderRadius: 7,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 150,
    fontSize: 18,
  },
  shadowBox: {
    backgroundColor: 'coral',
    height: 50,
    shadowColor: 'red',
  },
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 12,
  },
  friendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderWidth: 0,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recommendation: {
    display: 'flex',
    flexDirection: 'column',
  },
  dp: {
    height: 56,
    width: 56,
    marginRight: 20,
  },
  name: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  requestBtn: {
    paddingHorizontal: 1,
    padding: 1,
    borderRadius: 6,
    shadowColor: 'red',
    elevation: 0,
    height: 35,
  },
  listItem: {
    marginBottom: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
});
