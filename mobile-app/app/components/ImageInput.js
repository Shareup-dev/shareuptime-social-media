import React, { useEffect } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, Alert } from 'react-native';

import { MaterialCommunityIcons } from 'react-native-vector-icons';

import colors from '../config/colors';
import Icon from './Icon';

export default function ImageInput({ imageUri, onChangeImage, isSwap }) {
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) alert('You need to enable permission to access the library');
  };

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
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: true,
        quality: 0.5,
      });
      if (!result.cancelled) onChangeImage(result.uri);
    } catch (error) {
      console.error('Error reading an image', error);
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
