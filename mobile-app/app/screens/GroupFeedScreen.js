import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';

import Icon from '../components/Icon';
import Card from '../components/lists/Card';
import Screen from '../components/Screen';
import WritePost from '../components/WritePost';
import colors from '../config/colors';
import GroupService from '../services/group.service';
import routes from '../navigation/routes';

import { HeaderWithBackArrow } from '../components/headers';
import Tab from '../components/buttons/Tab';
import fileStorage from '../config/fileStorage';

import AuthContext from '../authContext';
import DownModal from '../components/drawers/DownModal';

const windowWidth = Dimensions.get('screen').width;
const GroupFeedScreen = ({ navigation, route }) => {
  const posts = useSelector((state) => state.groupPosts);
  const { userData } = useContext(AuthContext).userState;
  const { params: groupData } = route;

  const [group, setGroup] = useState(groupData);
  const [isMember, setIsMember] = useState(false);
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const getGroupInfo = async () => {
      setLoading(true);
      await Promise.all([
        GroupService.getGroupById(groupData.id),
        GroupService.checkIsMember(groupData.id, userData.id),
      ])
        .then((res) => {
          setGroup(res[0].data);
          setIsMember(res[1].data);
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    };
    getGroupInfo();
  }, [route.params]);

  const deleteGroup = () => {
    Alert.alert('Delete group?', 'Are you sure to this group?', [
      { text: 'Cancel', style: 'cancel', onPress: () => {} },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          GroupService.deleteGroup(userData.id, groupData.id)
            .then((_) => {
              handleCloseModel();
              navigation.popToTop();
            })
            .catch((e) => console.error(e.message)),
      },
    ]);
  };

  const handleJoinGroup = () => {
    GroupService.joinRequest(userData.id, groupData.id)
      .then((_res) => setRequested(true))
      .catch((_e) => _e);
  };
  const handleExitGroup = () => {
    GroupService.leavegroup(userData.id, groupData.id)
      .then((_res) => setIsMember(false))
      .catch((_e) => _e);
  };

  const handleCloseModel = () => {
    setMenuOpen(false);
  };

  const checkOwner = () => {
    if (userData.id === groupData.owner?.id) return true;
    else return false;
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
        <TouchableOpacity
          style={styles.menu}
          activeOpacity={0.6}
          onPress={(_) => {
            navigation.navigate(routes.EDIT_GROUP, groupData);
            setMenuOpen(false);
          }}
        >
          <Text style={styles.menuText}>Edit</Text>
          <Text>Change the name and Description</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={deleteGroup}>
          <Text style={styles.menuText}>Delete</Text>
          <Text>Delete this group</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menu}
          onPress={(_) => {
            navigation.navigate(routes.UPDATE_GROUP_PHOTO, groupData);
            setMenuOpen(false);
          }}
        >
          <Text style={styles.menuText}>Cover image</Text>
          <Text
            style={{
              maxWidth: windowWidth / 2,
            }}
          >
            Change cover image
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Screen style={styles.feedContainer}>
      <HeaderWithBackArrow
        title={group.name}
        onBackButton={() => {
          navigation.popToTop();
        }}
        rightComponent={
          <>
            {checkOwner() && (
              <TouchableOpacity activeOpacity={0.6} onPress={() => setMenuOpen((prev) => !prev)}>
                <Icon type="SimpleLineIcons" name="options" />
              </TouchableOpacity>
            )}
          </>
        }
      />
      <FlatList
        data={posts}
        ListHeaderComponent={() => {
          return (
            <View>
              <DownModal isVisible={menuOpen} setIsVisible={handleCloseModel}>
                <DropDownMenu />
              </DownModal>
              <Image
                style={styles.groupCoverImage}
                // resizeMode={route.params.image ? 'contain' : 'cover'}
                // resizeMode={'cover'}
                source={
                  group.image
                    ? {
                        uri: fileStorage.baseUrl + group.image,
                      }
                    : require('../assets/images/group-texture.png')
                }
              />
              <View style={styles.detailContainer}>
                <View style={{ marginHorizontal: 20 }}>
                  <Text style={styles.title}>{group.name}</Text>
                  <Text style={styles.subTitle}>{group.description}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Icon name={group.privacySetting ? 'lock' : 'earth'} />
                      <Text style={styles.subTitle}>
                        {group.privacySetting ? 'Private' : 'Public'} Group
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      disabled={!isMember && !checkOwner()}
                      onPress={() => {
                        navigation.navigate(routes.LIST_OF_MEMBERS, groupData);
                      }}
                    >
                      <Text style={{ fontWeight: '600', fontSize: 15 }}>Members</Text>
                    </TouchableOpacity>
                  </View>

                  {checkOwner() ? (
                    <Tab
                      iconName="add-circle"
                      iconType="Ionicons"
                      title={'invite'}
                      fontColor={colors.dark}
                      style={styles.inviteButton}
                      onPress={() => {
                        navigation.navigate(routes.INVITE_GROUP_MEMBERS, {
                          id: group.id,
                          newGroup: false,
                        });
                      }}
                    />
                  ) : (
                    <Tab
                      iconName={loading ? null : !isMember ? 'people' : 'exit'}
                      iconType="Ionicons"
                      title={
                        loading
                          ? 'Loading'
                          : !isMember
                          ? requested
                            ? 'Request sent'
                            : 'Ask to Join'
                          : 'Left Group'
                      }
                      fontColor={colors.dark}
                      style={[styles.inviteButton]}
                      disabled={loading}
                      onPress={() => {
                        !isMember ? handleJoinGroup() : handleExitGroup();
                      }}
                    />
                  )}
                  <View style={styles.membersCard} />
                  {/* <AppButton
                    icon={
                      <Icon
                        style={styles.inviteIcon}
                        size={40}
                        type={"Ionicons"}
                        name={"add-circle"}
                      />
                    }
                    title={"invite"}
                    fontColor={colors.dark}
                    style={styles.inviteButton}
                    onPress={() => {
                      navigation.navigate(routes.INVITE_GROUP_MEMBERS, {
                        groupId: route.params.groupId,
                        newGroup: false,
                      });
                    }}
                  /> */}
                </View>
                {checkOwner() || isMember ? (
                  <WritePost groupPost={true} groupId={group.id} navigation={navigation} />
                ) : (
                  <View
                    style={{
                      borderBottomColor: '#cacaca',
                      borderWidth: 0.5,
                      opacity: 0.5,
                    }}
                  />
                )}
                {posts?.length === 0 && (
                  <View>
                    <Text style={styles.noPostsLabel}>No posts found !</Text>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        keyExtractor={(post) => {
          return post.id.toString();
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card
            postId={item.id}
            userId={item.user.id}
            firstName={item.user.firstName}
            lastName={item.user.lastName}
            profileImage={item.user.profilePicturePath}
            date={item.lastEdited}
            postText={item.content}
            imageURL={item.imagePath}
            reactions={item.reactions}
            comments={item.comments}
            navigation={navigation}
            postImages={item.media}
          />
        )}
      />
    </Screen>
  );
};

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
  icon: {
    marginRight: 15,
  },
  feedContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: colors.white,
    // flex: 1,
  },
  groupCoverImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    // backgroundColor: "crimson",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 14,
    color: colors.mediumGray,
  },
  inviteIcon: {
    fontSize: 30,
    marginHorizontal: 10,
    backgroundColor: colors.lighterGray,
  },
  inviteButton: {
    backgroundColor: colors.lighterGray,
    color: colors.dark,
    elevation: 0,
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  noPostsLabel: {
    fontSize: 24,
    color: colors.LightGray,
    textAlign: 'center',
    marginTop: 80,
  },
});

export default GroupFeedScreen;
