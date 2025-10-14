import React from 'react';
import {StyleSheet, Text} from 'react-native';
import AppCamera from '../components/Camera';
import Screen from '../components/Screen';

export default function TestScreen(props) {
  return (
    <Screen statusPadding={false}>
      <AppCamera />
      {/* <Text>test screen</Text> */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});
