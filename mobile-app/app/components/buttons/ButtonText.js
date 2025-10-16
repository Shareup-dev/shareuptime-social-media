import React from 'react';
import { Text, StyleSheet } from 'react-native';

import colors from '../../config/colors';

export default function ButtonText({ children, style, fontSize = 18, fontColor }) {
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
}

const styles = StyleSheet.create({
  text: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
