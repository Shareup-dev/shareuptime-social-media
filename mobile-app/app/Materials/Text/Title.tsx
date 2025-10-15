import React from 'react';
import {ColorValue, Text, TextStyle} from 'react-native';

type Props = {
  children: String;
  style?: TextStyle;
  size?: number;
  color?: ColorValue;
};

const Title: React.FC<Props> = ({
  children,
  style,
  size = 16,
  color = '#333',
  ...rest
}) => {
  return (
    <Text
      {...rest}
      style={[
        style,
        {
          fontSize: size,
          color: color,
          fontWeight: '700',
          textTransform: 'capitalize',
        },
      ]}>
      {children}
    </Text>
  );
};

export default React.memo(Title);
