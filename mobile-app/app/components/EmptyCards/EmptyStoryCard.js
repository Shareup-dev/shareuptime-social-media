import React, {useEffect, useRef} from 'react';
import {Animated, View} from 'react-native';

export default React.memo(function EmptyStoryCard({count = 3}) {
  const array = Array(count).fill(0, 0, count);
  const fadeAnim = useRef(new Animated.Value(0.4)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.6,
      duration: 600,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) fadeOut();
    });
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.4,
      useNativeDriver: true,
      duration: 600,
    }).start(({finished}) => {
      if (finished) fadeIn();
    });
  };

  useEffect(() => {
    fadeIn();
  }, []);

  return (
    <View style={{flexDirection: 'row'}}>
      {array.map((ele, i) => (
        <Animated.View
          key={i}
          style={{
            opacity: fadeAnim,
            width: 100,
            height: 150,
            borderRadius: 15,
            marginLeft: 2,
            overflow: 'hidden',
            backgroundColor: '#cacaca',
          }}
        />
      ))}
    </View>
  );
});
