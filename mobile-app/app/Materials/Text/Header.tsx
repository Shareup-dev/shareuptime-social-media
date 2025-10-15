import React from 'react';
import {ColorValue, Text, TextStyle} from 'react-native';



type Props = {
  children: String;
  style?: TextStyle;
  size?: number;
  color?: ColorValue;
};

const Header: React.FC<Props> = ({
  children,
  style,
  size = 18,
  color = '#333',
  ...rest
}) => {
  return (
    <Text {...rest} style={[style, {fontSize: size, color: color}]}>
      {children}
    </Text>
  );
};

export default React.memo(Header);
