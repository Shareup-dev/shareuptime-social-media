import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { HeaderWithBackArrow } from '../components/headers';
import colors from '../config/colors';
import fileStorage from '../config/fileStorage';
// import routes from '../navigation/routes';
import groupService from '../services/group.service';

// Hoisted item to avoid nested components during render
const RequestItem = ({ item, acceptMemberRequest, rejectMemberRequest }) => (
  <View style={styles.itemRowBetween}>
    <View style={styles.rowCenter}>
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
    <View style={styles.rowCenter}>
      <TouchableOpacity
        onPress={() => acceptMemberRequest(item.id)}
        activeOpacity={0.6}
        style={[styles.btn, styles.btnPrimary]}
      >
        <Text style={styles.whiteTxt}>Accept</Text>
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

  // Use hoisted RequestItem

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
        <Text style={styles.centerInfoTxt}>There is no requests to display</Text>
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.centerInfoTxt}>New requests</Text>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={requests}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <RequestItem
                item={item}
                acceptMemberRequest={acceptMemberRequest}
                rejectMemberRequest={rejectMemberRequest}
              />
            )}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  itemRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    borderBottomColor: '#cacaca60',
    borderBottomWidth: 1,
  },
  btn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#cacaca',
    borderRadius: 5,
    marginHorizontal: 4,
  },
  btnPrimary: { backgroundColor: colors.iondigoDye },
  whiteTxt: { color: '#fff' },
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
  centerInfoTxt: {
    marginVertical: 10,
    marginHorizontal: 5,
    fontSize: 16,
    textAlign: 'center',
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
