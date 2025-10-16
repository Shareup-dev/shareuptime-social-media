import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import colors from '../../config/colors';
import Icon from '../Icon';
import Separator from '../Separator';

export default function RadioItem({ item }) {
  return (
    <>
      <View style={styles.container}>
        <Icon image={item.icon} backgroundSizeRatio={1} size={20} />
        <RadioButton.Item
          value={item.value}
          label={item.label}
          color={colors.iondigoDye}
          style={styles.radioButton}
          labelStyle={styles.radioLabel}
        />
        <Text style={styles.radioDescription}>{item.description}</Text>
      </View>
      <Separator style={styles.separator} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    width: '90%',
  },
  radioButton: {
    flexDirection: 'row',
    width: '100%',
  },
  radioDescription: {
    position: 'absolute',
    top: '65%',
    left: '10%',
    color: colors.mediumGray,
  },
  separator: {
    marginVertical: 5,
  },
});
