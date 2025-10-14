import React from 'react';
import {View, TextInput, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import defaultStyles from '../config/styles.js';
import colors from '../config/colors.js';

export default function AppTextInput({
  icon,
  width = '100%',
  centerText = false,
  backgroundColor = colors.lighterGray,
  error,
  ...otherProps
}) {
  return (
    <>
      <View
        style={[
          defaultStyles.inputContainer,
          {width, backgroundColor, borderColor: error ? 'crimson' : '#cacaca'},
        ]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={colors.dimGray}
            style={defaultStyles.inputIcon}
          />
        )}
        <TextInput
          placeholderTextColor={colors.dimGray}
          style={[
            defaultStyles.text,
            {
              width: '100%',
              textAlign: centerText ? 'center' : 'auto',
              height: 50,
              fontSize: 16,
            },
          ]}
          {...otherProps}
        />
      </View>
      <Text
        style={{color: 'crimson', paddingHorizontal: 30, textAlign: 'right'}}>
        {error}
      </Text>
    </>
  );
}
