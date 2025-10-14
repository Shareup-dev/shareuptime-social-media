import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import colors from '../../config/colors';

interface HeaderProps {
  left?: React.ReactNode;
  middle?: React.ReactNode;
  right?: React.ReactNode;
  backgroundColor?: string;
  headerContainerStyle?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  left,
  middle,
  right,
  backgroundColor = colors.lighterGray,
  headerContainerStyle,
}) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        headerContainerStyle,
      ]}
    >
      <View style={styles.section}>{left}</View>
      <View style={styles.section}>{middle}</View>
      <View style={styles.section}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 13,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: colors.LightGray,
  },
  section: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Header;