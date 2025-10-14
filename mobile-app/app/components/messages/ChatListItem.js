import React from "react";
import { View, StyleSheet, Text } from "react-native";

import UserProfilePicture from "../UserProfilePicture";
import defaultStyles from "../../config/styles";
import { TouchableHighlight } from "react-native-gesture-handler";
import colors from "../../config/colors";
import Icon from "../Icon";
import routes from "../../navigation/routes";

export default function ChatListItem({
  title = "",
  profilePicture = "",
  lastMessage = "",
  lastMessageTime = "",
  numberOfUnreadMessages = "",
  lastMessageStatus = "",
  isActive = "",
  onPress,
}) {
  return (
    <TouchableHighlight onPress={onPress} underlayColor={colors.lighterGray}>
      <View style={styles.container}>
        {/**Left */}

        <UserProfilePicture
          profilePicture={profilePicture}
          size={50}
          style={styles.profilePicture}
          showActiveStatus={true}
          rightOffsite={5}
        />

        {/** Middle */}
        <View style={styles.middle}>
          <Text
            numberOfLines={1}
            style={[
              defaultStyles.listItemTitle,
              defaultStyles.fontWeightMedium,
            ]}
          >
            {title}
          </Text>

          <Text
            numberOfLines={2}
            style={[
              defaultStyles.listItemSubTitle,
              defaultStyles.fontWeightMedium,
            ]}
          >
            {lastMessage}
          </Text>
        </View>
        {/** Right */}
        <View style={styles.right}>
          {/* <View style={styles.dot} /> */}
          <Text style={styles.time}>{lastMessageTime}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: "center",
  },
  middle: {
    flexDirection: "column",
    width: "70%",
  },
  right: {
    alignSelf: "flex-start",
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  profilePicture: {
    marginRight: 10,
  },
  time: {
    fontSize: 11,
    color: colors.dimGray,
  },
  dot: {
    width: 5,
    height: 5,
    backgroundColor: colors.LightGray,
    borderRadius: 100,
    justifyContent: "center",
    marginHorizontal: 5,
  },
});
