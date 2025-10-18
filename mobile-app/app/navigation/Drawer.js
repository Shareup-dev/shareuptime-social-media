import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  PixelRatio,
} from 'react-native';
import Modal from 'react-native-modal';

import authContext from '../authContext';
import Icon from '../components/Icon';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import DrawerButtons from './DrawerButtons';
import LinkButton from '../components/buttons/LinkButton';

import routes from './routes';
import { useNavigation } from '@react-navigation/native';

const listItems = [
  {
    title: 'Share Feed',
    icon: require('../assets/icons/share-feed-icon.png'),
  },
  {
    title: 'Swap Point',
    icon: require('../assets/icons/swap-point-icon.png'),
  },
  {
    title: 'Share Time',
    icon: require('../assets/icons/share-time-icon.png'),
  },
  {
    title: 'Share Point',
    icon: require('../assets/icons/share-point-icon.png'),
  },
  {
    title: 'Share Friends',
    icon: require('../assets/icons/share-feed-icon.png'),
  },
  {
    title: 'Add Friends',
    icon: require('../assets/icons/add-friends-icon.png'),
  },
  {
    title: 'Share Groups',
    icon: require('../assets/icons/foundation_social-skillshare.png'),
  },
  {
    title: 'Message',
    icon: require('../assets/icons/message.png'),
  },

  {
    title: 'Reels',
    icon: require('../assets/icons/reels-colored-icon.png'),
  },
  {
    title: 'Saved Posts',
    icon: require('../assets/post-options-icons/save-post-icon.png'),
  },
  {
    title: 'Discover',
    icon: require('../assets/icons/search-icon-colored2.png'),
  },
  {
    title: 'Saved Swaps',
    icon: require('../assets/icons/saved-swap-colored-icon.png'),
  },
];

export default function Drawer({ isVisible, setIsVisible }) {
  const { userState, authActions } = useContext(authContext);

  const navigation = useNavigation();
  return (
    <Modal
      isVisible={isVisible}
      swipeDirection={['right']}
      coverScreen={true}
      onSwipeComplete={() => setIsVisible(false)}
      onBackdropPress={() => setIsVisible(false)}
      animationIn="slideInRight"
      animationOut="slideOutRight"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            backgroundSizeRatio={1}
            image={require('../assets/tab-navigation-icons/user-icon.png')}
          />
          <Text style={styles.userName}>{userState?.userData?.firstName}</Text>
        </View>
        <View style={styles.separator} />

        <View style={[styles.innerContainer, defaultStyles.lightShadow]}>
          <View>
            <FlatList
              data={listItems}
              contentContainerStyle={styles.flatList}
              keyExtractor={(item) => item.title}
              numColumns={2}
              renderItem={({ item }) => <DrawerButtons title={item.title} iconImage={item.icon} />}
            />
          </View>

          <View style={styles.footer}>
            <View style={styles.separator} />
            <View style={styles.LinkButtonWrapper}>
              <Icon
                image={require('../assets/icons/help-circle-icon.png')}
                color={colors.LightGray}
                backgroundColor="#EAEAEA"
                backgroundSizeRatio={0.7}
                size={35}
              />
              <View style={styles.center}>
                <LinkButton title={'Help & Support'} style={styles.linkButton} />
              </View>
            </View>

            <View style={styles.LinkButtonWrapper}>
              <Icon
                name="settings"
                type="Feather"
                backgroundColor="#EAEAEA"
                backgroundSizeRatio={0.7}
                size={35}
              />
              <View style={styles.center}>
                <LinkButton
                  title={'Settings & Privacy'}
                  style={styles.linkButton}
                  onPress={() => {
                    setIsVisible(false);
                    //SettingPrivacy
                    navigation.navigate('SettingPrivacy');
                  }}
                />
              </View>
            </View>
            <View style={styles.separator} />
            <LogoutButton
              onPress={() => {
                authActions.logout();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function LogoutButton({ onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.logoutButton}>
        <Text>Logout</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    alignSelf: 'flex-end',
    overflow: 'hidden',
    padding: 10,
    backgroundColor: colors.white,
    height: PixelRatio.get() < 3 ? '100%' : '90%',
  },
  userName: {
    fontSize: 23,
    color: colors.iondigoDye,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  separator: {
    height: 2,
    backgroundColor: colors.LightGray,
    marginTop: 6,
  },
  innerContainer: {
    backgroundColor: colors.lighterGray,
    flex: 1,
    marginTop: 30,
    borderRadius: 20,
    justifyContent: 'space-between',
  },
  tab: {
    marginHorizontal: 0,
  },
  flatList: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: '100%',
  },
  footer: {
    margin: 5,
  },
  LinkButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: PixelRatio.get() < 3 ? 3 : 10,
  },
  linkButton: {
    color: colors.dark,
    fontSize: 16,
    marginLeft: 20,
  },
  center: {
    justifyContent: 'center',
  },
  logoutButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C4C4C4',
    height: 35,
    borderRadius: 5,
    margin: 5,
    marginVertical: 20,
  },
});
