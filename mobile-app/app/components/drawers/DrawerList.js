import React from "react";
import { StyleSheet, FlatList } from "react-native";

import ListItem from "../lists/ListItem";
import Icon from "../Icon";
import colors from "../../config/colors";

/**
 *  This component to render a list of of options targeting the drawer components
 */

export default function DrawerList({ options }) {
  return (
    <FlatList
      data={options}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        item.title !== "" ?
        <ListItem
          style={styles.listItem}
          title={item.title}
          onPress={item.onPress}
          isBottomSheet={true}
          IconComponent={
            <Icon
              name={item.icon.name}
              type={item.icon.type}
              image={item.icon.image}
              color={colors.linearColorful}
              backgroundSizeRatio={0.6}
            />
          }
        /> : <></>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listItem: {
    paddingVertical: 5,
  },
});
