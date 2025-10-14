import React from "react";
import { View, StyleSheet, Text } from "react-native";

import colors from "../../config/colors";
import DownModal from "./DownModal";
import DrawerList from "./DrawerList";
import defaultStyle from "../../config/styles";

export default function OptionsDrawer({
  options,
  isVisible,
  setIsVisible,
  title,
}) {
  return (
    <DownModal isVisible={isVisible} setIsVisible={setIsVisible}>
      <View style={defaultStyle.tip} />
      {title && <Text style={styles.title}>{title}</Text>}
      <DrawerList options={options} />
    </DownModal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    marginTop: 23,
    marginBottom: 10,
    marginLeft: 60,
  },
});
