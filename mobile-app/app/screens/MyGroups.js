import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  Text,
  Image,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import AuthContext from '../authContext';
import { HeaderWithBackArrow } from '../components/headers';
import fileStorage from '../config/fileStorage';
import routes from '../navigation/routes';
import groupService from '../services/group.service';

export default function MyGroups({ navigation }) {
  const { userState } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);

  const Item = ({ item }) => {
    return (
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
            style={styles.img}
          />
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const fetchMyGroups = () => {
      Promise.all([
        groupService.getGroupsOfOwner(userState?.userData?.id),
        groupService.getUserGroups(userState?.username),
      ])
        .then((res) => {
          setGroups([{ title: 'Groups you manage', data: res[0].data }]);
          setGroups((prev) => [...prev, { title: 'Other groups', data: res[1].data }]);
        })
        .catch((e) => console.error(e.message));
    };
    fetchMyGroups();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <HeaderWithBackArrow
          title={'Your Groups'}
          onBackButton={() => {
            navigation.goBack();
          }}
        />
      </View>
      <View style={styles.listContainer}>
        <SectionList
          showsVerticalScrollIndicator={false}
          sections={groups}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Item item={item} />}
          renderSectionHeader={(props) => {
            const {
              section: { title, data },
            } = props;

            return (
              <>
                <Text style={styles.header}>{title}</Text>
                {!data.length && (
                  <Text
                    style={{
                      fontSize: 13,
                      textAlign: 'center',
                      marginVertical: 15,
                    }}
                  >
                    {`You don't have any ${
                      title === 'Other groups' ? 'Other groups' : 'groups to manage'
                    }`}
                  </Text>
                )}
              </>
            );
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  img: {
    backgroundColor: '#33333360',
    width: 50,
    borderRadius: 10,
    resizeMode: 'cover',
    height: 50,
  },
  container: {
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 60,
  },
  item: {
    paddingHorizontal: 10,
    marginVertical: 8,
    justifyContent: 'center',
  },
  header: {
    marginTop: 15,
    marginBottom: 5,
    fontSize: 20,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
  },
});
