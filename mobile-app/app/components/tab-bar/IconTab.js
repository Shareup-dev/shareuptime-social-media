import React from "react";
import { StyleSheet, View } from "react-native";

import colors from "../../config/colors";
import TabButton from "../buttons/Tab";

export default function IconTab({ icon, onPress, tabbed, showSeparator }) {
  return (
    <>
      <TabButton
        //   iconSize={25}
        iconImage={icon.image}
        iconName={icon.name}
        iconType={icon.type}
        color="transparent"
        style={[styles.tabButton, tabbed ? styles.active : styles.inactive]}
        onPress={onPress}
      />

      {showSeparator && <View style={styles.separator} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  active: {
    backgroundColor: colors.LightGray,
  },
  inactive: {
    backgroundColor: "transparent",
  },

  underLine: {
    width: 35,
    height: 4,
    backgroundColor: "#4485F2",
    alignSelf: "center",
    borderRadius: 15,
    marginTop: 3,
  },

  tabButton: {
    height: 25,
    width: 70,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  separator: {
    height: "90%",
    width: 2,
    backgroundColor: colors.dark,
  },
});
