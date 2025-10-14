import React from "react";
import { StyleSheet, Text } from "react-native";

export default function HeaderTitle({ children, titleStyle }) {
  return <Text style={[styles.title, titleStyle]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    right: "20%",
  },
});
