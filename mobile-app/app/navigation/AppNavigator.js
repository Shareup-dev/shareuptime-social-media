import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import AddPostButton from './AddPostButton';
import AddPostScreen from '../screens/AddPostScreen';
import AccountScreen from '../screens/AccountScreen';
import Button from '../components/buttons/LinkButton';
import IconButton from '../components/buttons/IconButton';
import Icon from '../components/Icon';
import Drawer from './Drawer';
import constants from '../config/constants';
import routes from './routes';
import colors from '../config/colors';
import ActivityNavigator from './ActivityNavigator';
import NewsFeedNavigator from './NewsFeedNavigator';
import GroupNavigator from './GroupNavigator';
import { useSelector } from 'react-redux';
import CustomHeaderBar from './CustomHeaderBar';

const { postTypes } = constants;

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  // useNotifications();
  let isReelScreen = useSelector((state) => state.reelScreenDetector);

  const [isVisible, setIsVisible] = useState(false);

  const handleAddPost = () => {
    alert('This is add post button!');
  };
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen
          name="NewsFeedNavigator"
          component={NewsFeedNavigator}
          options={{
            headerShown: false,
            // header: () => <CustomHeaderBar />,
            tabBarIcon: ({ size, color }) => (
              <Icon
                image={require('../assets/tab-navigation-icons/home-icon.png')}
                backgroundSizeRatio={1}
                size={size}
              />
            ),
          }}
        />

        <Tab.Screen
          name={routes.GROUP_NAVIGATOR}
          component={GroupNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ size, color }) => (
              <Icon
                image={require('../assets/tab-navigation-icons/groups-icon.png')}
                backgroundSizeRatio={1}
                size={30}
              />
            ),
          }}
        />

        <Tab.Screen
          name={routes.ADD_POST}
          component={AddPostScreen}
          options={({ navigation }) => ({
            transitionSpec: {
              open: config,
              close: config,
            },
            headerShown: false,
            tabBarIcon: () => (
              <AddPostButton
                onPress={() => {
                  if (isReelScreen) {
                    navigation.navigate(routes.ADD_NEW_REEL);
                  } else {
                    navigation.navigate(routes.ADD_POST, {
                      postType: postTypes.CREATE_POST,
                    });
                  }
                }}
              />
            ),
            headerLeft: ({ navigation }) => (
              <IconButton
                style={styles.button}
                onPress={() => navigation.navigate(routes.FEED)}
                IconComponent={<Icon name="close" color={colors.dimGray} type="AntDesign" />}
              />
            ),
            headerRight: () => (
              <Button onPress={handleAddPost} title="Post" style={styles.button} />
            ),
          })}
        />

        <Tab.Screen
          name={routes.ACTIVITY_NAVIGATOR}
          component={ActivityNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ size, color }) => (
              <Icon
                image={require('../assets/tab-navigation-icons/bell-icon.png')}
                backgroundSizeRatio={1}
                size={size}
              />
            ),
          }}
        />

        {/** This Tab screen spurious  */}
        {/** Instead tab icon to control the menu drawer  */}
        {/** Side Drawer Navigator */}
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <TouchableWithoutFeedback onPress={() => setIsVisible(true)}>
                <View style={styles.menu}>
                  <Icon
                    name="menu"
                    type="Feather"
                    backgroundSizeRatio={1}
                    size={size}
                    color={color}
                  />
                </View>
              </TouchableWithoutFeedback>
            ),
          }}
        />
      </Tab.Navigator>

      <Drawer isVisible={isVisible} setIsVisible={setIsVisible} />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    color: colors.dimGray,
    marginHorizontal: 20,
  },
  headerLeft: {
    marginLeft: 10,
    margin: 5,
  },
  headerRight: {
    marginRight: 10,
    margin: 5,
  },
  menu: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
