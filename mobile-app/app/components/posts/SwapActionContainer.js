import React from "react";
import { View, StyleSheet, Text } from "react-native";

import colors from "../../config/colors";
import defaultStyles from "../../config/styles";
import Tab from "../buttons/Tab";

export default function SwapActionContainer(props) {
  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        <Text style={[styles.title, defaultStyles.fontWeightMedium]}>
          Category
        </Text>
        <Text style={styles.description}>lapTop</Text>
      </View>

      <Tab
        title="Swap"
        color={colors.iondigoDye}
        fontColor={colors.white}
        width={80}
        style={styles.swapTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lighterGray,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  description: {
    fontSize: 12,
    color: colors.dimGray,
  },
  title: {
    fontSize: 16,
  },
  swapTab: {
    borderRadius: 8,
  },
});
