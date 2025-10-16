import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NewsFeedStackParamList } from './types';

// Components
import CustomHeaderBar from './CustomHeaderBar';

// Screens
import NewsFeedScreen from '../screens/NewsFeedScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import MyReelsScreen from '../screens/MyReelsScreen';
import KeepHangScreen from '../screens/KeepHangScreen';
import SwapScreen from '../screens/SwapScreen';
import SwapDisplay from '../screens/SwapDisplay';
import ShippingAddress from '../screens/ShippingAddress';
import SwapCheckout from '../screens/SwapCheckout';
import SwapCheckoutComplete from '../screens/SwapCheckoutComplete';
import GroupFeedScreen from '../screens/GroupFeedScreen';
import InviteGroupMembers from '../screens/InviteGroupMembers';
import SetPostAudience from '../screens/SetPostAudience';
import SettingPrivacyScreen from '../screens/SettingPrivacyScreen';
import AddCommentsOnReels from '../screens/addCommentsOnReels';

const Stack = createNativeStackNavigator<NewsFeedStackParamList>();

const NewsFeedNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Feed"
        component={NewsFeedScreen}
        options={{
          header: ({ navigation }) => <CustomHeaderBar navigation={navigation} />,
        }}
      />

      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          headerShown: false,
          title: 'Profile',
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: false,
          title: 'Edit Profile',
        }}
      />

      <Stack.Screen
        name="PostDetails"
        component={NewsFeedScreen} // Temporary - need PostDetailsScreen
        options={{
          title: 'Post',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Comments"
        component={AddCommentsOnReels}
        options={{
          title: 'Comments',
          headerShown: true,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />

      <Stack.Screen
        name="Stories"
        component={MyReelsScreen}
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="Reels"
        component={MyReelsScreen}
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
        }}
      />

      <Stack.Screen
        name="AddNewReel"
        component={MyReelsScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingPrivacyScreen}
        options={{
          title: 'Settings & Privacy',
          headerShown: true,
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="Followers"
        component={UserProfileScreen} // Temporary - need FollowersScreen
        options={{
          title: 'Followers',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Following"
        component={UserProfileScreen} // Temporary - need FollowingScreen
        options={{
          title: 'Following',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Search"
        component={NewsFeedScreen} // Temporary - need SearchScreen
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="HashtagPosts"
        component={NewsFeedScreen} // Temporary - need HashtagPostsScreen
        options={({ route }) => ({
          title: `#${route.params.hashtag}`,
          headerShown: true,
        })}
      />

      <Stack.Screen
        name="LocationPosts"
        component={NewsFeedScreen} // Temporary - need LocationPostsScreen
        options={{
          title: 'Location',
          headerShown: true,
        }}
      />

      {/* Legacy screens - keeping for backward compatibility */}
      <Stack.Screen
        name="KeepHang" // Legacy route
        component={KeepHangScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Swap" // Legacy route
        component={SwapScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SwapDisplay" // Legacy route
        component={SwapDisplay}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SwapShipping" // Legacy route
        component={ShippingAddress}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SwapCheckout" // Legacy route
        component={SwapCheckout}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SwapCheckoutComplete" // Legacy route
        component={SwapCheckoutComplete}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="GroupFeed" // Legacy route
        component={GroupFeedScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="InviteGroupMembers" // Legacy route
        component={InviteGroupMembers}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SetPostAudience" // Legacy route
        component={SetPostAudience}
        options={{
          headerShown: true,
          headerTitle: 'Post Audience',
        }}
      />
    </Stack.Navigator>
  );
};

export default NewsFeedNavigator;
