import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { HeaderWithBackArrow } from '../components/headers';
import Icon from '../components/Icon';
import ChatListItem from '../components/messages/ChatListItem';
import AuthContext from '../Contexts/authContext';
import routes from '../navigation/routes';
import chatService from '../services/chat.service';

export default function ArchivedChatScreen({ navigation }) {
  const {
    userState: { username },
  } = useContext(AuthContext);

  const [archivedChat, setArchivedChat] = useState({
    state: [],
    loading: false,
  });

  const fetchArchivedChat = () => {
    setArchivedChat((prev) => ({ ...prev, loading: true }));
    chatService
      .getAllArchivedChat(username)
      .then(({ data }) => setArchivedChat((prev) => ({ ...prev, state: data })))
      .catch((e) => console.error(e.message))
      .finally((_) => setArchivedChat((prev) => ({ ...prev, loading: false })));
  };

  useEffect(() => {
    fetchArchivedChat();
  }, []);

  const unArchivedHandler = (item) => {
    const { id } = item;

    chatService
      .unArchiveChat(username, id)
      .then(({ status }) => status === 200 && navigation.goBack())
      .catch((e) => console.error(e.message));
  };

  return (
    <View style={styles.container}>
      <HeaderWithBackArrow title={'Archived Chat'} onBackButton={(_) => navigation.goBack()} />
      <FlatList
        data={archivedChat.state}
        keyExtractor={(item) => item.id.toString()}
        refreshing={archivedChat.loading}
        ListEmptyComponent={
          <View
            style={{
              marginVertical: 15,
              alignItems: 'center',
            }}
          >
            <Text>No item found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <ChatListItem
              item={item}
              navigation={navigation}
              profilePicture={item.user2ProfilePicture}
              onPress={() => {
                navigation.navigate(routes.CHAT_SCREEN, {
                  user: {
                    email: item.user2,
                    firstName: item.user2FullName,
                    lastName: '',
                  },
                });
              }}
            />
            <TouchableOpacity onPress={() => unArchivedHandler(item)}>
              <Icon type="Ionicons" name={'archive'} noBackground />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
