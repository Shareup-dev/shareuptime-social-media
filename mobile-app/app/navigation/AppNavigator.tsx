import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSelector } from 'react-redux';

import type { MainTabParamList } from './types';
import { useAppSelector } from '../redux/hooks';
import type { RootState } from '../redux/store';

// Components
import AddPostButton from './AddPostButton';
import Icon from '../components/Icon';
import Drawer from './Drawer';

// Navigators
import ActivityNavigator from './ActivityNavigator';
import NewsFeedNavigator from './NewsFeedNavigator';
import GroupNavigator from './GroupNavigator';

// Screens
import AddPostScreen from '../screens/AddPostScreen';
import AccountScreen from '../screens/AccountScreen';

// Config
import constants from '../config/constants';
import routes from './routes';
import colors from '../config/colors';

const { postTypes } = constants;

const Tab = createBottomTabNavigator<MainTabParamList>();

const AppNavigator: React.FC = () => {
  const isReelScreen = useAppSelector((state: RootState) => state.reelScreenDetector);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);

  const config = {
    animation: 'spring' as const,
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="NewsFeedNavigator"
          component={NewsFeedNavigator}
          options={{
            tabBarIcon: ({ size }) => (
              <Icon
                name=""
                image={require('../assets/tab-navigation-icons/home-icon.png')}
                backgroundSizeRatio={1}
                size={size}
                style={{}}
              />
            ),
          }}
        />

        <Tab.Screen
          name="GroupNavigator"
          component={GroupNavigator}
          options={{
            tabBarIcon: ({ size }) => (
              <Icon
                name=""
                image={require('../assets/tab-navigation-icons/groups-icon.png')}
                backgroundSizeRatio={1}
                size={30}
                style={{}}
              />
            ),
          }}
        />

        <Tab.Screen
          name="AddPost"
          component={AddPostScreen}
          options={({ navigation }) => ({
            transitionSpec: {
              open: config,
              close: config,
            },
            tabBarIcon: () => (
              <AddPostButton
                onPress={() => {
                  if (isReelScreen) {
                    navigation.navigate('NewsFeedNavigator', {
                      screen: 'AddNewReel',
                    });
                  } else {
                    navigation.navigate('AddPost', {
                      postType: postTypes.CREATE_POST,
                    });
                  }
                }}
              />
            ),
          })}
        />

        <Tab.Screen
          name="ActivityNavigator"
          component={ActivityNavigator}
          options={{
            tabBarIcon: ({ size }) => (
              <Icon
                name=""
                image={require('../assets/tab-navigation-icons/bell-icon.png')}
                backgroundSizeRatio={1}
                size={size}
                style={{}}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <TouchableWithoutFeedback 
                onPress={() => setIsDrawerVisible(true)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Open menu"
              >
                <View style={styles.menu}>
                  <Icon
                    name="menu"
                    image={null}
                    type="Feather"
                    backgroundSizeRatio={1}
                    size={size}
                    color={color}
                    style={{}}
                  />
                </View>
              </TouchableWithoutFeedback>
            ),
          }}
        />
      </Tab.Navigator>

      <Drawer 
        isVisible={isDrawerVisible} 
        setIsVisible={setIsDrawerVisible} 
      />
    </>
  );
};

const styles = StyleSheet.create({
  menu: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;