import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

export default React.memo(function EmptyStoryCard({ count = 3 }) {
  const array = Array(count).fill(0, 0, count);
  const fadeAnim = useRef(new Animated.Value(0.4)).current;

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0.6,
      duration: 600,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) fadeOut();
    });
  }, [fadeAnim, fadeOut]);

  const fadeOut = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0.4,
      useNativeDriver: true,
      duration: 600,
    }).start(({ finished }) => {
      if (finished) fadeIn();
    });
  }, [fadeAnim, fadeIn]);

  useEffect(() => {
    fadeIn();
  }, [fadeIn]);

  return (
    <View style={styles.row}>
      {array.map((ele, i) => (
        <Animated.View key={i} style={[styles.card, { opacity: fadeAnim }]} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  card: {
    width: 100,
    height: 150,
    borderRadius: 15,
    marginLeft: 2,
    overflow: 'hidden',
    backgroundColor: '#cacaca',
  },
});
