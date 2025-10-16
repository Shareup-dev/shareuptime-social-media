import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import Modal from 'react-native-modal';

import ListItem from '../lists/ListItem';
import Icon from '../Icon';
import colors from '../../config/colors';
import DownModal from './DownModal';
import DrawerList from './DrawerList';

export default function PostOptionDrawer({
  options,
  isVisible,
  setIsVisible,
  title,
  source,
  postId,
  postText,
}) {
  const [optionsList, setOptionsList] = useState(() => options); //.slice(0, -1));
  //const [lastItem, setLastItem] = useState(() => options.slice(-1).pop());

  return (
    <DownModal isVisible={isVisible} setIsVisible={setIsVisible}>
      {title && <Text style={styles.title}>{title}</Text>}

      <DrawerList options={optionsList} />

      {/* <ListItem
        titleStyle={styles.lastItemTitle}
        style={styles.listItem}
        title={lastItem.title}
        onPress={lastItem.onPress}
        isBottomSheet = {true}
        IconComponent={
          <Icon
            name={lastItem.icon.name}
            type={lastItem.icon.type}
            image={lastItem.icon.image}
            color={colors.dimGray}
            backgroundSizeRatio={0.6}
          />
        }
      /> */}
    </DownModal>
  );
}

const styles = StyleSheet.create({
  tip: {
    height: 3,
    width: 40,
    borderRadius: 25,
    backgroundColor: colors.LightGray,
    alignSelf: 'center',
  },
  title: {
    fontSize: 17,
    marginTop: 23,
    marginBottom: 10,
    marginLeft: 60,
  },
  listItem: {
    paddingVertical: 5,
  },
  listItemTitle: {
    fontWeight: 'normal',
    color: colors.mediumGray,
  },
  lastItemTitle: {
    color: colors.red,
  },
});
