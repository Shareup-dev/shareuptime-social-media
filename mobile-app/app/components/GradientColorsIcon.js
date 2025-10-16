import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import colors from '../config/colors';

const size = 40;

export function GradientColorsIcon({ ...rest }) {
  return (
    <View style={{ width: size }} {...rest}>
      <MaskedView
        style={{ flex: 1, flexDirection: 'row', height: size }}
        maskElement={
          <View
            style={{
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
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
