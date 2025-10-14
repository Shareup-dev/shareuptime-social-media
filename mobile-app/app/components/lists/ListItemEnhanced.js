import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

import colors from "../../config/colors";
import AppText from "../Text";
import Icon from "../Icon";
import defaultStyle from "../../config/styles";
import IconButton from "../buttons/IconButton";

export default function ListItemEnhanced({
  title,
  subTitle,
  subSubTitle,
  image,
  IconComponent,
  onPress,
  style,
}) {
  return (
    <>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styles.listItem, defaultStyle.lightShadow, style]}>
          {IconComponent}
          {image && <Image source={image} style={styles.image} />}
          <View style={styles.detailsContainer}>
            <AppText numberOfLines={1} style={styles.title}>
              {title}
            </AppText>
            {subTitle && (
              <AppText numberOfLines={2} style={styles.subTitle}>
                {subTitle}
              </AppText>
            )}
            {subSubTitle && (
              <AppText numberOfLines={2} style={styles.subSubTitle}>
                {subSubTitle}
              </AppText>
            )}
          </View>

          <View style={styles.leftContainer}>
            <IconButton
              onPress={() => alert("Item Added")}
              IconComponent={
                <Icon
                  name="plussquare"
                  type="AntDesign"
                  backgroundSizeRatio={0.5}
                  color={colors.iondigoDye}
                />
              }
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,

    backgroundColor: colors.white,
    margin: 2,
    marginVertical: 3,
    borderRadius: 10,
  },
  detailsContainer: { marginLeft: 10, flex: 1 },
  image: { height: 60, width: 75, borderRadius: 10 },
  title: {
    fontSize: 15,
    color: colors.dark,
    fontWeight: "500",
  },
  subTitle: { fontSize: 12, color: colors.dimGray },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  subSubTitle: {
    fontSize: 12,
    color: colors.dark,
  },
  tab: {
    borderRadius: 7,
    paddingHorizontal: 5,
    marginRight: 6,
  },
});
