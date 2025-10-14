import React from "react";
import { View, StyleSheet, Text } from "react-native";

// import Text from "../Text";

export default function ErrorMessage({ error, visible }) {
  if (!visible || !error) return null;

  return (
    <View>
      <Text style={styles.error}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  error: { color: "red", fontSize: 13 },
});
