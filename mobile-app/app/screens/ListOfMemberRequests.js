import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { HeaderWithBackArrow } from '../components/headers';
import colors from '../config/colors';
import fileStorage from '../config/fileStorage';
// import routes from '../navigation/routes';
import groupService from '../services/group.service';

export default function MemberRequest({ navigation, route }) {
  const { params: groupData } = route;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    const fetchMemberRequests = async () => {
      setLoading(1);
      groupService
        .listOfRequests(groupData.id)
        .then((res) => setRequests(res.data))
        .catch((e) => console.error(e.message))
        .finally((_) => setLoading(2));
    };
    fetchMemberRequests();
  }, []);

  const acceptMemberRequest = (id) => {
    groupService
      .acceptMemberRequest(id)
      .then(
        (res) => res.status === 200 && setRequests((prev) => prev.filter((item) => item.id !== id)),
      )
      .catch((e) => console.error(e.message));
  };

  const rejectMemberRequest = (id) => {
    groupService
      .rejectMemberRequest(id)
      .then(
        (res) => res.status === 200 && setRequests((prev) => prev.filter((item) => item.id !== id)),
      )
      .catch((e) => console.error(e.message));
  };

  const Item = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'center',
          borderBottomColor: '#cacaca60',
          borderBottomWidth: 1,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            source={
              item?.group?.image
                ? { uri: fileStorage.baseUrl + item?.group?.image }
                : require('../assets/images/group-texture.png')
            }
            style={styles.img}
          />
          <View style={styles.item}>
            <Text style={styles.title}>@{item.user.firstName}</Text>
            <Text>requesting to join </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => acceptMemberRequest(item.id)}
            activeOpacity={0.6}
            style={[styles.btn, { backgroundColor: colors.iondigoDye }]}
          >
            <Text style={{ color: '#fff' }}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => rejectMemberRequest(item.id)}
            activeOpacity={0.6}
            style={styles.btn}
          >
            <Text>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <HeaderWithBackArrow
          title={'Member Requests'}
          onBackButton={() => {
            navigation.goBack();
          }}
        />
      </View>
      {loading === 2 && !requests.length ? (
        <Text
          style={{
            marginVertical: 10,
            marginHorizontal: 5,
            fontSize: 16,
            textAlign: 'center',
          }}
        >
          There is no requests to display
        </Text>
      ) : (
        <View style={styles.listContainer}>
          <Text
            style={{
              marginVertical: 10,
              marginHorizontal: 5,
              fontSize: 16,
              textAlign: 'center',
            }}
          >
            New requests
          </Text>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={requests}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Item item={item} />}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#cacaca',
    borderRadius: 5,
    marginHorizontal: 4,
  },
  btnTxt: {
    color: '#333',
  },
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
    fontSize: 15,
  },
});
