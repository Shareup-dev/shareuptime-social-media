import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar, Composer } from 'react-native-gifted-chat';
import useKeyboardHeight from 'react-native-use-keyboard-height';

import { ChatRoomHeader } from '../components/headers';
import MessageItem from '../components/messages/MessageItem';
import Screen from '../components/Screen';
import colors from '../config/colors';
import Icon from '../components/Icon';
import MessageTextField from '../components/messages/MessageTextField';

export default function ChatTestScreen({ navigation, route }) {
  const [messages, setMessages] = useState([]);

  const keyboardHight = useKeyboardHeight();

  const messagesListRef = useRef();

  const contact = route.params;

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 3,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, [keyboardHight]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
  }, []);

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: colors.iondigoDye,
        },
      }}
    />
  );

  const renderSend = (props) => (
    <Send {...props}>
      <Icon
        name="send"
        type="MaterialIcons"
        color={colors.iondigoDye}
        backgroundColor={colors.white}
        backgroundSizeRatio={0.75}
        size={30}
        style={styles.icon}
      />
    </Send>
  );

  const renderInputToolBar = (props) => (
    <MessageTextField style={styles.messageTextFieldContainer} forwardRef={messagesListRef} />
  );

  const renderComposer = (props) => <Composer />;

  return (
    <Screen>
      <ChatRoomHeader
        profilePicture={contact.profilePicturePath}
        firstName={contact.firstName}
        lastName={contact.lastName}
        navigation={navigation}
      />
      <View style={styles.separator} />
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        //   renderInputToolbar={renderInputToolBar}
        // renderComposer={renderComposer}
        // isKeyboardInternallyHandle={false}
        bottomOffset={Platform.OS == 'ios' ? Dimensions.get('window').height / 2.67 : 0}
        messagesContainerStyle={
          {
            //   paddingBottom: 10,
            // backgroundColor: "red",
          }
        }

        // forceGetKeyboardHeight={true}
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
  icon: {
    marginBottom: 10,
    alignSelf: 'center',
    marginRight: 5,
  },
  inputToolbar: {
    backgroundColor: colors.lighterGray,
    borderRadius: 15,
    marginHorizontal: 15,
    borderTopColor: colors.white,
    // paddingBottom: 10,
    // marginVertical: 10,
    marginBottom: 10,
  },
  messageTextFieldContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // margin: 10,
    alignItems: 'center',
    // marginBottom: 20,
    width: '90%',
    // marginBottom: 10,
  },
});
