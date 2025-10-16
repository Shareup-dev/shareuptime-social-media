import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, DimensionValue } from 'react-native';
import type { ReactNode } from 'react';

import colors from '@/config/colors';
import ButtonText from './ButtonText';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  width?: DimensionValue;
  style?: ViewStyle | ViewStyle[];
  fontSize?: number;
  fontColor?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  color = colors.iondigoDye,
  width = '100%',
  style,
  fontSize,
  fontColor,
  icon,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, { backgroundColor: color, width }, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && icon}
      <ButtonText style={{}} fontSize={fontSize} fontColor={fontColor}>
        {title}
      </ButtonText>
    </TouchableOpacity>
  );
};

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

export default AppButton;
