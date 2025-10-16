import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, SectionList, Text, Image, TouchableOpacity } from 'react-native';
import DownModal from '../components/drawers/DownModal';
import AuthContext from '../authContext';
import { HeaderWithBackArrow } from '../components/headers';
import Icon from '../components/Icon';
import fileStorage from '../config/fileStorage';
import groupService from '../services/group.service';
import AppTextField from '../components/TextField';

export default function ListOfMembers({ navigation, route }) {
  const { userData } = useContext(AuthContext).userState;
  const { params: groupData } = route;

  const initSearchVal = {
    keyword: '',
    result: [],
    loading: 0,
  };
  const [search, setSearch] = useState(initSearchVal);

  const initSelMember = {
    member: null,
    role: null,
  };
  const [selectedMember, setSelectedMember] = useState(initSelMember);
  const [members, setMembers] = useState({
    loading: 0,
    sections: [],
  });

  const [modelOpen, setModelOpen] = useState(false);
  const handleCloseModel = () => {
    setModelOpen(false);
    setSelectedMember(initSelMember);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const SearchMembers = (_) => {
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

  const fetchData = () => {
    setMembers((prev) => ({ ...prev, loading: 1 }));

    Promise.all([groupService.getAdmins(groupData.id), groupService.getMembers(groupData.id)])
      .then((res) =>
        setMembers((prev) => ({
          ...prev,
          sections: [
            { title: 'Admin', data: [groupData?.owner, ...res[0].data] },
            { title: 'Members', data: res[1].data },
          ],
        })),
      )
      .catch((e) => console.error(e))
      .finally((_) => setMembers((prev) => ({ ...prev, loading: 2 })));
  };

  const addAdmin = () => {
    const uid = selectedMember.member?.id;
    groupService
      .addAdmin(groupData.id, uid)
      .then((res) => {
        if (res.status === 200) {
          fetchData();
        }
      })
      .catch((e) => console.error(e));
  };

  const removeFromGroup = (_) => {
    groupService
      .deleteMember(userData.id, selectedMember.member?.id, groupData.id)
      .then(
        (res) =>
          res.status === 200 &&
          setMembers((prev) => ({
            ...prev,
            sections: [
              ...prev.sections[0],
              {
                title: 'Members',
                data: prev.sections[1]?.data.filter(
                  (item) => item.id !== selectedMember.member?.id,
                ),
              },
            ],
          })),
      )
      .catch((e) => e);
  };

  const checkOwner = (uid = userData.id) => {
    if (uid === groupData.owner?.id) return true;
    else return false;
  };

  const Item = ({ item, title }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        disabled={!checkOwner()}
        onPress={() => {
          setModelOpen(true);
          setSelectedMember({
            member: item,
            role: title,
          });
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
              item.image
                ? { uri: fileStorage.baseUrl + item.image }
                : require('../assets/images/group-texture.png')
            }
            style={styles.img}
          />
          <View style={styles.item}>
            <Text style={styles.title}>{`${item.firstName}`}</Text>
            <Text> {`@${item.lastName}-${item.id}`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const DropDownMenu = () => {
    return (
      <View style={styles.menuContainer}>
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: '#cacaca',
              width: 80,
              height: 6,
              borderRadius: 6,
            }}
          />
        </View>
        <TouchableOpacity style={styles.menu} onPress={() => addAdmin()}>
          <Text style={styles.menuText}>
            {selectedMember.role === 'Admin' ? 'Remove from admin' : 'Make admin'}
          </Text>
          <Text>
            {selectedMember.role === 'Admin'
              ? 'Remove from the admin role'
              : `Make this member as admin`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menu}
          onPress={(_) => (checkOwner(selectedMember.member?.id) ? null : removeFromGroup())}
        >
          <Text style={styles.menuText}>
            {checkOwner(selectedMember.member?.id) ? 'Left group' : 'Remove'}
          </Text>
          <Text>
            {checkOwner(selectedMember.member?.id)
              ? 'Left from this group'
              : 'Remove this member from this group'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <DownModal isVisible={modelOpen} setIsVisible={handleCloseModel}>
        <DropDownMenu />
      </DownModal>
      <View style={styles.container}>
        <HeaderWithBackArrow
          component={
            <AppTextField
              placeholder="Search members"
              iconName="search1"
              iconType="AntDesign"
              style={styles.searchbar}
              onChangeText={(val) => setSearch((prev) => ({ ...prev, keyword: val }))}
              onSubmitEditing={SearchMembers}
              value={search.keyword}
              returnKeyType="search"
              endComponent={
                <TouchableOpacity style={{ marginLeft: 10 }} onPress={handleClearSearch}>
                  <Icon name="close" noBackground size={35} style={{ paddingHorizontal: 5 }} />
                </TouchableOpacity>
              }
            />
          }
          onBackButton={() => {
            navigation.goBack();
          }}
        />
      </View>
      <View style={styles.listContainer}>
        <SectionList
          showsVerticalScrollIndicator={false}
          sections={members.sections}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, section }) => <Item item={item} title={section.title} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  menuContainer: {},
  menu: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  menuText: {
    fontWeight: '600',
    fontSize: 20,
    color: '#585858',
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
  searchbar: {
    width: '90%',
    marginLeft: 10,
  },
  item: {
    paddingHorizontal: 10,
    marginVertical: 8,
    justifyContent: 'center',
  },
  header: {
    marginTop: 15,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
  },
});
