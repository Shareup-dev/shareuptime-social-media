import React from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import Screen from "../components/Screen";
import ListItem from "../components/lists/ListItem";
import defaultStyles from "../config/GlobalStyles";
import Icon from "../components/Icon";
import { Header, HeaderTitle, HeaderCloseIcon } from "../components/headers";
import colors from "../config/colors";



export default function SettingPrivacy({ navigation }) {

  
  const SettingValue = [
    {
        title: 'Help Center',
        icon: {
          name:"md-help-circle-outline",
          type:"Ionicons",
        },
        onPress: () => {
          //alert("savedPost")
         },
      },
      {
        title: 'Support Inbox',
        icon: {
          name:"inbox",
          type:"Entypo",
        },
        onPress: () => {
          //alert("savedPost")
         },
      },
      {
        title: 'Report a Problem',
        icon: {
          name:"report-problem",
          type:"MaterialIcons",
        },
        onPress: () => {
          //alert("savedPost")
         },
      },
      {
        title: 'Terms & Policies',
        icon: {
          name:"address-book",
          type:"FontAwesome5",
        },
        onPress: () => {
          //alert("savedPost")
         },
      },
    
  ];
    return (
      <Screen style={styles.container}>
      <Header
        left={<HeaderCloseIcon onPress={() => navigation.goBack()} />}
        middle={
          <HeaderTitle titleStyle={styles.headerTitle}>
            Help & Support
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