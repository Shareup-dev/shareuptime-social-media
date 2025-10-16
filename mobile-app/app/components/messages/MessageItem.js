import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Animated } from 'react-native';
import moment from 'moment';
import colors from '../../config/colors';
import AuthContext from '../../authContext';
import UserProfilePicture from '../UserProfilePicture';

export default function MessageItem({ item, profilePicture }) {
  const [time, setTime] = useState();
  const [showTime, setShowTime] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const messageTime = moment().format('llll');
    setTime(messageTime);
  }, [time]);

  const handelShowTime = () => {
    if (showTime) setShowTime(false);
    else {
      setShowTime(true);
    }
  };

  const renderSentMessage = () => (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handelShowTime}>
        <View
          style={[
            styles.contentContainer,
            showTime ? styles.opacitySentDim : styles.opacityFull,
            styles.sentStyle,
          ]}
        >
          <Text style={[styles.text, styles.sentText]}>{item.messageData}</Text>
        </View>
      </TouchableWithoutFeedback>

      {showTime && <Animated.Text style={[styles.time, styles.alignEnd]}>{time}</Animated.Text>}
    </View>
  );

  const renderReceivedMessage = () => (
    <View style={[styles.container, styles.row]}>
      <UserProfilePicture size={35} profilePicture={profilePicture} style={styles.profilePicture} />

      <View>
        <TouchableWithoutFeedback onPress={handelShowTime}>
          <View
            style={[
              styles.contentContainer,
              showTime ? styles.opacityReceivedDim : styles.opacityFull,
              styles.receivedStyle,
            ]}
          >
            <Text style={[styles.text, styles.receivedText]}>{item.messageData}</Text>
          </View>
        </TouchableWithoutFeedback>

        {showTime && <Animated.Text style={[styles.time, styles.alignStart]}>{time}</Animated.Text>}
      </View>
    </View>
  );

  return user.id === item.publisher ? renderSentMessage() : renderReceivedMessage();
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  alignEnd: { alignSelf: 'flex-end' },
  alignStart: { alignSelf: 'flex-start' },
  opacityFull: { opacity: 1 },
  opacitySentDim: { opacity: 0.8 },
  opacityReceivedDim: { opacity: 0.5 },
  container: {
    margin: 5,
    marginHorizontal: 20,
  },
  contentContainer: {
    backgroundColor: colors.iondigoDye,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 50,
    alignSelf: 'flex-end',
    flexDirection: 'column',
  },
  sentStyle: {
    alignSelf: 'flex-end',
    backgroundColor: colors.iondigoDye,
  },
  receivedStyle: {
    alignSelf: 'flex-start',
    backgroundColor: colors.lighterGray,
  },
  text: {
    fontSize: 17,
  },
  sentText: {
    color: colors.white,
  },
  receivedText: {
    color: colors.dark,
  },
  time: {
    fontSize: 12,
    marginTop: 5,
    marginRight: 10,
    color: colors.dark,
  },
  profilePicture: {
    marginRight: 5,
  },
});
