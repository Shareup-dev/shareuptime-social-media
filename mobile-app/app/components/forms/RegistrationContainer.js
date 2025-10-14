import React from 'react';
import {StyleSheet, Animated} from 'react-native';

import Text from '../Text';
import Screen from '../Screen';
import colors from '../../config/colors';
import useAnimatedKeyboardEvent from '../../hooks/useAnimatedKeyboardEvent';

const LOGO_SIZE = 60;
const LOGO_SIZE_SMALL = 30;

export default function RegistrationContainer({children, title = 'Register'}) {
  const {currentValue: currentLogoSize} = useAnimatedKeyboardEvent(
    LOGO_SIZE,
    LOGO_SIZE_SMALL,
  );

  return (
    <Screen style={styles.container}>
      <Animated.Image
        source={require('../../assets/main-logo.png')}
        style={[styles.logo, {height: currentLogoSize}]}
      />
      <Text style={styles.title}>{title}</Text>
      {children}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  logo: {
    alignSelf: 'center',
    marginTop: 20,
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    resizeMode: 'contain',
  },
  title: {
    fontWeight: '600',
    fontSize: 30,
    alignSelf: 'center',
    margin: 10,
    marginTop: 20,
  },
});
