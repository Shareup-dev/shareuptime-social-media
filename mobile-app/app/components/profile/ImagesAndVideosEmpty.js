import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '../../config/colors';
import LinkButton from '../buttons/LinkButton';

export default function ImagesAndVideosEmpty({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Start Sharing your Photo and Videos!</Text>
      <Text style={styles.text2}>
        When you share your photos and videos, they'll appear in you profile
      </Text>
      {/* <Text style={styles.text3}>Share your first photo or video</Text> */}

      <LinkButton title="Share your first photo or video" fontSize={15} style={styles.linkButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  text1: {
    fontSize: 17,
  },
  text2: {
    marginTop: 20,
    fontSize: 13,
    color: colors.mediumGray,
    width: '70%',
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 30,
  },
});
