import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import routes from './routes';
import NewsFeedScreen from '../screens/NewsFeedScreen';
import KeepHangScreen from '../screens/KeepHangScreen';
import CustomHeaderBar from './CustomHeaderBar';
import UserProfileScreen from '../screens/UserProfileScreen';
import MyReelsScreen from '../screens/MyReelsScreen';
import SwapScreen from '../screens/SwapScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import InviteGroupMembers from '../screens/InviteGroupMembers';
import GroupFeedScreen from '../screens/GroupFeedScreen';
import SetPostAudience from '../screens/SetPostAudience';
import SettingPrivacyScreen from '../screens/SettingPrivacyScreen';
import SwapDisplay from '../screens/SwapDisplay';
import ShippingAddress from '../screens/ShippingAddress';
import SwapCheckout from '../screens/SwapCheckout';
import SwapCheckoutComplete from '../screens/SwapCheckoutComplete';

export default function NewsFeedNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen
        name={routes.FEED}
        component={NewsFeedScreen}
        options={{
          header: ({ navigation }) => <CustomHeaderBar navigation={navigation} />,
        }}
      />
      <Stack.Screen
        name={routes.USER_PROFILE}
        component={UserProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={routes.KEEP_HANG}
        component={KeepHangScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={routes.SWAP}
        component={SwapScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={routes.EDIT_PROFILE}
        component={EditProfileScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={routes.MY_REELS}
        component={MyReelsScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={routes.GROUP_FEED}
        component={GroupFeedScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={routes.INVITE_GROUP_MEMBERS}
        component={InviteGroupMembers}
        options={{
          headerShown: false,
        }}
      />

      {/* there are no use of this  */}
      <Stack.Screen
        name={routes.SET_POST_AUDIENCE}
        component={SetPostAudience}
        options={{
          headerShown: true,
          headerTitle: 'Post Audience',
        }}
      />
      <Stack.Screen
        name={routes.SWAP_DISPLAY}
        component={SwapDisplay}
        options={{
          headerShown: false,
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name={routes.SWAP_SHIPPING}
        component={ShippingAddress}
        options={{
          headerShown: false,
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name={routes.SWAP_CHECKOUT}
        component={SwapCheckout}
        options={{
          headerShown: false,
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name={routes.SWAP_CHECKOUT_COMPLETE}
        component={SwapCheckoutComplete}
        options={{
          headerShown: false,
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name={routes.SETTING_PRIVACY}
        component={SettingPrivacyScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
