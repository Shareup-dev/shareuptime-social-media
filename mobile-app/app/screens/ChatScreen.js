import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';

import { HeaderWithBackArrow } from '../components/headers';
import Icon from '../components/Icon';
import colors from '../config/colors';

import SockJsClient from 'react-stomp';
import settings from '../config/settings';
import AuthContext from '../Contexts/authContext';
import chatService from '../services/chat.service';
import routes from '../navigation/routes';
import Screen from '../components/Screen';

// import  PushNotification from 'react-native-push-notification';

const { width, height } = Dimensions.get('window');

function ChatScreen({ navigation, route }) {
  const sockJsRef = useRef();

  const { user } = route.params;
  const {
    userState: { username },
  } = useContext(AuthContext);

  const [messages, setMessages] = useState({
    state: [],
    loading: false,
  });
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState('');

  const getConversations = () => {
    chatService
      .getConversation(username, user.email)
      .then(({ data }) => {
        setConversationId(data.id);
        setMessages((prev) => ({
          ...prev,
          state: data.messages,
        }));
      })
      .catch((e) => console.error(e.message));
  };

  const archivedHandler = () => {
    chatService
      .archiveChat(username, conversationId)
      .then(({ status }) => status === 200 && navigation.goBack())
      .catch((e) => console.error(e.message));
  };

  const clearChatHandler = () => {
    // PushNotification.localNotification({
    //   channelId:'shareup-id',
    //   title:"Test Notification",
    //   message:"works...",
    // })
  };

  const viewProfileHandler = () => {
    navigation.navigate(routes.FRIEND_PROFILE, { user });
  };

  useEffect(() => {
    getConversations();
  }, []);

  const onMessageReceived = (mess) => {
    setMessages((prev) => ({ ...prev, state: [mess, ...prev.state] }));
  };

  const onSendMessage = async (message) => {
    if (message) {
      await sockJsRef.current.sendMessage(
        `/app/chat`,
        JSON.stringify({
          fromWho: username,
          toWhom: user.email,
          message: message,
          creationTime: new Date(),
          replyMessage: 'test',
        }),
      );
      setMessage('');
    }
  };

  const displayMessageTime = (creationTime) => {
    let time = new Date(creationTime);
    const today = new Date();

    if (today.toLocaleDateString() === time.toLocaleDateString()) {
      return time.toLocaleTimeString();
    } else if (today.getFullYear() === time.getFullYear()) {
      return `${time
        .toDateString()
        .split(' ')
        .slice(1, 3)
        .toString()
        .replace(',', ' ')} ${time.toLocaleTimeString()}`;
    } else {
      return `${time
        .toDateString()
        .split(' ')
        .slice(1, 4)
        .toString()
        .replaceAll(',', ' ')} ${time.toLocaleTimeString()}`;
    }
  };

  const MessageCard = ({ right, item }) => {
    return (
      <View
        style={{
          alignSelf: right ? 'flex-end' : 'flex-start',
        }}
      >
        <View
          style={{
            backgroundColor: right ? '#9FB7C4' : '#fff',

            margin: 5,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 10,
            maxWidth: '70%',
          }}
        >
          <Text
            style={{
              marginVertical: 3,
              fontSize: 14,
              fontWeight: '600',
              color: '#333',
            }}
          >
            {item.message}
          </Text>
        </View>
        <Text
          style={{
            textAlign: right ? 'right' : 'left',
            marginHorizontal: 15,
            fontSize: 12,
          }}
        >
          {displayMessageTime(item.creationTime)}
        </Text>
      </View>
    );
  };
  const [openModal, setOpenModal] = useState(false);
  return (
    <Screen>
      <SockJsClient
        url={settings.apiUrl + '/chat'}
        topics={[`/user/${username}/messages`]}
        onMessage={(msg) => onMessageReceived(msg)}
        ref={sockJsRef}
        debug={false}
      />

      <View style={[styles.container]}>
        <HeaderWithBackArrow
          title={`${user.firstName} ${user.lastName}`}
          titleStyle={{ fontSize: 16 }}
          onBackButton={(_) => navigation.goBack()}
          rightComponent={
            <View style={{ flexDirection: 'row' }}>
              <Icon name="md-videocam-outline" type="Ionicons" />
              <Icon name="phone-call" type="Feather" />
              <TouchableOpacity onPress={(_) => setOpenModal((prev) => !prev)}>
                <Icon name="options" type="SimpleLineIcons" />
              </TouchableOpacity>
            </View>
          }
        />

        <Modal
          style={styles.modal}
          isVisible={openModal}
          swipeDirection={['right']}
          animationIn="fadeInRight"
          animationOut={'slideOutRight'}
          onSwipeComplete={() => setOpenModal(false)}
          onBackdropPress={() => setOpenModal(false)}
          backdropOpacity={0.1}
        >
          <View
            style={{
              backgroundColor: '#fff',
              maxHeight: 200,
              paddingVertical: 10,
            }}
          >
            <TouchableOpacity style={styles.menu} onPress={viewProfileHandler}>
              <Text style={styles.menuText}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menu} onPress={archivedHandler}>
              <Text style={styles.menuText}>Archived</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menu}>
              <Text style={styles.menuText}>block</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menu} onPress={clearChatHandler}>
              <Text style={styles.menuText}>Clear chat</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <FlatList
          inverted
          style={{
            paddingHorizontal: 10,
            marginBottom: 65,
          }}
          refreshing={messages.loading}
          data={messages.state}
          // onEndReached={getConversations}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => (
            <MessageCard right={item.fromWho === username ? true : false} item={item} />
          )}
        />

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
            justifyContent: 'space-between',
            width: width,
          }}
        >
          <TextInput
            style={styles.message}
            value={message}
            onChangeText={(val) => setMessage(val)}
            placeholder="message"
          />
          <TouchableOpacity
            style={{
              backgroundColor: colors.iondigoDye,
              padding: 5,
              borderRadius: 25,
            }}
            onPress={() => onSendMessage(message)}
          >
            <Icon
              noBackground
              name={'send'}
              type="FontAwesome"
              color="#fff"
              backgroundSizeRatio={0.5}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
export default memo(ChatScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cacaca60',
    zIndex: -1,
  },
  menu: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    fontWeight: '600',
  },
  modal: {
    padding: 0,
    margin: 0,
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
    width: width / 2,
    alignSelf: 'flex-end',
    justifyContent: 'flex-start',
  },

  forwardArrow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    bottom: 20,
    paddingRight: 15,
    paddingLeft: 10,
  },
  message: {
    borderWidth: 1,
    borderColor: '#cacaca',
    maxHeight: 100,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    borderRadius: 30,
    justifyContent: 'center',
    fontSize: 18,
    height: 45,
    minWidth: '80%',
  },
});
