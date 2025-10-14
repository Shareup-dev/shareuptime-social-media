import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";

import colors from "../../config/colors";
import routes from "../../navigation/routes";
import Icon from "../Icon";

export default function CreateStoryCard({ navigation, style }) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(routes.ADDS_STORY);
      }}
    >
      <View style={[styles.container, style]}>
        <View style={styles.profileImgContainer}>
          <Image
            source={require("../../assets/icons/user-icon.png")}
            resizeMode={"contain"}
            style={styles.profileImg}
          />
        </View>

        <View style={{ alignItems: "center" }}>
          <Icon
            name="pluscircle"
            type="AntDesign"
            size={25}
            color={colors.iondigoDye}
            backgroundSizeRatio={0.75}
            style={styles.addIcon}
          />
          <Text style={styles.createStory}> Create</Text>
          <Text style={styles.createStory}>Story</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 150,
    borderWidth: 1.5,
    borderColor: colors.lighterGray,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  profileImgContainer: { backgroundColor: colors.grayX11Gray, height: 100 },
  profileImg: {
    margin: "25%",
    height: "50%",
    width: "50%",
    backgroundColor: colors.grayX11Gray,
  },
  addIcon: {
    top: -10,
  },
  createStory: {
    fontSize: 10,
    textAlign: "center",
    top: -10,
  },
});
