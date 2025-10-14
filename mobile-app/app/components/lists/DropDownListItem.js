import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";

import colors from "../../config/colors";
import AppText from "../Text";
import Icon from "../Icon";
import defaultStyle from "../../config/styles";
import IconButton from "../buttons/IconButton";
import ListItemEnhanced from "./ListItemEnhanced";

export default function DropDownListItem({
  title,
  subTitle,
  subSubTitle,
  image,
  dropListItems,
  IconComponent,
  onPress,
  style,
}) {
  const [isDropDown, setIsDropDown] = useState(false);

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
            {isDropDown ? (
              <IconButton
                onPress={() => setIsDropDown(!isDropDown)}
                IconComponent={
                  <Icon
                    name="caretdown"
                    type="AntDesign"
                    backgroundSizeRatio={0.3}
                  />
                }
              />
            ) : (
              <IconButton
                onPress={() => setIsDropDown(!isDropDown)}
                IconComponent={
                  <Icon
                    name="caretright"
                    type="AntDesign"
                    backgroundSizeRatio={0.3}
                  />
                }
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>

      {isDropDown && (
        <FlatList
          style={styles.dropDownList}
          data={dropListItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListItemEnhanced
              title={item.title}
              subTitle={item.state}
              subSubTitle={item.price}
              image={item.image}
            />
          )}
        />
      )}
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
  image: { height: 60, width: 60 },
  title: {
    fontSize: 18,
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
  dropDownList: {
    marginBottom: 25,
  },
});
