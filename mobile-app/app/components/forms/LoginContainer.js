import React from 'react';
import { StyleSheet, Animated, Dimensions, View } from 'react-native';
import useAnimatedKeyboardEvent from '../../hooks/useAnimatedKeyboardEvent';

import Screen from '../Screen';

const LOGO_Hight = Dimensions.get('window').height * 0.35;
const LOGO_Hight_SMALL = Dimensions.get('window').height * 0.25;

export default function LoginContainer({ children }) {
  const { currentValue: currentLogoHight } = useAnimatedKeyboardEvent(LOGO_Hight, LOGO_Hight_SMALL);

  return (
    <Screen>
      <Animated.Image
        source={require('../../assets/logo.png')}
        style={[styles.logo, { height: currentLogoHight }]}
      />
      <View style={styles.innerContainer}>{children}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 20,
    width: '100%',
    height: LOGO_Hight,
  },
});
