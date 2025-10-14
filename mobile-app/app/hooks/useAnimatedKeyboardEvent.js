import React, { useEffect } from "react";
import { Animated, Keyboard, Platform, PixelRatio } from "react-native";

const DURATION_TIME = 200;

export default function useAnimatedKeyboardEvent(initialValue, finalValue) {
  let currentValue = new Animated.Value(initialValue);

  useEffect(() => {
    const keyboardWillShowSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      keyboardWillShow
    );
    const keyboardWillHideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      keyboardWillHide
    );
    return () => {
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, [currentValue]);

  const keyboardWillShow = (event) => {
    PixelRatio.get() < 2.5
      ? Animated.timing(currentValue, {
          duration: DURATION_TIME,
          toValue: finalValue,
          useNativeDriver: false,
        }).start()
      : null;
  };

  const keyboardWillHide = (event) => {
    PixelRatio.get() < 2.5
      ? Animated.timing(currentValue, {
          duration: DURATION_TIME,
          toValue: initialValue,
          useNativeDriver: false,
        }).start()
      : null;
  };

  return { currentValue };
}
