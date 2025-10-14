import React from "react";
import { View, Text, StyleSheet } from "react-native";

import colors from "../config/colors";

export default function Separator({ text, style, color = colors.lighterGray }) {
  const inside = () => {
    if (text)
      return (
        <View>
          <Text style={styles.text}>{text}</Text>
        </View>
      );
    else return <View></View>;
  };

  return (
    <View style={[styles.outer, style]}>
      <View style={[styles.inner, { backgroundColor: color }]} />
      {inside()}
      <View style={[styles.inner, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    width: 50,
    textAlign: "center",
    color: colors.dimGray,
  },
  outer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inner: {
    flex: 1,
    height: 1,
    backgroundColor: colors.grayX11Gray,
  },
});
