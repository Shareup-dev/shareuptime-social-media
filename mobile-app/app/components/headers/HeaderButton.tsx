import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';

import Button from '../buttons/LinkButton';
import colors from '../../config/colors';

interface HeaderButtonProps {
  title: string;
  onPress?: () => void;
  isActive?: boolean;
  style?: TextStyle;
  disabled?: boolean;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({
  title,
  onPress,
  isActive = false,
  style,
  disabled = false,
}) => {
  const buttonStyle = [
    isActive ? styles.activeButton : styles.inactiveButton,
    disabled && styles.disabledButton,
    style,
  ];

  return <Button title={title} onPress={disabled ? undefined : onPress} style={buttonStyle} />;
};

const styles = StyleSheet.create({
  activeButton: {
    color: colors.iondigoDye,
    fontWeight: '600',
  },
  inactiveButton: {
    color: colors.dimGray,
    fontWeight: '400',
  },
  disabledButton: {
    color: colors.LightGray,
    opacity: 0.5,
  },
});

export default HeaderButton;
