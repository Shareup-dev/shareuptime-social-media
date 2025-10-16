import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colors from '../../config/colors';
import Icon from '../Icon';

export default React.forwardRef(function CommentTextField(
  { onForwardPress, onChangeText, isReply, ...otherProps },
  ref,
) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={!isReply ? 'Comment...' : 'Reply...'}
        placeholderTextColor={colors.mediumGray}
        style={styles.textInput}
        onChangeText={onChangeText}
        ref={ref}
        autoFocus={isReply}
        {...otherProps}
      />
      <TouchableOpacity onPress={onForwardPress}>
        <Icon
          image={require('../../assets/icons/forward-icon.png')}
          backgroundSizeRatio={1}
          size={33}
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.lighterGray,
    width: '100%',
    height: 45,
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 6,
    borderRadius: 20,
  },
  textInput: {
    flex: 1,
  },
});
