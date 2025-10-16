import React, { useMemo } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import Screen from '../components/Screen';
import colors from '../config/colors';
import { HeaderWithBackArrow } from '../components/headers';

import Separator from '../components/Separator';
import TabNavigation from '../navigation/TabNavigation';
import ListOfFeelings from '../components/lists/ListOfFeelings';
import ListOfActivities from '../components/lists/ListOfactivities';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../components/Icon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { postFeelingsActions } from '../redux/postFeelings';

export default function FeelingAndActivity({ navigation }) {
  const postFeel = useSelector((state) => state.postFeel);
  const dispatch = useDispatch();

  const tabMenus = useMemo(
    () => [
      {
        name: 'Feelings',
        component: <ListOfFeelings navigation={navigation} />,
      },
      {
        name: 'Activities',
        component: <ListOfActivities navigation={navigation} />,
      },
    ],
    [navigation],
  );

  return (
    <Screen style={styles.container}>
      <HeaderWithBackArrow
        onBackButton={() => navigation.goBack()}
        component={
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Feelings and Activities</Text>
          </View>
        }
      />
      <Separator />
      {postFeel.feeling && (
        <View style={styles.selectedState}>
          {postFeel.img ? (
            <Image source={postFeel.img} style={styles.feelImg} />
          ) : (
            <Icon name={postFeel.icon} color={postFeel.color} size={50} />
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={(styles.postFeelText, { fontWeight: '700', fontSize: 14 })}>
              {postFeel.feeling}
            </Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => dispatch(postFeelingsActions.setDefault())}
            >
              <Icon name="close" color={colors.dimGray} size={35} type="AntDesign" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* <TextField
        placeholder="Search Friends"
        iconName="search1"
        iconType="AntDesign"
        style={styles.searchbar  }
      /> */}
      <TabNavigation tabMenus={tabMenus} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  feelImg: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  usersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  titleContainer: {
    marginLeft: 20,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
  },
  searchbar: {
    width: '100%',
  },

  separator: {
    backgroundColor: colors.LightGray,
    width: '100%',
    height: 10,
    marginTop: 15,
  },
  selectedState: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
