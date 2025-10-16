import React from 'react';
import { View, StyleSheet } from 'react-native';

import Icon from '../Icon';
import colors from '../../config/colors';

export default function FancyAddButton({ style, sizeRatio = 1 }) {
  return (
    <View
      style={[
        style,
        {
          width: 100 * sizeRatio,
          height: 100 * sizeRatio,
        },
      ]}
    >
      <View
        style={[
          styles.frontShade,
          {
            width: 100 * sizeRatio,
            height: 100 * sizeRatio,
            borderRadius: 15 * sizeRatio,
          },
        ]}
      />
      <View
        style={[
          styles.backShade,
          {
            width: 100 * sizeRatio,
            height: 100 * sizeRatio,
            marginLeft: 10 * sizeRatio,
            marginTop: 7 * sizeRatio,
            borderRadius: 15 * sizeRatio,
          },
        ]}
      >
        <Icon
          name="pluscircle"
          type="AntDesign"
          size={30 * sizeRatio}
          color={colors.iondigoDye}
          backgroundSizeRatio={1}
          style={styles.addIcon}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backShade: {
    backgroundColor: colors.lighterGray,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frontShade: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.LightGray,
    position: 'absolute',
  },
  addIcon: {
    position: 'absolute',
  },
});
