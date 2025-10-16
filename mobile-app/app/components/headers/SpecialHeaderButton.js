import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import colors from '../../config/colors';

export default function SpecialHeaderButton({ title, isActive = true, onPress }) {
  return isActive ? (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.button, styles.active]}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  ) : (
    <View style={[styles.button, styles.inactive]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    height: 32,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: colors.iondigoDye,
  },
  inactive: {
    backgroundColor: colors.LightGray,
  },
  title: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
