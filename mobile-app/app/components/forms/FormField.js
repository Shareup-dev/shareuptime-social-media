import React from 'react';
import { useFormikContext } from 'formik';

import TextInput from '../TextInput';
import ErrorMessage from './ErrorMessage';
import { View } from 'react-native';

export default function AppFormField({ name, width, centerText, style, ...otherProps }) {
  const { setFieldTouched, setFieldValue, errors, touched, values } = useFormikContext();

  return (
    <View style={style}>
      <TextInput
        onBlur={() => setFieldTouched(name)} // to check if the email field has ben touched then display it's error message
        onChangeText={(text) => setFieldValue(name, text)}
        value={values[name].toString()}
        width={width}
        centerText={centerText}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
}
