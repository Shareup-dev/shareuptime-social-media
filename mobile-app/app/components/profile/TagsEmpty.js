import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../../config/colors";
import Icon from "../Icon";
///assets/icons/circled-tag-icon.png
export default function TagsEmpty({ navigation }) {
  return (
    <View style={styles.container}>
      <Icon
        image={require("../../assets/icons/circled-tag-icon.png")}
        size={90}
        backgroundSizeRatio={1}
      />
      <Text style={styles.text1}>Photos and videos of you</Text>
      <Text style={styles.text2}>
        When people tag you in photo or videos, they will appear here
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  text1: {
    marginTop: 5,
    fontSize: 17,
  },
  text2: {
    marginTop: 10,
    width: "70%",
    textAlign: "center",
    fontSize: 12,
    color: colors.mediumGray,
  },
});
