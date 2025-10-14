import React, {useState, useContext, useRef} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';

import authContext from '../../authContext';
import colors from '../../config/colors';
import Icon from '../Icon';

export default function MessageTextField({
  style,
  forwardRef,
  contactId,
  onSend,
  ...otherProps
}) {
  const [message, setMessage] = useState('');

  const {user} = useContext(authContext);

  const textInputRed = useRef();

  const onChangeText = text => {
    setMessage(text);

  };

  const handelSendMessage = async () => {
    //Clear.
    setMessage('');
    textInputRed.current.clear();

    onSend(message, user.id, contactId);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        placeholder="Message..."
        placeholderTextColor={colors.mediumGray}
        style={styles.textInput}
        onChangeText={onChangeText}
        ref={textInputRed}
        {...otherProps}
      />

      {message === '' ? (
        <>
          <TouchableOpacity>
            <Icon
              name="microphone"
              type="SimpleLineIcons"
              backgroundColor={colors.lighterGray}
              backgroundSizeRatio={0.75}
              size={30}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="file-text"
              type="Feather"
              backgroundColor={colors.lighterGray}
              backgroundSizeRatio={0.75}
              size={30}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="image"
              type="Feather"
              backgroundColor={colors.lighterGray}
              backgroundSizeRatio={0.75}
              size={30}
              style={styles.icon}
            />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={handelSendMessage}>
          <Icon
            name="send"
            type="MaterialIcons"
            color={colors.iondigoDye}
            backgroundColor={colors.lighterGray}
            backgroundSizeRatio={0.75}
            size={30}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.lighterGray,
    height: 45,
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 6,
    borderRadius: 20,
  },
  textInput: {
    flex: 1,
  },
  icon: {
    marginLeft: 5,
  },
});
