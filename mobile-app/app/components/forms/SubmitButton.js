import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useFormikContext} from 'formik';

import Button from '../buttons/Button';

export default function SubmitButton({
  title,
  style,
  disabled = false,
  ...rest
}) {
  const {handleSubmit} = useFormikContext();
  return (
    <View style={[style, {opacity: disabled ? 0.6 : 1}]}>
      <Button
        title={title}
        {...rest}
        disabled={disabled}
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
