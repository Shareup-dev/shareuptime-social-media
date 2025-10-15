import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

export default React.memo(function EmptyPostCard({count = 3}) {
  const array = Array(count).fill(0, 0, count);
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) fadeOut();
    });
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.4,
      useNativeDriver: true,
      duration: 800,
    }).start(({finished}) => {
      if (finished) fadeIn();
    });
  };

  useEffect(() => {
    fadeIn();
  }, []);

  return (
    <View style={styles.container}>
      {array.map((ele, i) => (
        <View key={i} View style={[styles.card]}>
          <Animated.View style={[styles.img, {opacity: fadeAnim}]} />
          <View style={styles.bottomCard}>
            <View style={styles.profileContainer}>
              <Animated.View style={[styles.profile, {opacity: fadeAnim}]} />
              <View>
                <Animated.View
                  style={[
                    styles.name,
                    {height: 15, opacity: fadeAnim, width: 80},
                  ]}
                />
                <Animated.View
                  style={[
                    styles.name,
                    {height: 10, opacity: fadeAnim, width: 110},
                  ]}
                />
              </View>
            </View>
            <View style={styles.row}>
              <Animated.View
                style={[
                  styles.name,
                  {height: 12, opacity: fadeAnim, width: 40},
                ]}
              />
              <Animated.View
                style={[
                  styles.name,
                  {height: 10, opacity: fadeAnim, width: 100},
                ]}
              />
            </View>
            <View style={styles.row}>
              <Animated.View
                style={[
                  styles.name,
                  {height: 10, opacity: fadeAnim, width: 120},
                ]}
              />
              <Animated.View
                style={[
                  styles.name,
                  {height: 10, opacity: fadeAnim, width: 30},
                ]}
              />
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
