import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Alert, FlatList } from 'react-native';
import AuthContext from '../Contexts/authContext';
import { HeaderWithBackArrow } from '../components/headers';
import Icon from '../components/Icon';
import routes from '../navigation/routes';
import groupService from '../services/group.service';

export default function ManageGroups({ navigation }) {
  const { userData } = useContext(AuthContext).userState;

  const deleteGroup = (gid) => {
    Alert.alert('Delete group?', 'Are you sure to this group?', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          groupService
            .deleteGroup(userData.id, gid)
            .then((_) => setGroups((prev) => prev.filter((item) => item.id !== gid)))
            .catch((e) => console.error(e.message)),
      },
      { text: 'Cancel', style: 'cancel', onPress: () => {} },
    ]);
  };
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    navigation.addListener('focus', async (e) => {
      // setSearch(initSearchVal);
      await groupService
        .getGroupsOfOwner(userData.id)
        .then((res) => setGroups(res.data))
        .catch((e) => console.error(e.message));
    });
  }, [navigation]);

  const ManageGroupCard = ({ item }) => {
    return (
      <View
        style={{
          marginHorizontal: 15,
          paddingHorizontal: 10,
          paddingVertical: 10,
          backgroundColor: '#fff',
          borderRadius: 10,
          borderColor: '#cacaca',
          borderWidth: 0.3,
          marginVertical: 5,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={(_) => navigation.navigate(routes.GROUP_FEED, item)}
          // navigation.navigate(routes.GROUP_FEED, item)}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Image
              source={
                item.groupImagePath
                  ? { uri: item.groupImagePath }
                  : require('../assets/images/group-texture.png')
              }
              style={styles.img}
            />
            <View style={styles.item}>
              <Text style={[styles.title]}>{item.name}</Text>
              <Text style={{ fontSize: 13 }}>{item.description}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={(_) => navigation.navigate(routes.MEMBER_REQUEST, item)}
          >
            <Icon name={'md-people-sharp'} noBackground size={50} type="Ionicons" />
            <Text style={{ fontSize: 16 }}>Member Requests</Text>
          </TouchableOpacity>
          <Text />
        </View>
        <View style={styles.actionContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name={'report'} noBackground size={50} type="Octicons" />
            <Text style={{ fontSize: 16 }}>Reports</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => deleteGroup(item.id)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Icon name={'delete'} noBackground size={50} />
            <Text style={{ fontSize: 16 }}>Delete this group</Text>
          </TouchableOpacity>
          <Text />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderWithBackArrow
        title={'Your Groups'}
        onBackButton={() => {
          navigation.goBack();
        }}
      />
      <View style={[styles.container, { paddingTop: 15 }]}>
        {!groups.length ? (
          <Text style={{ textAlign: 'center', fontSize: 12 }}>
            You don't have any groups to manage
          </Text>
        ) : (
          <React.Fragment>
            <FlatList
              ListHeaderComponent={
                <Text style={[{ marginVertical: 5, textAlign: 'center' }, styles.title]}>
                  Groups you manage
                </Text>
              }
              data={groups}
              keyExtractor={(item, i) => i.toString()}
              renderItem={({ item }) => <ManageGroupCard item={item} />}
            />
          </React.Fragment>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  img: {
    backgroundColor: '#33333360',
    width: 70,
    borderRadius: 10,
    resizeMode: 'cover',
    height: 70,
  },
  item: {
    paddingHorizontal: 10,
    marginVertical: 8,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  actionContainer: {
    borderTopWidth: 1,

    paddingHorizontal: 15,
    marginTop: 5,
    borderTopColor: '#cacaca60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
