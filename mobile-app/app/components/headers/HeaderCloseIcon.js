import React from 'react';
import { StyleSheet } from 'react-native';

import IconButton from '../buttons/IconButton';
import Icon from '../Icon';
import colors from '../../config/colors';

export default function HeaderCloseIcon({ onPress, backgroundColor = colors.lighterGray }) {
  return (
    <IconButton
      style={styles.iconButton}
      onPress={onPress}
      IconComponent={
        <Icon
          name="close"
          color={colors.dimGray}
          type="AntDesign"
          backgroundColor={backgroundColor}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  iconButton: { color: colors.dimGray },
});
