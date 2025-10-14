import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import colors from '../config/colors';
import JoinGroupList from './lists/JoinGroupList';
import WritePost from './WritePost';

import StoriesList from './lists/StoriesList';

export default function FeedTop({navigation}) {
  return (
    <View>
      <StoriesList navigation={navigation} style={styles.storiesList} />

      <WritePost navigation={navigation} />

      <View style={styles.suggestedGroupsWrapper}>
        <JoinGroupList navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shareWrapper: {
    padding: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.LightGray,
    alignItems: 'center',
  },
  shareButton: {
    color: colors.mediumGray,
    marginLeft: 10,
  },

  tabsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1.5,
    borderColor: colors.LightGray,
  },
  verticalLine: {
    height: 25,
    width: 1.5,
    backgroundColor: colors.LightGray,
  },
  tabsTitle: {
    fontWeight: '500',
  },
  suggestedGroupsWrapper: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  storiesList: {
    marginTop: 15,
  },
});
