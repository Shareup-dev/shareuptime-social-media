import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useFormikContext } from 'formik';
import { RadioButton } from 'react-native-paper';

import colors from '../../config/colors';
import ErrorMessage from './ErrorMessage';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import defaultStyles from '../../config/styles';

export default function FormRadio({ name, style }) {
  const { values, handleChange, errors } = useFormikContext();
  return (
    <View style={[styles.container, style]}>
      <RadioButton.Group value={values[name].toString()} onValueChange={handleChange(name)}>
        <Text style={[styles.title, defaultStyles.fontWeightMedium]}>Gender</Text>

        <RadioButton.Item
          label="Male"
          value="Male"
          color={colors.iondigoDye}
          style={styles.radioItem}
          labelStyle={styles.label}
        />

        <RadioButton.Item
          label="Female"
          value="Female"
          color={colors.iondigoDye}
          style={styles.radioItem}
          labelStyle={styles.label}
        />
        <ErrorMessage error={errors[name]} visible={errors[name]} />
      </RadioButton.Group>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  RadioTitle: {
    marginBottom: 10,
    fontSize: 22,
  },
  radioItem: {
    flexDirection: 'row',
    width: '100%',
    padding: 0,
    margin: 0,
    height: 50,
  },
  label: {
    fontSize: 19,
  },
  title: { color: colors.dark, fontSize: 20 },
});
