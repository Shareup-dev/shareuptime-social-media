import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';

import Screen from '../components/Screen';
import ListItem from '../components/lists/ListItem';
import defaultStyles from '../config/styles';
import ListHeader from '../components/lists/ListHeader';
import colors from '../config/colors';
import routes from '../navigation/routes';
import authContext from '../authContext';
import UserService from '../services/user.service';
import GroupService from '../services/group.service';
import Icon from '../components/Icon';
import AppButton from '../components/buttons/Button';
import Loading from '../components/Loading';
import { Header, HeaderTitle } from '../components/headers';

const InviteGroupMembers = ({ navigation, route }) => {
  const { params: groupData } = route;

  const [users, setusers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invitedTo, setinvitedTo] = useState([]);
  const { userData: loggedInUser } = useContext(authContext).userState;
  useEffect(() => {
    const getUsers = () => {
      setLoading(true);
      UserService.getUsers()
        .then((resp) => {
          let allUsers = resp.data.filter((data) => data.id !== loggedInUser.id);
          setusers(allUsers);
        })
        .catch((e) => console.error(e))
        .finally((_) => setLoading(false));
    };
    getUsers();
  }, []);

  const handleInviteFriend = (member) => {
    if (invitedTo.filter((invitedMember) => member.id === invitedMember.id)[0]) {
      return;
    }
    GroupService.inviteToJoin(groupData.id, loggedInUser.id, member.id)
      .then((res) => {
        if (res.status === 200) setinvitedTo((previouslyInvited) => [...previouslyInvited, member]);
      })
      .catch((e) => e);
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
        middle={<HeaderTitle>Invite People</HeaderTitle>}
        right={
          <TouchableOpacity onPress={() => navigation.navigate(routes.GROUP_FEED, groupData)}>
            <Text>Done</Text>
          </TouchableOpacity>
        }
      />
      {loading ? (
        <Loading text="Loading..." />
      ) : (
        <>
          <FlatList
            contentContainerStyle={styles.groupsList}
            ListHeaderComponent={() => (
              <ListHeader
                containerStyle={{
                  // backgroundColor: 'coral',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  paddingHorizontal: 40,
                  marginTop: -10,
                }}
                subtitle="Add new friends to know more about them"
              />
            )}
            data={users}
            keyExtractor={(item, i) => i.toString()}
            renderItem={({ item }) => (
              <ListItem
                user={item}
                image={item.profilePicturePath}
                title={item.firstName}
                handleClose={() => setusers((prev) => prev.filter(({ id }) => id !== item.id))}
                tabTitle={
                  invitedTo.filter((user) => user.email === item.email)[0] ? 'Invited' : 'Invite'
                }
                color={
                  invitedTo.filter((user) => user.email === item.email)[0]
                    ? colors.iondigoDye
                    : colors.lighterGray
                }
                fontColor={
                  invitedTo.filter((user) => user.email === item.email)[0]
                    ? colors.white
                    : colors.dark
                }
                subTitle="Recommended"
                onPress={handleInviteFriend}
                style={[styles.listItem, defaultStyles.lightShadow]}
                displayLeft={true}
              />
            )}
          />
          {/* <View style={[defaultStyles.row, {justifyContent: 'center'}]}> */}
          {/* {route.params.newGroup && (
          <AppButton
            onPress={() => {
              // navigation.navigate(routes.GROUP_FEED, {
              //   title: route.params.groupInfo.name,
              //   privacy: route.params.groupInfo.privacySetting,
              //   description: route.params.groupInfo.description,
              //   groupId: route.params.groupId,
              //   image: route.params.groupCoverPath,
              // });
            }}
            title={'Finish'}
            width={'50%'}
          />
        )} */}
          {/* </View> */}
        </>
      )}
    </Screen>
  );
};
const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 30,
  },
  tabs: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchbar: {
    marginBottom: 10,
  },
  tab: {
    marginRight: 10,
    width: '30%',
    height: 30,
  },
  separator: {
    backgroundColor: colors.LightGray,
    marginTop: 20,
  },
  groupsList: { paddingTop: 20 },
  noFriendsContainer: {
    marginTop: 125,
    alignItems: 'center',
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
    padding: 15,
    backgroundColor: colors.white,
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
    marginBottom: 13,
    marginHorizontal: 28,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
});
export default InviteGroupMembers;
