import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import routes from './routes';

import CommentsScreen from '../screens/CommentsScreen';
import { AppNavigator } from '.';
import AddNewReel from '../screens/AddNewReel';
import AddStoryScreen from '../screens/AddStoryScreen';
import MessagesNavigator from './MessagesNavigator';
import StoryViewScreen from '../screens/StoryViewScreen';
import ReelPlayer from '../screens/ReelPlayer';
import AddPostScreen from '../screens/AddPostScreen';
import TagPeople from '../screens/tagPeople';
import FeelingAndActivity from '../screens/feelingAndActivity';
import AddCommentsOnReels from '../screens/addCommentsOnReels';
const Stack = createNativeStackNavigator();
export default function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={routes.APP_NAVIGATOR} component={AppNavigator} />
      <Stack.Screen name={routes.STORY_VIEW_SCREEN} component={StoryViewScreen} />
      <Stack.Screen name={routes.ADDS_STORY} component={AddStoryScreen} />
      <Stack.Screen
        name={routes.ADD_COMMENT_REEL}
        component={AddCommentsOnReels}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name={routes.TAG_PEOPLE} component={TagPeople} />
      <Stack.Screen name={routes.COMMENTS} component={CommentsScreen} />
      <Stack.Screen name={routes.ADD_NEW_REEL} component={AddNewReel} />
      <Stack.Screen name={routes.ADD_POST} component={AddPostScreen} />
      <Stack.Screen name={routes.FEELING_ACTIVITY} component={FeelingAndActivity} />
      <Stack.Screen name={routes.MESSAGES_NAVIGATOR} component={MessagesNavigator} />

      <Stack.Screen name={routes.REEL_PLAYER} component={ReelPlayer} />
    </Stack.Navigator>
  );
}
