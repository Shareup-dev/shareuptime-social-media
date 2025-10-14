import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../../config/colors";
import IconTab from "./IconTab";

/**
 *
 * maps a list of icons
 *
 * tabes should be object contain the fallowing
 * {
 *  name,
 *  icon : {name, type} || { image },
 * }
 */
export default function IconBar({ tabs, onTab, currentTab }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <IconTab
          key={tab.name}
          icon={tab.icon}
          tabbed={currentTab === tab.name ? true : false}
          showSeparator={index < tabs.length - 1}
          onPress={() => {
            onTab(tab.name);
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.lighterGray,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
});
