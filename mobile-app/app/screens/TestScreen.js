import React from 'react';
import AppCamera from '../components/Camera';
import Screen from '../components/Screen';

export default function TestScreen() {
  return (
    <Screen statusPadding={false}>
      <AppCamera />
      {/* <Text>test screen</Text> */}
    </Screen>
  );
}

// styles not used; kept intentionally minimal to avoid UI changes
