import { StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';

import React from 'react';
import colors from '../../config/colors';

export default function LinkButton({ title, fontSize = 20, style, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Text style={[styles.text, { fontSize: fontSize }, style]}>{title}</Text>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.iondigoDye,
  },
});
