import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '../../config/colors';
/**
 * pass a component for {left, middle, right} props
 */
export default function Header({
  left,
  middle,
  right,
  backgroundColor = colors.lighterGray,
  headerContainerStyle,
}) {
  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }, headerContainerStyle]}>
      <View>{left}</View>
      <View>{middle}</View>
      <View>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 13,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: colors.LightGray,
  },
});
