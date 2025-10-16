import React from 'react';
import { View, StyleSheet } from 'react-native';

import Text from '../Text';
import defaultStyles from '../../config/styles';
import colors from '../../config/colors';

export default function ListHeader({ title, subtitle, align = 'center', containerStyle }) {
  return (
    <View style={[styles.container, containerStyle]}>
      {title && <Text style={[styles.title, defaultStyles.titleFontSize]}>{title}</Text>}
      <Text style={[styles.subtitle, defaultStyles.fontWeightMedium]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.mediumGray,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',

    marginVertical: 20,
  },
});
