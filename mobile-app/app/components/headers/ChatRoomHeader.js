import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import UserProfilePicture from '../UserProfilePicture';
import HeaderWithBackArrow from './HeaderWithBackArrow';

import Icon from '../Icon';
import defaultStyles from '../../config/styles';
import colors from '../../config/colors';

export default function ChatRoomHeader({ profilePicture, title, navigation }) {
  return (
    <HeaderWithBackArrow
      onBackButton={() => navigation.goBack()}
      leftComponent={
        <View style={styles.container}>
          <UserProfilePicture profilePicture={profilePicture} size={50} showActiveStatus={true} />

          <View style={styles.rightWrapper}>
            <Text style={defaultStyles.fontWeightMedium}>{title}</Text>
            <View style={styles.actions}>
              <TouchableOpacity>
                <Icon
                  name="phone-call"
                  type="Feather"
                  backgroundColor={colors.LightGray}
                  size={32}
                  style={styles.callButton}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon
                  name="video-plus"
                  type="MaterialCommunityIcons"
                  backgroundColor={colors.LightGray}
                  backgroundSizeRatio={0.8}
                  size={32}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 10,
  },
  rightWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.lighterGray,
    height: 40,
    width: '100%',
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    marginLeft: 20,
    alignItems: 'center',
    paddingLeft: 30,
    justifyContent: 'space-between',
  },
  userName: {
    fontWeight: 'bold',
  },
  callButton: {
    marginRight: 10,
  },
  actions: {
    flexDirection: 'row',
    right: 180,
  },
});
