import React, { useState } from 'react';
import { FlatList } from 'react-native';
import routes from '../../navigation/routes';

import ChatListItem from './ChatListItem';
import EmptyNotice from './EmptyNotice';
import ListWrapper from './ListWrapper';

export default function ChatsList({ navigation, chats, loading, refreshChats }) {
  const [refreshing, setRefreshing] = useState(false);

  const handelRefresh = () => {
    setRefreshing(true);
    refreshChats();
    setRefreshing(false);
  };

  // const chats = [
  //   {
  //     id: 1,
  //     title: "Chat Title",
  //     profilePicture: user.profilePicturePath,
  //     lastMessage: "this is the last message",
  //     lastMessageTime: "1:00 AM",
  //     numberOfUnreadMessages: "",
  //     lastMessageStatus: "",
  //     isActive: "",
  //   },
  // ];

  return (
    <ListWrapper loading={loading}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handelRefresh}
        ListEmptyComponent={<EmptyNotice navigation={navigation} />}
        renderItem={({ item }) => (
          <ChatListItem
            title={item.title}
            profilePicture={item.profilePicture}
            lastMessage={item.lastMessage}
            lastMessageTime={item.lastMessageTime}
            navigation={navigation}
            onPress={() => {
              navigation.navigate(routes.CHAT_ROOM, {
                contact: item.contact,
                conversationId: item.id,
              });
            }}
          />
        )}
      />
    </ListWrapper>
  );
}
