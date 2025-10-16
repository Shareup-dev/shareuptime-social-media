import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import Tab from '../components/buttons/Tab';

const FriendList = ({
  navigation: _navigation,
  users,
  subTitle,
  buttonTitle,
  tabColor = colors.lighterGray,
  tabFontColor = colors.dark,
  action,
  noUsersTitle,
  noUsersSubtitle,
  noUsersAction,
}) => {
  if (users.length === 0) {
    return (
      <View style={styles.noFriendsContainer}>
        <Text style={styles.noFriendsText}>{noUsersTitle}</Text>
        <TouchableOpacity
          style={styles.addFriendsButton}
          color={colors.LightGray}
          onPress={noUsersAction}
        >
          <Text>{noUsersSubtitle}</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={(item) => {
            return (
              <View style={[styles.friendCard, defaultStyles.lightShadow]}>
                <View style={styles.left}>
                  <Image
                    style={styles.dp}
                    source={require('../../app/assets/default-profile-picture.png')}
                  />
                  <View>
                    <Text style={styles.title}>{item.item.firstName}</Text>
                    <Text style={styles.subTitle}>{subTitle}</Text>
                  </View>
                </View>
                <View style={styles.action}>
                  <Tab
                    style={[{ borderRadius: 7, height: 35, width: 120 }]}
                    title={buttonTitle}
                    color={tabColor}
                    fontColor={tabFontColor}
                    onPress={() => action(item.item)}
                  />
                </View>
              </View>
            );
          }}
          keyExtractor={(user) =>
            String(user.id ?? user.objectId ?? user.username ?? user.email ?? user)
          }
        />
      </View>
    );
  }
};

export default FriendList;
const styles = StyleSheet.create({
  noFriendsContainer: {
    marginTop: 125,
    alignItems: 'center',
  },
  noFriendsText: {
    fontSize: 25,
    marginBottom: 25,
  },
  addFriendsButton: {
    backgroundColor: colors.LightGray,
    padding: 12,
    paddingHorizontal: 40,
    borderRadius: 7,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 150,
    fontSize: 18,
  },
  shadowBox: {
    backgroundColor: 'coral',
    height: 50,
    shadowColor: 'red',
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 12,
  },
  friendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderWidth: 0,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recommendation: {
    display: 'flex',
    flexDirection: 'column',
  },
  dp: {
    height: 56,
    width: 56,
    marginRight: 20,
  },
  name: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  requestBtn: {
    paddingHorizontal: 1,
    padding: 1,
    borderRadius: 6,
    shadowColor: 'red',
    elevation: 0,
    height: 35,
  },
  listItem: {
    marginBottom: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
});
