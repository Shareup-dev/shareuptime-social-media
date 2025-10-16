import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import EmojiTab from './EmojiTab';
import colors from '../../config/colors';

const emojisList = [
  {
    id: 1,
    emoji: '😀',
  },
  {
    id: 2,
    emoji: '😂',
  },
  {
    id: 3,
    emoji: '🥰',
  },
  {
    id: 4,
    emoji: '😍',
  },
  {
    id: 5,
    emoji: '🤩',
  },
  {
    id: 6,
    emoji: '😜',
  },
  {
    id: 7,
    emoji: '😢',
  },
  {
    id: 8,
    emoji: '😤',
  },
  {
    id: 9,
    emoji: '😣',
  },
  {
    id: 10,
    emoji: '😡',
  },
];

export default function EmojiesBar(props) {
  return (
    <View style={styles.container}>
      <FlatList
        // contentContainerStyle={styles.container}
        horizontal
        data={emojisList}
        keyExtractor={(emoji) => emoji.id.toString()}
        renderItem={({ item }) => <EmojiTab emoji={item.emoji} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 45,
    backgroundColor: colors.lighterGray,
  },
});
