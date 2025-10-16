import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

import BottomSheet from '../BottomSheet';
import DrawerList from './DrawerList';
import defaultStyle from '../../config/styles';
import colors from '../../config/colors';

const height = Dimensions.get('window').height;

export default function EnhancedOptionsDrawer({ options, forwardedRef }) {
  const renderHeader = () => (
    <View style={[styles.header]}>
      <View style={defaultStyle.tip} />
    </View>
  );

  const renderContent = () => (
    <View style={styles.container}>
      <DrawerList options={options} />
    </View>
  );

  return (
    <BottomSheet ref={forwardedRef}>
      {renderHeader()}
      {renderContent()}
    </BottomSheet>
  );
  // return <Text>works</Text>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white },
  contentContainer: { alignItems: 'center', backgroundColor: colors.white },
  header: {
    padding: 10,
    backgroundColor: colors.white,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderLeftWidth: 2.5,
    borderColor: colors.lighterGray,
  },
});
