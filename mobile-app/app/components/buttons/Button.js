import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import colors from '../../config/colors';
import ButtonText from './ButtonText';

export default function AppButton({
  title,
  onPress,
  color = colors.iondigoDye,
  width = '100%',
  style,
  fontSize,
  fontColor,
  icon,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, { backgroundColor: color, width }, style]} //wrap the button inside a container to modify the width: ;
      onPress={onPress}
    >
      {icon && icon}
      <ButtonText fontSize={fontSize} fontColor={fontColor}>
        {title}
      </ButtonText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    elevation: 6,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },
    paddingHorizontal: 40,
    height: 50,
  },
});
