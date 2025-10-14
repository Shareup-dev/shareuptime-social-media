import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import type { ReactNode } from 'react';

import colors from '@/config/colors';

interface ButtonTextProps {
  children: ReactNode;
  style?: TextStyle | TextStyle[];
  fontSize?: number;
  fontColor?: string;
}

const ButtonText: React.FC<ButtonTextProps> = ({
  children,
  style,
  fontSize = 18,
  fontColor,
}) => {
  return (
    <Text
      style={[
        styles.text,
        { fontSize: fontSize, color: fontColor ? fontColor : colors.white },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

export default ButtonText;