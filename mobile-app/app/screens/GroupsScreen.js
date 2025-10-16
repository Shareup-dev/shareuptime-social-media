import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';

import Icon from '../components/Icon';
import TextField from '../components/TextField';
import Tab from '../components/buttons/Tab';
import Text from '../components/Text';
import colors from '../config/colors';
import { HeaderWithBackArrow } from '../components/headers';
import routes from '../navigation/routes';
import fileStorage from '../config/fileStorage';
import authContext from '../authContext';
import groupService from '../services/group.service';

export default function GroupsScreen({ navigation }) {
  const { userData } = useContext(authContext).userState;
  const [groups, setGroups] = useState([]);

  const initSearchVal = {
    keyword: '',
    result: [],
    loading: 0,
  };
  const [search, setSearch] = useState(initSearchVal);

  useEffect(() => {
    navigation.addListener('focus', async (_) => {
      // setSearch(initSearchVal);
      await groupService
        .getGroupsOfOwner(userData.id)
        .then((res) => setGroups(res.data))
        .catch((e) => console.error(e.message));
    });
  }, [navigation]);

  const deleteGroup = (gid) => {
    Alert.alert('Delete group?', 'Are you sure to this group?', [
      { text: 'Cancel', style: 'cancel', onPress: () => {} },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          groupService
            .deleteGroup(userData.id, gid)
            .then((_) => setGroups((prev) => prev.filter((item) => item.id !== gid)))
            .catch((e) => console.error(e.message)),
      },
    ]);
  };
  const searchGroups = (_) => {
    if (search.keyword) {
      setSearch((prev) => ({ ...prev, loading: 1 }));
      groupService
        .search(search.keyword)
        .then((res) => setSearch((prev) => ({ ...prev, result: res.data })))
        .catch((e) => console.error(e.message))
        .finally((_) => setSearch((prev) => ({ ...prev, loading: 2 })));
    } else {
      setSearch((prev) => ({ ...prev, loading: 0, result: [] }));
    }
  };
  const handleClearSearch = () => {
    setSearch(initSearchVal);
  };

  const ManageGroupCard = ({ item }) => {
    return (
      <View
        style={{
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
                item.image
                  ? { uri: fileStorage.baseUrl + item.image }
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

  const SearchResultCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => navigation.navigate(routes.GROUP_FEED, item)}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Image
          source={
            item.image
              ? { uri: fileStorage.baseUrl + item.image }
              : require('../assets/images/group-texture.png')
          }
          style={styles.searchCardImg}
        />
        <View style={styles.item}>
          <Text style={styles.title}>{item.name}</Text>
          <Text>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderWithBackArrow
        onBackButton={() => navigation.navigate(routes.FEED)}
        component={
          <TextField
            placeholder="Search Groups"
            iconName="search1"
            iconType="AntDesign"
            style={styles.searchbar}
            onChangeText={(val) => setSearch((prev) => ({ ...prev, keyword: val }))}
            onSubmitEditing={searchGroups}
            value={search.keyword}
            returnKeyType="search"
            endComponent={
              <TouchableOpacity style={{ marginLeft: 10 }} onPress={handleClearSearch}>
                <Icon name="close" noBackground size={35} style={{ paddingHorizontal: 5 }} />
              </TouchableOpacity>
            }
          />
        }
      />

      <View style={styles.optionsBar}>
        <Tab
          title="Create New"
          style={styles.tab}
          iconName="pluscircle"
          iconType="AntDesign"
          iconColor="black"
          iconSize={17}
          titleStyle={styles.tabTitle}
          onPress={() => {
            navigation.navigate(routes.CREATE_NEW_GROUP);
          }}
        />
        <Tab
          title="Your groups"
          style={styles.tab}
          iconImage={require('../assets/icons/foundation_social-skillshare.png')}
          iconSize={22}
          titleStyle={styles.tabTitle}
          onPress={() => {
            navigation.navigate(routes.MY_GROUPS);
          }}
        />
        {/* <Tab
          title="Categories"
          style={styles.tab}
          iconName="list"
          iconType="Feather"
          iconSize={18}
          titleStyle={styles.tabTitle}
        /> */}
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {search.loading === 2 && (
          <>
            <Text style={[{ marginVertical: 5 }, styles.title]}>{`Search Results`}</Text>
            <View
              style={{
                backgroundColor: '#fdfdfd',
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 10,
              }}
            >
              {search.result.length === 0 && (
                <Text
                  style={{
                    textAlign: 'center',
                    marginVertical: 15,
                    fontSize: 15,
                  }}
                >{`Groups not found`}</Text>
              )}
              {search.result.map((result, i) => (
                <SearchResultCard item={result} key={i} />
              ))}
            </View>
          </>
        )}

        {!groups.length ? (
          <Text style={{ textAlign: 'center', fontSize: 12 }}>
            You don't have any groups to manage
          </Text>
        ) : (
          <React.Fragment>
            <Text style={[{ marginVertical: 5 }, styles.title]}>Groups you manage</Text>
            <FlatList
              data={groups}
              keyExtractor={(item, i) => i.toString()}
              renderItem={({ item }) => <ManageGroupCard item={item} />}
            />
          </React.Fragment>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cacaca35',
  },
  searchCardImg: {
    backgroundColor: '#33333360',
    width: 50,
    borderRadius: 10,
    resizeMode: 'cover',
    height: 50,
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
  listContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
    paddingVertical: 10,
  },
  item: {
    paddingHorizontal: 10,
    marginVertical: 8,
    justifyContent: 'center',
  },
  headerText: {
    marginTop: 15,
    marginBottom: 5,
    fontSize: 20,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchbar: {
    width: '90%',
    marginLeft: 10,
  },
  searchText: {
    width: '75%',
  },
  optionsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  tab: {
    width: '31%',
    height: 30,
    marginHorizontal: 2.5,
    marginTop: 5,
  },
  tabTitle: {
    fontSize: 12,
  },
  addGroupsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  fancyAddButton: {
    margin: 5,
  },
  smallerFont: {
    marginLeft: 20,
    fontSize: 15,
  },
  separator: {
    backgroundColor: colors.LightGray,
    width: '100%',
    height: 10,
  },
  groupsContainer: {
    paddingTop: 30,
    justifyContent: 'center',
  },
  yourGroupsTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  joinGroupThumbnail: {
    width: 65,
    height: 65,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.lighterGray,
  },
  img: {
    backgroundColor: '#33333360',
    width: 70,
    borderRadius: 10,
    resizeMode: 'cover',
    height: 70,
  },
});
