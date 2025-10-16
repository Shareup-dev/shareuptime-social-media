import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from '../components/Icon';

export default function AddPostButton({ onPress }) {
  let isReelScreen = useSelector((state) => state.reelScreenDetector);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Icon
          image={
            isReelScreen
              ? require('../assets/tab-navigation-icons/aperture-icon.png')
              : require('../assets/tab-navigation-icons/add-icon.png')
          }
          backgroundColor={null}
          backgroundSizeRatio={1}
          size={56}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    bottom: 15,
    // opacity: 0.8,
  },
});
