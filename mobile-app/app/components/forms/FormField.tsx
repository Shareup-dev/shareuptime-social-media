import React from 'react';
import { useFormikContext } from 'formik';
import { View, ViewStyle, DimensionValue } from 'react-native';

import TextInput from '../TextInput';
import ErrorMessage from './ErrorMessage';

interface AppFormFieldProps {
  name: string;
  width?: DimensionValue;
  centerText?: boolean;
  style?: ViewStyle;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
  autoFocus?: boolean;
}

const AppFormField: React.FC<AppFormFieldProps> = ({
  name,
  width,
  centerText,
  style,
  ...otherProps
}) => {
  const { 
    setFieldTouched, 
    setFieldValue, 
    errors, 
    touched, 
    values 
  } = useFormikContext<Record<string, any>>();

  const fieldValue = values[name];
  const fieldError = errors[name] as string;
  const fieldTouched = touched[name] as boolean;

  return (
    <View style={style}>
      <TextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={(text: string) => setFieldValue(name, text)}
        value={fieldValue ? fieldValue.toString() : ''}
        width={width}
        centerText={centerText}
        icon={undefined}
        error={fieldError}
        {...otherProps}
      />
      <ErrorMessage 
        error={fieldError} 
        visible={fieldTouched} 
      />
    </View>
  );
};

export default AppFormField;