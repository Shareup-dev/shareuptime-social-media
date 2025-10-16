import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import Tab from '../buttons/Tab';
import colors from '../../config/colors';
import defaultStyle from '../../config/styles';
import routes from '../../navigation/routes';
import fileStorage from '../../config/fileStorage';
import GroupService from '../../services/GroupService';
import AuthContext from '../../authContext';

const resizeRatio = 0.7;
export default function GroupJoinCard({ item, navigation }) {
  const { image, name, description, privacySetting: _privacySetting, id } = item;

  const [joinBackGroundColor, setJoinBackGroundColor] = useState(colors.iondigoDye);
  const { userData: loggedInUser } = useContext(AuthContext).userState;

  const [joinTitle, setJoinTitle] = useState('Join');
  const [joinTitleColor, setJoinTitleColor] = useState(colors.white);

  const handleJoin = () => {
    GroupService.joinGroup(loggedInUser.id, id).then((resp) => resp.data);
    if (joinTitle === 'Join') {
      setJoinBackGroundColor(colors.lighterGray);
      setJoinTitle('Leave');
      setJoinTitleColor('#DD482E');
    }
    if (joinTitle === 'Leave') {
      setJoinBackGroundColor(colors.iondigoDye);
      setJoinTitle('Join');
      setJoinTitleColor(colors.white);
    }
  };

  return (
    <View style={[styles.container, defaultStyle.cardBorder]}>
      {image ? (
        <Image source={{ uri: fileStorage.baseUrl + image }} style={styles.image} />
      ) : (
        <Image source={require('../../assets/images/group-texture.png')} style={styles.image} />
      )}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.GROUP_FEED, item);
        }}
      >
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text numberOfLines={1} style={styles.description}>
          {description}
        </Text>
      </TouchableOpacity>
      <View style={styles.tabsContainer}>
        <Tab
          title={joinTitle}
          style={styles.tab}
          height={20}
          sizeRatio={resizeRatio}
          fontColor={joinTitleColor}
          color={joinBackGroundColor}
          width="45%"
          onPress={handleJoin}
        />
        <Tab
          title="View"
          style={styles.tab}
          height={20}
          sizeRatio={resizeRatio}
          color={colors.lighterGray}
          width="45%"
          fontColor={colors.dark}
          onPress={() => {
            navigation.navigate(routes.GROUP_FEED, item);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width / 3.4,
    height: 190,
    overflow: 'hidden',
    marginRight: 7,
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: '55%',
    // borderRadius: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    top: 15,
  },
  tab: {
    borderRadius: 4,
    margin: 3,
    height: 17,
  },
  tabTitleStyle: {
    fontSize: 13,
  },
  name: {
    fontSize: 11,
    margin: 5,
  },
  description: {
    fontSize: 10,
    color: colors.mediumGray,
    marginHorizontal: 5,
    overflow: 'hidden',
  },
});
