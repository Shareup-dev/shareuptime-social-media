import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import colors from '../../config/colors';

interface HeaderTitleProps {
  children: React.ReactNode;
  titleStyle?: TextStyle;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({
  children,
  titleStyle,
  numberOfLines = 1,
  ellipsizeMode = 'tail',
}) => {
  return (
    <Text
      style={[styles.title, titleStyle]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
  },
});

export default HeaderTitle;
