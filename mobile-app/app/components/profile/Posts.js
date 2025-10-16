import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import Tab from '../buttons/Tab';
import WritePost from '../WritePost';
import colors from '../../config/colors';
import Card from '../lists/Card';

export default function Posts({ navigation }) {
  return (
    <View style={styles.container}>
      <WritePost navigation={navigation} style={styles.writePost} />

      <Tab
        title="Manage Posts"
        color={colors.lighterGray}
        style={styles.managePostsButton}
        titleStyle={styles.managePostsButtonTitle}
      />

      <View style={styles.separator} />

      <View style={styles.TabContainer}>
        <Tab
          title="Photos"
          iconName="image"
          iconType="Feather"
          style={styles.smallButtons}
          titleStyle={styles.smallButtonsTitle}
        />
        <Tab
          title="Live Events"
          iconName="video"
          iconType="Feather"
          style={styles.smallButtons}
          titleStyle={styles.smallButtonsTitle}
        />
        <Tab
          title="Live Locations"
          iconImage={require('../../assets/icons/globe-location-icon.png')}
          style={styles.smallButtons}
          titleStyle={styles.smallButtonsTitle}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  writePost: { marginTop: 30 },
  managePostsButton: {
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 10,
    width: '65%',
    height: 35,
    alignSelf: 'center',
  },
  managePostsButtonTitle: {
    fontSize: 14,
  },
  separator: {
    width: '100%',
    height: 2,
    backgroundColor: colors.lighterGray,
  },
  TabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  smallButtons: {
    borderRadius: 10,
    height: 30,
    marginLeft: 5,
  },
  smallButtonsTitle: {
    fontSize: 11,
  },
});
