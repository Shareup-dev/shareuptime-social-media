import { Image, TouchableOpacity } from 'react-native';

import React from 'react';

export default function IconButton({ image, IconComponent, onPress, size = 40, style }) {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      {image && <Image source={image} style={{ width: size, height: size }} />}
      {IconComponent}
    </TouchableOpacity>
  );
}
