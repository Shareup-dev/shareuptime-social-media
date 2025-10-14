import React from "react";
import { View, StyleSheet, Text } from "react-native";

import defaultStyles from "../config/styles";
import LinkButton from "./buttons/LinkButton";

export default function Section({ title, children, onAdd }) {
  return (
    <View style={styles.container}>
      <View style={styles.subHeader}>
        <Text style={[styles.title, defaultStyles.fontWeightMedium]}>
          {title}
        </Text>

        <LinkButton title="Add"  onPress={onAdd} />
      </View>
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
  },
});
