import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Text} from 'react-native';
import GroupService from '../../services/group.service';
import fileStorage from '../../config/fileStorage';

import GroupJoinCard from './GroupJoinCard';
import {userGroupActions} from '../../redux/userGroups';
import store from '../../redux/store';
import colors from '../../config/colors';
import AuthContext from '../../authContext';

export default function JoinGroupList({props, navigation}) {
  const [allGroups, setallGroups] = useState([]);

  const {userData} = useContext(AuthContext).userState;

  // useEffect(() => {
  //   let unmounted = false;
  //   GroupService.getAllGroups().then(resp => {
  //     if (!unmounted) {
  //       setallGroups(previousGroups => {
  //         return [...resp.data];
  //       });
  //       store.dispatch(userGroupActions.setGroups([...resp.data]));
  //     }
  //   });
  //   return () => {
  //     unmounted = true;
  //   };
  // }, []);

  useEffect(() => {
    const fetchGroups = () => {
      GroupService.groupSuggestion(userData.id)
        .then(res => setallGroups(res.data))
        .catch(e => console.error(e.message));
    };
    fetchGroups();
  }, []);

  return (
    <View style={styles.container}>
      {allGroups.length !== 0 && (
        <Text style={styles.suggestedGroupsText}>Suggested Groups</Text>
      )}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={allGroups}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <GroupJoinCard item={item} navigation={navigation} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  suggestedGroupsText: {
    color: colors.mediumGray,
  },
});
