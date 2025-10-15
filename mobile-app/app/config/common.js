import React,{useContext} from 'react';
import { Text } from 'react-native-paper';
//const {userData: loggedInUser} = useContext(AuthContext).userState;


const common = {
  //...............Privacy Options.................//
    privacyOptions : [
        {
          icon: require('../assets/post-privacy-options-icons/public-icon.png'),
          label: 'Public',
          value: 'Public',
          description: 'Anyone on or off Shareup',
        },
        {
          icon: require('../assets/post-privacy-options-icons/friends-icon.png'),
          label: 'Friends',
          value: 'Friends',
          description: 'Your friends on Shareup',
        },
        {
          icon: require('../assets/post-privacy-options-icons/friends-except-icon.png'),
          label: 'Friends except...',
          value: 'Friends except...',
          description: "Don't show to some friends",
        },
        {
          icon: require('../assets/post-privacy-options-icons/specific-friends-icon.png'),
          label: 'Specific friends',
          value: 'Specific friends',
          description: 'Only show to some friends',
        },
      ],
} 
export default common;