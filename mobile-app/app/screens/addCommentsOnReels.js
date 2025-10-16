import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HeaderWithBackArrow } from '../components/headers';

export default function AddCommentsOnReels({ navigation }) {
  return (
    <View style={styles.container}>
      <HeaderWithBackArrow
        title={'Comments'}
        titleStyle={{ fontSize: 19 }}
        onBackButton={(_) => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
