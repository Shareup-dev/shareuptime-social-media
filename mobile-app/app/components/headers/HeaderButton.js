import React from "react";
import { View, StyleSheet } from "react-native";

import Button from "../buttons/LinkButton";
import colors from "../../config/colors";

export default function HeaderButton({
  title,
  onPress,
  isActive = false,
  style,
}) {
  return isActive ? (
    <Button
      title={title}
      onPress={onPress}
      style={[styles.activeButton, style]}
    />
  ) : (
    <Button title={title} style={[styles.inactiveButton, style]} />
  );
}

const styles = StyleSheet.create({
  activeButton: { color: colors.iondigoDye },
  inactiveButton: { color: colors.dimGray },
});
