import React from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import Screen from "../components/Screen";
import ListItem from "../components/lists/ListItem";
import defaultStyles from "../config/styles";
import Icon from "../components/Icon";
import { Header, HeaderTitle, HeaderCloseIcon } from "../components/headers";
import colors from "../config/colors";



export default function SettingPrivacy({ navigation }) {

  
  const SettingValue = [
    {
      title: "Settings",
      icon: { image: require("../assets/icons/gray-feed-icon.png") },
      onPress: () => {
        
      },
    },
    {
      title: "Device Request",
      icon: { image: require("../assets/icons/gray-share-time-icon.png") },
      onPress: () => {
      },
    },
    {
      title: "Recent ad activity",
      icon: { image: require("../assets/icons/gray-share-friends-icon.png") },
      onPress: () => {
      },
    },
    {
      title: "Find Wi-Fi",
      icon: { image: require("../assets/icons/gray-share-point-icon.png") },
      onPress: () => {

      },
    },
    
  ];
    return (
      <Screen style={styles.container}>
      <Header
        left={<HeaderCloseIcon onPress={() => navigation.goBack()} />}
        middle={
          <HeaderTitle titleStyle={styles.headerTitle}>
            Setting & Privacy
          </HeaderTitle>
        }
       
        backgroundColor={colors.lighterGray}
        headerContainerStyle={styles.header}
      />
      
    
      <View style={styles.content}>
      <FlatList
        contentContainerStyle={styles.groupsList}
        data={SettingValue}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <ListItem
          style={[styles.listItem, defaultStyles.lightShadow]}
            title={item.title}
            onPress={item.onPress}
            IconComponent={
              <Icon
                name={item.icon.name}
                type={item.icon.type}
                image={item.icon.image}
                color={colors.dimGray}
                backgroundSizeRatio={0.6}
              />
            }
          />
        )}
        />
        </View>

        
        </Screen>
     
      );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: Platform.OS == "ios" ? "500" : "bold",
  },
  leftAndRight: {
    marginBottom: 2,
  },
  content: {
    flex: 1,
  },
  textField: {
    alignSelf: "center",
  },
  linkButtons: {
    margin: 10,
  },
  userProfilePicture: {
    alignSelf: "center",
  },
  groupsList: { paddingTop: 20 },
  listItem: {
    marginBottom: 13,
    marginHorizontal: 28,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
});