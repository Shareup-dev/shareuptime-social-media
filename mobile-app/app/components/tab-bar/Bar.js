import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import Tab from "./Tab";

export default function Bar({
  tabes,
  onTab,
  currentTab,
  activeUnderLineColor,
  fontSize,
  underLineWidth,
  underLineHight,
}) {
  return (
    <View style={styles.container}>
      {tabes.map((tab) => (
        <Tab
          key={tab.name}
          text={tab.name}
          tabbed={currentTab === tab.name ? true : false}
          onPress={() => onTab(tab.name)}
          activeUnderLineColor={activeUnderLineColor}
          fontSize={fontSize}
          underLineWidth={underLineWidth}
          underLineHight={underLineHight}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
