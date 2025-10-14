/**
 *
 * This is less customizable Text input
 */

import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

import Icon from '../components/Icon';
import colors from '../config/colors.js';

export default function AppTextField({
  iconName,
  iconType,
  iconImage,
  width = '100%',
  height = 40,
  centerText = false,
  backgroundColor = colors.lighterGray,
  isCenterTextAlign = false,
  style,
  endComponent,
  ...otherProps
}) {
  return (
    <View style={[styles.container, {width, height, backgroundColor}, style]}>
      {(iconName || iconImage) && (
        <Icon
          name={iconName}
          type={iconType}
          image={iconImage}
          size={40}
          color={colors.dimGray}
          backgroundColor={backgroundColor}
        />
      )}
      <TextInput
        placeholderTextColor={colors.dimGray}
        style={[
          styles.text,
          {textAlign: isCenterTextAlign ? 'center' : 'auto'},
        ]}
        {...otherProps}
      />
      {endComponent}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    width: '75%',
    color: colors.dark,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
  },
});
