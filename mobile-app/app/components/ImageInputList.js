import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Icon from './Icon';
import ImageInput from './ImageInput';

export default function ImageInputList({ imageUris, onAddImage, onRemoveImage, isSwap }) {
  const scrollView = useRef();
  //const imageUrisSet = imageUris.map((imageUris) => imageUris.replace('file:', ''));
  const { width, height } = Dimensions.get('screen');
  return (
    <View style={styles.container}>
      <FlatList
        //ref={scrollView}
        // onContentSizeChange={() => scrollView.current.scrollToEnd()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={imageUris}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item, index }) => {
          return <Image source={{ uri: item }} style={{ width: width, height: height / 2 }} />;
        }}
      >
        {imageUris.map((uri) => (
          <View key={uri} style={isSwap ? null : styles.imagePadding}>
            <ImageInput imageUri={uri} onChangeImage={() => onRemoveImage(uri)} />
            {isSwap && imageUris.indexOf(uri) == 0 && imageUris.length === 2 && (
              <Icon image={require('../assets/icons/swap-icon.png')} style={styles.swapIcon} />
            )}
          </View>
        ))}

        {isSwap && imageUris.length < 2 && (
          <ImageInput onChangeImage={(uri) => onAddImage(uri)} isSwap={isSwap} />
        )}
      </FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  imagePadding: {
    marginBottom: 10,
  },
  swapIcon: {
    alignSelf: 'center',
  },
  Image: {
    width: '100%',
    height: '100%',
  },
});
