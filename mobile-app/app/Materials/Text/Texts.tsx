import React, { useState } from 'react';
import {
  ColorValue,
  Text,
  TextStyle,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from 'react-native';
import type { StyleProp, TextProps } from 'react-native';

type Props = TextProps & {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  size?: number;
  color?: ColorValue;
  light?: boolean;
  truncate?: boolean;
  lines?: number;
  opacity?: number;
};

const Texts: React.FC<Props> = ({
  children,
  style,
  size = 12,
  light = false,
  color = '#333',
  truncate = false,
  lines = 2,
  opacity = 1,
  ...rest
}) => {
  const [isTruncatedText, setIsTruncatedText] = useState<boolean>(false);
  const [textCollapse, setTextCollapse] = useState<boolean>(false);
  const [numberOfLines, setNumberOfLines] = useState<number | undefined>(lines);

  const checkNumOfLines = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines: layoutLines } = event.nativeEvent;
    setIsTruncatedText((layoutLines?.length ?? 0) > (numberOfLines ?? 0));
  };

  const toggleBtnHandler = () => {
    setTextCollapse((prev) => !prev);
    setNumberOfLines((prev) => (prev ? undefined : lines));
  };

  const styles = StyleSheet.create({
    text: {
      fontSize: size,
      color: light ? '#33333399' : color,
      opacity: opacity,
    },
  });

  if (truncate) {
    return (
      <>
        <Text
          ellipsizeMode="tail"
          allowFontScaling={true}
          onTextLayout={checkNumOfLines}
          numberOfLines={numberOfLines}
          {...rest}
          style={[style, styles.text]}
        >
          {children}
        </Text>
        {isTruncatedText && children !== '' && (
          <TouchableOpacity style={{ paddingVertical: 5 }} onPress={toggleBtnHandler}>
            <Text
              style={{ fontSize: 12, color: color }}
              allowFontScaling={false}
              numberOfLines={numberOfLines}
            >
              {textCollapse ? `Show Less..` : `Show more..`}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  } else {
    return (
      <Text {...rest} style={[style, styles.text]}>
        {children}
      </Text>
    );
  }
};

export default Texts;
