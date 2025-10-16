import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';

import colors from '../../config/colors';
import Icon from '../Icon';
import defaultStyles from '../../config/styles';

export default function HangCard({ title, image, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.container, defaultStyles.lightShadow]}>
        <Icon image={image} backgroundSizeRatio={0.8} />
        <Text>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.lighterGray,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
