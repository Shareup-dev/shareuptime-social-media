import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';

import Text from '../Text';
import defaultStyles from '../../config/styles';
import colors from '../../config/colors';

interface ListHeaderProps {
  title?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

const ListHeader: React.FC<ListHeaderProps> = ({
  title,
  subtitle,
  align = 'center',
  containerStyle,
  titleStyle,
  subtitleStyle,
}) => {
  const alignmentStyle = {
    alignItems: align as 'flex-start' | 'center' | 'flex-end',
  };

  return (
    <View style={[styles.container, alignmentStyle, containerStyle]}>
      {title && (
        <Text style={[styles.title, defaultStyles.titleFontSize, titleStyle]}>{title}</Text>
      )}
      {subtitle && (
        <Text style={[styles.subtitle, defaultStyles.fontWeightMedium, subtitleStyle]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 5,
    color: colors.dark,
  },
  subtitle: {
    fontSize: 15,
    color: colors.mediumGray,
  },
  container: {
    justifyContent: 'center',
    marginVertical: 20,
  },
});

export default ListHeader;
