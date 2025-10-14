import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import LinkButton from "./buttons/LinkButton";
import UserProfilePicture from "./UserProfilePicture";
import Tab from "./buttons/Tab";

import routes from "../navigation/routes";
import constants from "../config/constants";
import colors from "../config/colors";

const { postTypes } = constants;

export default function WritePost({ navigation, style, groupPost, groupId }) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(routes.ADD_POST, {
            postType: postTypes.CREATE_POST,
            groupPost,
            groupId,
          })
        }
      >
        <View style={styles.writePostContainer}>
          <UserProfilePicture size={45} />
          <LinkButton
            title="We share, Do you? "
            fontSize={12}
            style={styles.shareButton}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.writePostTabsWrapper}>
        <Tab
          title="Hang Share"
          color={colors.white}
          iconImage={require("../assets/icons/hangshare-icon.png")}
          iconSize={20}
          width="30%"
          titleStyle={styles.tabsTitle}
          sizeRatio={0.95}
          onPress={() =>
            navigation.navigate(routes.ADD_POST, {
              postType: postTypes.HANG_SHARE,
            })
          }
        />
        <View style={styles.verticalLine} />
        <Tab
          title="Share Up"
          color={colors.white}
          iconImage={require("../assets/icons/share-2-icon.png")}
          iconSize={20}
          width="30%"
          titleStyle={styles.tabsTitle}
          sizeRatio={0.95}
          onPress={() =>
            navigation.navigate(routes.ADD_POST, {
              postType: postTypes.SHARE_UP,
            })
          }
        />
        <View style={styles.verticalLine} />
        <Tab
          title="Swap"
          color={colors.white}
          width="30%"
          iconImage={require("../assets/icons/swap-icon.png")}
          iconSize={15}
          titleStyle={styles.tabsTitle}
          sizeRatio={0.95}
          onPress={() => navigation.navigate(routes.SWAP)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: colors.white,
  },
  writePostContainer: {
    padding: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.LightGray,
    alignItems: "center",
    backgroundColor: colors.white,
    marginBottom: 1,
  },
  shareButton: {
    color: colors.mediumGray,
    marginLeft: 10,
  },
  writePostTabsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1.5,
    borderColor: colors.LightGray,
    backgroundColor: colors.white,
  },
  verticalLine: {
    height: 25,
    width: 1.5,
    backgroundColor: colors.LightGray,
  },
  tabsTitle: {
    fontWeight: "500",
  },
});
