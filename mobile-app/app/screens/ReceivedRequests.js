import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import Screen from '../components/Screen';
import { Header, HeaderTitle } from '../components/headers';
import Icon from '../components/Icon';
import UserService from '../services/user.service';
import authContext from '../authContext';
import defaultStyles from '../config/styles';
//import FriendService from '../services/FriendService';
import ListHeader from '../components/lists/ListHeader';
import ListItem from '../components/lists/ListItem';
import colors from '../config/colors';

export default function ReceivedRequests({ navigation }) {
  const { userData: user } = useContext(authContext).userState;
  const [requests, setRequests] = useState([]);
  const [acceptedFrom, setAcceptedFrom] = useState([]);
  const [rejectedFrom, setRejectedFrom] = useState([]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      UserService.getFriendRequestRecieved(user.email).then((resp) => {
        setRequests(resp.data);
      });
    }
    return () => (mounted = false);
  }, []);

  const acceptFriendRequest = (friend) => {
    UserService.acceptFriendRequest(user.id, friend.id).then((_resp) => {});

    setAcceptedFrom((previousState) => {
      return [...previousState, friend];
    });
  };

  const rejectFriendRequest = (friend) => {
    UserService.declineFriendRequest(user.id, friend.id).then((_resp) => {});

    setRejectedFrom((previousState) => {
      return [...previousState, friend];
    });
  };

  const getTabTitle = (friend) => {
    if (acceptedFrom.filter((u) => friend.email === u.email)[0]) {
      return 'unfriend';
    }

    if (rejectedFrom.filter((u) => friend.email === u.email)[0]) {
      return 'Rejected';
    }
    return 'Reject';
  };

  const renderRequestsList = () => {
    if (requests.length === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.emptyText}>You dont't have any received requests</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            contentContainerStyle={styles.groupsList}
            ListHeaderComponent={() => (
              <ListHeader subtitle="Add new friends to know more about them" />
            )}
            data={requests}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: friend }) => (
              <ListItem
                user={friend}
                image={friend.profilePicturePath}
                title={friend.firstName}
                secondBtnTitle={'Accept'}
                secondBtn={
                  acceptedFrom.filter((u) => u.email === friend.email)[0] ||
                  rejectedFrom.filter((u) => u.email === friend.email)[0]
                    ? false
                    : true
                }
                secondBtnAction={acceptFriendRequest}
                tabTitle={getTabTitle(friend)}
                color={
                  acceptedFrom.filter((u) => u.email === friend.email)[0]
                    ? colors.iondigoDye
                    : colors.lighterGray
                }
                fontColor={
                  acceptedFrom.filter((u) => u.email === friend.email)[0]
                    ? colors.white
                    : colors.dark
                }
                onPress={rejectFriendRequest}
                style={[defaultStyles.listItemStyle, defaultStyles.lightShadow]}
                fullWidth={
                  !!(
                    acceptedFrom.filter((u) => u.email === friend.email)[0] ||
                    rejectedFrom.filter((u) => u.email === friend.email)[0]
                  )
                }
                displayLeft={true}
                showCloseButton={false}
              />
            )}
          />
        </View>
      );
    }
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
        middle={<HeaderTitle>Pending Requests</HeaderTitle>}
      />
      {renderRequestsList()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
    marginTop: 150,
    fontSize: 18,
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
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
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
