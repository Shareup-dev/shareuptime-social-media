import { StyleSheet, View } from 'react-native';

import IconButton from './buttons/IconButton';
import React from 'react';

export default function AlternativeRegistrationContainer() {
  return (
    <View style={styles.container}>
      <IconButton image={require('../assets/google-icon.png')} style={styles.iconButton} />

      <IconButton image={require('../assets/linkedin-icon.png')} style={styles.iconButton} />

      <IconButton image={require('../assets/facebook-icon.png')} style={styles.iconButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: 20,
  },
  iconButton: {
    margin: 20,
  },
});
