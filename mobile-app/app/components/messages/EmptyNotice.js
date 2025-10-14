import React from "react";
import { View, StyleSheet, Text } from "react-native";

import colors from "../../config/colors";
import routes from "../../navigation/routes";
import Tab from "../buttons/Tab";

export default function EmptyNotice({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.bold}>Add Friends and message them directly</Text>
      <Text style={styles.smallGray}>
        Send private messages or share your Favorite posts directly with friends
      </Text>

      <View>
        <Tab
          title="Add Friends"
          style={styles.addFriendsButton}
          width={150}
          titleStyle={styles.buttonTitle}
          onPress={() => navigation.navigate(routes.Add_NEW_FRIEND)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  bold: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  smallGray: {
    marginTop: 10,
    width: "60%",
    fontSize: 12,
    color: colors.mediumGray,
    alignSelf: "center",
    textAlign: "center",
  },
  addFriendsButton: {
    backgroundColor: colors.lighterGray,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 25,
  },
  buttonTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
});
