import React from "react";
import { StyleSheet, View, FlatList, Image, SafeAreaView, SectionList } from "react-native";
import Screen from "../components/Screen";
import { Text } from "react-native-paper";
import ListItem from "../components/lists/ListItem";
import defaultStyles from "../config/GlobalStyles";
import Icon from "../components/Icon";
import { Header, HeaderTitle, HeaderCloseIcon } from "../components/headers";
import colors from "../config/colors";
import { Title } from "react-native-paper";
import routes from "../navigation/routes";



export default function AccountSettingsScreen({ navigation }) {

    const Options = [
        {
            header: "Account",
            subTitle: "Update your info to keep your account secure",
            data: [
                {
                    title: 'Name and contact information',
                    icon: {
                        
                        name: "account",
                        type: "MaterialCommunityIcons",
                    },
                    onPress: () => {
                            navigation.navigate(routes.PERSONAL_INFORMATION)
                    },
                },
                {
                    title: 'Password',
                    icon: {
                        name: "shield-lock",
                        type: "Octicons",
                    },
                    onPress: () => {
                        navigation.navigate(routes.UPDATE_PASSWORD)
                    },
                },
                {
                    title: 'Notifications',
                    icon: {
                        name: "md-notifications-outline",
                        type: "Ionicons",
                    },
                    onPress: () => {
                        //alert("savedPost")
                    },
                }]
        }, {
            header: "Preferences",
            subTitle: "Customise your preferences",
            data: [
                {
                    title: 'News Feed',
                    icon: {
                        name: "newspaper-variant-outline",
                        type: "MaterialCommunityIcons",
                    },
                    onPress: () => {
                        //alert("savedPost")
                    },
                },
                {
                    title: 'Reaction preferences',
                    icon: {
                        name: "emoji-happy",
                        type: "Entypo",
                    },
                    onPress: () => {
                        //alert("savedPost")
                    },
                },
                {
                    title: 'Language and region',
                    icon: {
                        name: "language",
                        type: "MaterialIcons",
                    },
                    onPress: () => {
                        //alert("savedPost")
                    },
                }],
        }];
    

    const Item = ({ item }) => {
        return (
            <View style={styles.item}>

                <ListItem
                    style={styles.listItem}
                    title={item.title}
                    titleStyle={{color:colors.dimGray}}
                    onPress={item.onPress}
                    isBottomSheet={true}
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
            </View>
        );
    }

    return (
       
        <Screen style={styles.container}>

            <Header
                left={<HeaderCloseIcon onPress={() => navigation.goBack()} />}
                middle={
                    <HeaderTitle titleStyle={styles.headerTitle}>
                        Account Settings
                    </HeaderTitle>
                }

                backgroundColor={colors.lighterGray}
                headerContainerStyle={styles.header}
            />
            <View style={styles.content}>
                <SafeAreaView style={styles.container}>
                    <SectionList
                        sections={Options}
                        keyExtractor={(item, index) => item + index}
                        renderItem={Item}
                        renderSectionHeader={({ section: { header, subTitle } }) => (
                            <View style={{ paddingLeft: 30 ,paddingTop:15}}>
                                <Text style={{ fontWeight: "500", fontSize: 20 }}>{header}</Text>
                                <Text style={{ color: colors.dimGray, marginTop: 5 }}>{subTitle}</Text>
                            </View>
                        )}
                    />
                </SafeAreaView>

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
    groupsList: {
        paddingTop: 20,
    },
    listItem: {
        paddingVertical: 0,
        marginTop: 0,
        paddingLeft: 20,
    },
    item: {
        marginVertical: 5
    },
    header: {
        fontSize: 32,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 20
    }
});