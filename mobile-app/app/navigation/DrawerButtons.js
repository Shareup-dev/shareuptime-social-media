import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Icon from "../components/Icon";
import colors from "../config/colors";
import defaultStyles from "../config/styles";

export default function DrawerButtons({ iconImage, title }) {
  return (
    <View style={[styles.container, defaultStyles.lightShadow]}>
      <Icon image={iconImage} backgroundSizeRatio={1} size={23} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.white,
    width: 120,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 5,
    margin: 5,
    marginBottom: 10,
    paddingLeft: 5,
  },
  title: {
    marginLeft: 5,
    fontSize: 12,
  },
});
