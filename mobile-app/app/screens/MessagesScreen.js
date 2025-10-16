import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import Screen from '../components/Screen';
import { HeaderWithBackArrow } from '../components/headers';
import UserProfilePicture from '../components/UserProfilePicture';
import authContext from '../authContext';
import TextField from '../components/TextField';
import Bar from '../components/tab-bar/Bar';
import FancyAddButton from '../components/buttons/FancyAddButton';
import colors from '../config/colors';
import UserService from '../services/user.service';
import ChatsList from '../components/messages/ChatsList';
import conversation from '../backendless/conversation';
import FriendsList from '../components/messages/FriendsList';
import useConversationListener from '../backendless/useConversationListener';

const CHATS = 'Chats';
const FRIENDS = 'Friends';
const GROUPS = 'Groups';
const FAVORITES = 'Favorites';

const tabes = [{ name: CHATS }, { name: FRIENDS }, { name: GROUPS }, { name: FAVORITES }];

export default function MessagesScreen({ navigation }) {
  const { userData: user } = useContext(authContext).userState;

  const { addConversationListener, removeConversationListener } = useConversationListener();

  const [friends, setFriends] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(CHATS);

  const chats = useSelector((state) => state.conversations.list);

  useEffect(() => {
    loadData();
    addConversationListener(user.id);

    return () => {
      // removeConversationListener();
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    await getFriends();
    await getChats();
    setLoading(false);
  };

  const getFriends = async () => {
    await UserService.getFriends(user.email).then((res) => {
      setFriends(res.data);
    });
  };

  const getChats = async () => {
    const result = await conversation.getConversations(user.id);
  };

  const handleTabbed = (name) => {
    setCurrentTab(name);
  };

  return (
    <Screen>
      <HeaderWithBackArrow
        title={user.firstName}
        leftComponent={<UserProfilePicture size={45} style={styles.userProfilePicture} />}
        onBackButton={() => navigation.goBack()}
      />
      <View style={styles.containerTop}>
        <Text style={styles.bigFontBlack}>Messages</Text>
        <TextField
          placeholder="search Groups"
          iconName="search1"
          iconType="AntDesign"
          style={styles.searchbar}
        />

        <View style={styles.bar}>
          <Bar tabes={tabes} onTab={handleTabbed} currentTab={currentTab} />
        </View>
        <View style={styles.addGroupsContainer}>
          <FancyAddButton style={styles.fancyAddButton} SizeRatio={0.7} />
          <Text style={styles.smallerFont}>Add Groups...</Text>
        </View>
      </View>

      <View style={styles.separator} />

      {currentTab == CHATS && (
        <ChatsList
          navigation={navigation}
          chats={chats}
          loading={loading}
          refreshChats={getChats}
        />
      )}
      {currentTab == FRIENDS && (
        <FriendsList
          navigation={navigation}
          friends={friends}
          loading={loading}
          refresh={getFriends}
        />
      )}

      {currentTab == ''}
    </Screen>
  );
}

const styles = StyleSheet.create({
  containerTop: {
    marginHorizontal: 20,
  },
  userProfilePicture: {
    marginHorizontal: 10,
  },
  bigFontBlack: {
    fontSize: 25,
    fontWeight: '500',
  },
  searchbar: {
    marginTop: 10,
  },
  bar: { marginTop: 5 },
  addGroupsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  smallerFont: {
    marginLeft: 20,
    fontSize: 11,
    color: colors.mediumGray,
  },
  separator: {
    width: '100%',
    height: 2,
    backgroundColor: colors.LightGray,
    marginVertical: 16,
  },
});
