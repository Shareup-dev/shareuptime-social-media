import React, { useContext, useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

import { useMessages } from '../backendless';
import Screen from '../components/Screen';
import { ChatRoomHeader } from '../components/headers';
import MessageTextField from '../components/messages/MessageTextField';
import colors from '../config/colors';
import MessageItem from '../components/messages/MessageItem';
import store from '../redux/store';
import { messagesAction } from '../redux/messagesSlice';
import authContext from '../authContext';

export default function ChatRoomScreen({ navigation, route }) {
  const { user } = useContext(authContext);

  const { contact, conversationId } = route.params;

  const messages = useSelector((state) => state.messages);

  const messagesListRef = useRef();

  const {
    subscribeToChannel,
    loadConversationMessages,
    updateStoredMessages,
    unsubscribeToChannel,
    sendMessage,
    loading,
  } = useMessages(conversationId);

  useEffect(() => {
    loadConversationMessages(user.id, contact.id);

    subscribeToChannel();

    return () => {
      unsubscribeToChannel();
      store.dispatch(messagesAction.setMessages([]));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // removed unused renderListEmpty to satisfy lint

  return (
    <Screen>
      <ChatRoomHeader
        title={contact.firstName + ' ' + contact.lastName}
        profilePicture={contact.profilePicturePath}
        navigation={navigation}
      />
      <View style={styles.separator} />

      {loading && messages.length === 0 && (
        <ActivityIndicator
          size="large"
          color={colors.iondigoDye}
          style={styles.activityIndicator}
        />
      )}

      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <MessageItem item={item} profilePicture={contact.profilePicturePath} />
        )}
        keyExtractor={(message) => message.objectId}
        onEndReached={() => updateStoredMessages(conversationId)}
        onEndReachedThreshold={0.5}
        inverted={true}
        ref={messagesListRef}
        extraData={messages}
        ListFooterComponent={
          loading && messages.length > 10 ? (
            <ActivityIndicator
              size="large"
              color={colors.iondigoDye}
              style={styles.activityIndicator}
            />
          ) : null
        }
      />

      <MessageTextField
        style={styles.messageTextFieldContainer}
        forwardRef={messagesListRef}
        contactId={contact.id}
        onSend={sendMessage}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  separator: {
    marginTop: 7,
    backgroundColor: colors.lighterGray,
    width: '100%',
    height: 7,
  },
  messageTextFieldContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '91%',
  },
  emptyMessagesContainer: {
    flex: 1,
    height: Dimensions.get('window').height / 1.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMarginBottom: {
    marginBottom: 10,
  },
  emptyText: {
    color: colors.mediumGray,
    width: '80%',
    textAlign: 'center',
  },
  viewProfileTab: {
    height: 30,
    borderRadius: 5,
    backgroundColor: colors.LightGray,
  },
  plusIcon: {
    alignSelf: 'center',
  },
  activityIndicator: {
    marginVertical: 10,
  },
  bottomPadding: {
    marginBottom: 55,
  },
});
