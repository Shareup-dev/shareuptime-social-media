import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  DimensionValue,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import defaultStyles from '../config/styles';
import colors from '../config/colors';

interface AppTextInputProps {
  icon?: string;
  width?: DimensionValue;
  centerText?: boolean;
  backgroundColor?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  secureTextEntry?: boolean;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'url'
    | 'number-pad'
    | 'name-phone-pad'
    | 'decimal-pad'
    | 'twitter'
    | 'web-search'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'visible-password';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
  autoFocus?: boolean;
  returnKeyType?:
    | 'done'
    | 'go'
    | 'next'
    | 'search'
    | 'send'
    | 'default'
    | 'emergency-call'
    | 'google'
    | 'join'
    | 'route'
    | 'yahoo';
  onSubmitEditing?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
}

const AppTextInput: React.FC<AppTextInputProps> = ({
  icon,
  width = '100%',
  centerText = false,
  backgroundColor = colors.lighterGray,
  error,
  containerStyle,
  inputStyle,
  errorStyle,
  ...otherProps
}) => {
  const hasError = Boolean(error);

  return (
    <>
      <View
        style={[
          styles.container,
          {
            width,
            backgroundColor,
            borderColor: hasError ? colors.red : colors.LightGray,
            borderWidth: hasError ? 1 : 1,
          },
          containerStyle,
        ]}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={colors.dimGray}
            style={[defaultStyles.inputIcon, styles.icon]}
          />
        )}
        <TextInput
          placeholderTextColor={colors.dimGray}
          style={[
            defaultStyles.text,
            styles.textInput,
            {
              textAlign: centerText ? 'center' : 'left',
            },
            inputStyle,
          ]}
          {...otherProps}
        />
      </View>
      {hasError && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.dark,
  },
  errorText: {
    color: colors.red,
    paddingHorizontal: 15,
    textAlign: 'right',
    fontSize: 12,
    marginTop: 2,
  },
});

export default AppTextInput;
