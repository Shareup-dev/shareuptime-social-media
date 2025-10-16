import React, { Fragment } from 'react';
import { View, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Icon({
  image,
  name,
  size = 40,
  backgroundColor = '#fff',
  color = '#000',
  type = 'MaterialCommunityIcons',
  backgroundSizeRatio = 0.5,
  style,
  noBackground = false,
  ...otherProps
}) {
  const renderImageOrIcon = () => {
    if (image)
      return (
        <Image
          source={image}
          style={{
            width: size * backgroundSizeRatio,
            height: size * backgroundSizeRatio,
            resizeMode: 'contain',
          }}
        />
      );
    else
      return (
        <>
          {type === 'MaterialCommunityIcons' && (
            <MaterialCommunityIcons
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === 'AntDesign' && (
            <AntDesign
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === 'Entypo' && (
            <Entypo size={size * backgroundSizeRatio} name={name} color={color} {...otherProps} />
          )}
          {type === 'EvilIcons' && (
            <EvilIcons
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === 'Feather' && (
            <Feather size={size * backgroundSizeRatio} name={name} color={color} {...otherProps} />
          )}
          {type === 'FontAwesome' && (
            <FontAwesome
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === 'FontAwesome5' && (
            <FontAwesome5
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === 'Fontisto' && (
            <Fontisto size={size * backgroundSizeRatio} name={name} color={color} {...otherProps} />
          )}
          {type === 'Foundation' && (
            <Foundation
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === 'MaterialIcons' && (
            <MaterialIcons
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === 'Octicons' && (
            <Octicons size={size * backgroundSizeRatio} name={name} color={color} {...otherProps} />
          )}
          {type === 'SimpleLineIcons' && (
            <SimpleLineIcons
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === 'Zocial' && (
            <Zocial size={size * backgroundSizeRatio} name={name} color={color} {...otherProps} />
          )}
          {type === 'Ionicons' && (
            <Ionicons size={size * backgroundSizeRatio} name={name} color={color} {...otherProps} />
          )}
        </>
      );
  };
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: noBackground ? null : backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      {renderImageOrIcon()}
    </View>
  );
}
