import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default React.memo(function EmptyPostCard({ count = 3 }) {
  const array = Array(count).fill(0, 0, count);
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) fadeOut();
    });
  }, [fadeAnim, fadeOut]);

  const fadeOut = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0.4,
      useNativeDriver: true,
      duration: 800,
    }).start(({ finished }) => {
      if (finished) fadeIn();
    });
  }, [fadeAnim, fadeIn]);

  useEffect(() => {
    fadeIn();
  }, [fadeIn]);

  return (
    <View style={styles.container}>
      {array.map((ele, i) => (
        <View key={i} style={[styles.card]}>
          <Animated.View style={[styles.img, { opacity: fadeAnim }]} />
          <View style={styles.bottomCard}>
            <View style={styles.profileContainer}>
              <Animated.View style={[styles.profile, { opacity: fadeAnim }]} />
              <View>
                <Animated.View style={[styles.name, styles.nameSmall, { opacity: fadeAnim }]} />
                <Animated.View style={[styles.name, styles.nameXSmall, { opacity: fadeAnim }]} />
              </View>
            </View>
            <View style={styles.row}>
              <Animated.View style={[styles.name, styles.nameTiny, { opacity: fadeAnim }]} />
              <Animated.View style={[styles.name, styles.nameXXSmall, { opacity: fadeAnim }]} />
            </View>
            <View style={styles.row}>
              <Animated.View style={[styles.name, styles.nameWide, { opacity: fadeAnim }]} />
              <Animated.View style={[styles.name, styles.nameNarrow, { opacity: fadeAnim }]} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: '#cacaca80',
    marginVertical: 5,
  },
  nameSmall: { height: 15, width: 80 },
  nameXSmall: { height: 10, width: 110 },
  nameTiny: { height: 12, width: 40 },
  nameXXSmall: { height: 10, width: 100 },
  nameWide: { height: 10, width: 120 },
  nameNarrow: { height: 10, width: 30 },
  time: {},
  bottomCard: {
    height: 120,
  },
  profileContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 10,
  },
  profile: {
    height: 55,
    width: 55,

    borderRadius: 15,
    backgroundColor: '#cacaca80',
  },
  img: {
    height: 250,
    backgroundColor: '#cacaca80',
  },
  card: {
    backgroundColor: '#cacaca50',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
