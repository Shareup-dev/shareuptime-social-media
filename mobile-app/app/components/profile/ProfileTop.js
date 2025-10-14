import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import colors from '../../config/colors';
import Icon from '../Icon';
import UserProfilePicture from '../UserProfilePicture';
import Tab from '../buttons/Tab';
import IconBar from '../tab-bar/IconBar';
import routes from '../../navigation/routes';
import authContext from '../../authContext';
import Posts from './Posts';
import StoriesList from '../lists/StoriesList';

const profilePictureSize = 80;

export default function ProfileTop({
  navigation,
  currentTab,
  onIconBarTab,
  tabs,
  numberOfPosts,
}) {
  const {userData} = useContext(authContext)?.userState;

  return (
    <View style={styles.container}>
      <View style={styles.padding}>
        <View style={styles.row1}>
          <View style={styles.profilePicture}>
            <UserProfilePicture size={profilePictureSize} />
            <Icon
              name="pluscircle"
              type="AntDesign"
              color={colors.iondigoDye}
              style={styles.addProfilePictureIcon}
              backgroundSizeRatio={1}
              size={25}
            />
          </View>
          <View style={styles.counterWrapper}>
            <Text>{numberOfPosts}</Text>
            <Text>Posts</Text>
          </View>
          <View style={styles.counterWrapper}>
            <Text>0</Text>
            <Text>Followers </Text>
          </View>
          <View style={styles.counterWrapper}>
            <Text>0</Text>
            <Text>Following</Text>
          </View>
        </View>

        {/** Row 2 */}
        <View style={styles.row2}>
          <Text style={styles.username}>{userData.firstName}</Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius
            tellus placerat leo mi quis.
          </Text>
          <Tab
            title="Edit Profile"
            color={colors.LightGray}
            style={styles.editProfileButton}
            titleStyle={styles.editProfileButtonTitle}
            onPress={() => navigation.navigate(routes.EDIT_PROFILE)}
          />
        </View>
      </View>
      <StoriesList navigation={navigation} style={styles.storiesList} />

      <IconBar tabs={tabs} currentTab={currentTab} onTab={onIconBarTab} />

      {currentTab === 'posts' && <Posts navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  padding: {
    paddingHorizontal: 30,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  profilePicture: {
    width: profilePictureSize,
    height: profilePictureSize,
    marginRight: 20,
  },
  addProfilePictureIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  counterWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  row2: {
    marginTop: 30,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editProfileButton: {
    marginTop: 20,
    borderRadius: 10,
  },
  editProfileButtonTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  storyCard: {
    marginVertical: 10,
    marginRight: 10,
  },
  storiesContainer: {
    marginBottom: 10,
  },
  createStoryCard: {
    marginVertical: 10,
    marginRight: 5,
  },
  storiesList: {
    marginTop: 10,
  },
});
