import React from 'react';
import { ImageStyle } from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import colors from '../../config/colors';

import type { StyleProp } from 'react-native';

interface Props {
  style?: StyleProp<ImageStyle>;
  noBackground?: boolean;
  minHeight?: number;
}

const BetterImage: React.FC<Props & FastImageProps> = (props) => {
  const { style, minHeight, noBackground, ...rest } = props;
  return (
    <FastImage
      {...rest}
      style={[
        style,
        { backgroundColor: noBackground ? undefined : colors.lighterGray },
        { minHeight },
      ]}
    />
  );
};

export default BetterImage;
