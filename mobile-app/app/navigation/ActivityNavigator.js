import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import ActivityScreen from '../screens/ActivityScreen';
import AllFriendsScreen from '../screens/AllFriendsScreen';
import AddNewFriendScreen from '../screens/AddNewFriendScreen';
import ReceivedRequests from '../screens/ReceivedRequests';
import SentRequests from '../screens/SentRequests';
import routes from './routes';
import UserProfileScreen from '../screens/UserProfileScreen';

export default function ActivityNavigation(props) {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={routes.ACTIVITY}
        component={ActivityScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={routes.ALL_FRIENDS}
        component={AllFriendsScreen}
        options={{
          headerShown: false,
          title: 'All Friends',
        }}
      />
      <Stack.Screen
        name={routes.Add_NEW_FRIEND}
        component={AddNewFriendScreen}
        options={{
          headerShown: false,
          title: 'Add New Friends',
        }}
      />
      <Stack.Screen
        name={routes.RECEIVED_REQUESTS}
        component={ReceivedRequests}
        options={{
          headerShown: false,
          title: 'Pending Requests',
        }}
      />
      <Stack.Screen
        name={routes.SENT_REQUESTS}
        component={SentRequests}
        options={{
          headerShown: false,
          title: 'Sent Requests',
        }}
      />
      <Stack.Screen
        name={routes.USER_PROFILE}
        component={UserProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
