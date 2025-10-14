import React from "react";
import { View, StyleSheet, Image, Text, Dimensions } from "react-native";

import colors from "../../config/colors";
import defaultStyle from "../../config/styles";
import Icon from "../Icon";

const width = Dimensions.get("window").width / 2 - 15;
const height = Dimensions.get("window").height / 3;

export default function LongCard({
  style,
  image,
  title,
  subTitle,
  navigation,
}) {

  return (
    <View style={[styles.container, style]}>
      <Image
        source={
          image
            ? { uri: image }
            : require("../../assets/images/group-texture.png")
        }
        style={styles.image}
      />
      <View style={[styles.titlesContainer]}>
        <Text style={[styles.title]}>{title}</Text>
        {subTitle && (
          <View style={styles.privacyBadge}>
            <Icon
              backgroundColor={colors.lighterGray}           
              size={30}
              type={subTitle === "Public" ? "Entypo" : "Ionicons"}
              name={subTitle === "Public" ? "globe" : "lock-closed"}
            />
            <Text style={[styles.subTitle]}>{subTitle}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: colors.lighterGray,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.lighterGray,
    overflow: "hidden",
  },
  image: {
    width: width - 3,
    height: height - 50,
    resizeMode: "cover",
  },
  titlesContainer: {
    zIndex: 1,
    bottom: 1,
    margin: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    height: "auto",
  },
  title: {
    color: colors.dark,
    fontWeight: "bold",
    fontSize: 18,
    marginTop: -3,
    width: 110,
  },
  subTitle: {
    color: colors.dark,
    marginTop: 5,
  },
  privacyBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginTop: 10,
    flexDirection: "row",
  },
});
