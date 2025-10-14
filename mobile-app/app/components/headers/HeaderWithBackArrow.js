import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, Text} from 'react-native';
import colors from '../../config/colors';

import Icon from '../Icon';

export default function HeaderWithBackArrow({
  onBackButton,
  title,
  component,
  leftComponent,
  rightComponent,
  titleStyle,
}) {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onBackButton}>
        <Icon
          name="chevron-back"
          type="Ionicons"
          size={35}
          backgroundSizeRatio={0.8}
        />
      </TouchableWithoutFeedback>
      {leftComponent}
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      {component}
      {rightComponent && (
        <View style={styles.rightComponent}>{rightComponent}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 13,
    height: 60,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  rightComponent: {
    position: 'absolute',
    right: '2%',
  },
});
