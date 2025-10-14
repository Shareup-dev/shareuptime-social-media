import { Dimensions, Image, StyleSheet, Platform } from "react-native";

import React from "react";

const renderImage = (mainLogo, style) => {
  if (mainLogo == true)
    return (
      <Image
        style={[styles.logo, style]}
        source={require("../assets/logo.png")}
      />
    );
  else
    return (
      <Image
        style={[styles.secondaryLogo, style]}
        source={require("../assets/main-logo.png")}
      />
    );
};

export default function Logo({ mainLogo, style }) {
  return renderImage(mainLogo, style);
}

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height:
      Dimensions.get("window").height < 800
        ? Dimensions.get("window").height * 0.25
        : Dimensions.get("window").height * 0.35,
    alignSelf: "center",
    marginBottom: 20,

    // resizeMode: "stretch",
  },
  secondaryLogo: {
    width: 62,
    height: 62,
    resizeMode: "contain",
  },
});
