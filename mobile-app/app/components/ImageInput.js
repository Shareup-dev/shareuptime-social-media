import React from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import colors from '../config/colors';
import Icon from './Icon';

export default function ImageInput({ imageUri, onChangeImage, isSwap }) {
  const onPress = () => {
    if (!imageUri) selectImage();
    else
      Alert.alert('Delete', 'Are you sure you want to delete this image?', [
        { text: 'Yes', onPress: () => onChangeImage(null) },
        { text: 'No' },
      ]);
  };

  const selectImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
        selectionLimit: 1,
        includeBase64: false,
      });
      if (!result.didCancel && result.assets && result.assets.length > 0) {
        onChangeImage(result.assets[0].uri);
      }
    } catch (e) {
      console.error('Error reading an image', e);
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <>
          <Icon
            name="close"
            type="AntDesign"
            style={styles.closeIcon}
            backgroundColor={colors.lighterGray}
            color={colors.white}
            backgroundSizeRatio={0.8}
            size={25}
            onPress={onPress}
          />
          <Image source={{ uri: imageUri }} style={styles.Image} />
        </>
      ) : (
        isSwap && (
          <TouchableWithoutFeedback onPress={onPress}>
            <Image
              source={require('../assets/icons/swap-square-dashed.png')}
              style={styles.swapIcon}
            />
          </TouchableWithoutFeedback>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 250,
    justifyContent: 'center',
    width: '100%',
  },
  Image: {
    width: '100%',
    height: '100%',
  },
  swapIcon: {
    width: 100,
    height: 100,
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
    opacity: 0.8,
  },
});
