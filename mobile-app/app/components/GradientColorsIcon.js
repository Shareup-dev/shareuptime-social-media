import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaskedView from '@react-native-masked-view/masked-view';

const size = 40;

export function GradientColorsIcon({ ...rest }) {
  return (
    <View style={styles.container} {...rest}>
      <MaskedView
        style={styles.mask}
        maskElement={
          <View style={styles.maskInner}>
            <MaterialCommunityIcons name="power" size={size} color="black" style={styles.shadow} />
          </View>
        }
      >
        {/* <LinearGradient
          colors={[colors.linearGradientIndex0, colors.linearGradientIndex1]}
          style={{flex: 1, width: size, height: size}}
        /> */}
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: size },
  mask: { flex: 1, flexDirection: 'row', height: size },
  maskInner: { backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' },
  shadow: {
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
});
