import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colors from '../../config/colors';

export default function EmojiTab({ emoji }) {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 65,
    height: 30,
    backgroundColor: colors.mediumGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginHorizontal: 5,
  },
  emoji: {
    fontSize: 25,
  },
});
