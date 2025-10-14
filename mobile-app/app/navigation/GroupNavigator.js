import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import GroupsScreen from '../screens/GroupsScreen';
import CreateNewGroup from '../screens/CreateNewGroup';
import InviteGroupMembers from '../screens/InviteGroupMembers';
import SetGroupPhoto from '../screens/SetGroupPhoto';
import routes from './routes';
import GroupFeedScreen from '../screens/GroupFeedScreen';
import MyGroups from '../screens/MyGroups';
import MemberRequest from '../screens/ListOfMemberRequests';
import ListOfMembers from '../screens/ListOfMembers';
import EditGroup from '../screens/EditGroupScreen';
import UpdateGroupPhoto from '../screens/UpdateGroupImage';

export default function GroupNavigator(props) {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={routes.GROUPS}
        component={GroupsScreen}
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
        name={routes.UPDATE_GROUP_PHOTO}
        component={UpdateGroupPhoto}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={routes.CREATE_NEW_GROUP}
        component={CreateNewGroup}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={routes.EDIT_GROUP}
        component={EditGroup}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={routes.MY_GROUPS}
        component={MyGroups}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={routes.MEMBER_REQUEST}
        component={MemberRequest}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={routes.LIST_OF_MEMBERS}
        component={ListOfMembers}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={routes.SET_GROUP_PHOTO}
        component={SetGroupPhoto}
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
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});
