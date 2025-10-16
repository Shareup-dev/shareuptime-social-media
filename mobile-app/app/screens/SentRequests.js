import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableWithoutFeedback } from 'react-native';
import { useSelector } from 'react-redux';
import Screen from '../components/Screen';
import { Header, HeaderTitle } from '../components/headers';
import Icon from '../components/Icon';
import authContext from '../authContext';
import ListItem from '../components/lists/ListItem';
import UserService from '../services/user.service';
import store from '../redux/store';
import { sentRequestsActions } from '../redux/sentRequests';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import ActivityScreen from './ActivityScreen';
import routes from '../navigation/routes';

export default function SentRequests({ navigation }) {
  //const {user: loggedInUser} = useContext(authContext);
  const { userState } = useContext(authContext);
  const [sentto, setSentto] = useState([]);
  const [fetch, setFetch] = useState(false);
  //let sentto = useSelector(state => state.sentRequests);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      UserService.getFriendRequestSent(userState?.userData?.email).then((resp) => {
        setSentto(resp.data);
        resp.data.forEach((request) => {});
      });
    }
    return () => (mounted = false);
  }, [fetch]);

  const redirectToProfile = () => {};
  const onCancelRequest = (friend) => {
    sentto = sentto.filter((dost) => dost.email !== friend.email);
    //store.dispatch(sentRequestsActions.setList(sentto));
    UserService.declineFriendRequest(userState?.userData?.id, friend.id).then((resp) => {});
    setFetch(true);
    //setSentto(alreadySentTo);
  };

  const renderSentRequestsList = () => {
    if (sentto.length === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.emptyText}>You dont't have any sent requests</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            contentContainerStyle={styles.groupsList}
            data={sentto}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ListItem
                user={item}
                image={item.profilePicturePath}
                title={item.firstName}
                showCloseButton={false}
                tabTitle={
                  sentto.filter((user) => user.email === item.email)[0]
                    ? 'Cancel Request'
                    : 'Cancelled'
                }
                color={
                  sentto.filter((user) => user.email === item.email)[0]
                    ? colors.iondigoDye
                    : colors.lighterGray
                }
                fontColor={
                  sentto.filter((user) => user.email === item.email)[0] ? colors.white : colors.dark
                }
                subTitle="Sent"
                onPress={onCancelRequest}
                onPressProfile={redirectToProfile}
                style={[defaultStyles.listItemStyle, defaultStyles.lightShadow]}
                displayLeft={true}
              />
            )}
          />
        </View>
      );
    }
  };

  return (
    <Screen>
      <Header
        backgroundColor={colors.white}
        left={
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            {/* reset(
             {
                index: 0,
                actions: [
                  navigation.navigate(routes.ACTIVITY)
                ]
              })}> */}
            <Icon name="chevron-back" type="Ionicons" size={25} backgroundSizeRatio={1} />
          </TouchableWithoutFeedback>
        }
        middle={<HeaderTitle>Pending Requests</HeaderTitle>}
      />
      {renderSentRequestsList()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
    marginTop: 150,
    fontSize: 18,
  },
  shadowBox: {
    backgroundColor: 'coral',
    height: 50,
    shadowColor: 'red',
  },
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 12,
  },
  friendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderWidth: 0,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recommendation: {
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  requestBtn: {
    paddingHorizontal: 1,
    padding: 1,
    borderRadius: 6,
    shadowColor: 'red',
    elevation: 0,
    height: 35,
  },
});
