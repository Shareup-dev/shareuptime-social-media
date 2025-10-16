import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

export default function useKeyboardHight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const keyboardWillShow = (event) => {
    setKeyboardHeight(event.endCoordinates.height);
  };

  const keyboardWillHide = () => {
    setKeyboardHeight(0);
  };

  useEffect(() => {
    const keyboardWillShowSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      keyboardWillShow,
    );
    const keyboardWillHideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      keyboardWillHide,
    );
    return () => {
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, [keyboardHeight]);

  return { keyboardHeight };
}
