import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import Button from "../components/buttons/Button";
import GiftDrawer from "../components/drawers/GiftDrawer";
import Icon from "../components/Icon";
import HangCard from "../components/lists/HangCard";
import Screen from "../components/Screen";
import Separator from "../components/Separator";
import colors from "../config/colors";

export default function KeepHangScreen({ navigation }) {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const hangList = [
    {
      id: 1,
      title: "Hang Flow",
      image: "",
    },
    {
      id: 2,
      title: "Hang Gifts",
      image: require("../assets/icons/gray-gift-icon.png"),
      onPress: () => setIsDrawerVisible(!isDrawerVisible),
    },
    {
      id: 3,
      title: "Hang Meals",
      image: require("../assets/icons/gray-food-icon.png"),
    },
    {
      id: 4,
      title: "",
      image: "",
    },
    { id: 5, title: "", image: "" },
  ];
  return (
    <Screen statusPadding={true}>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" type="Ionicons" size={50} />
        </TouchableWithoutFeedback>

        <Text style={styles.headerTitle}> Today to me, tomorrow to you</Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={hangList}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HangCard
              title={item.title}
              image={item.image}
              onPress={item.onPress}
            />
          )}
        />
      </View>
      <View style={styles.line} />

      <View style={styles.cameraIcon}>
        <Icon
          name="camera"
          type="Feather"
          color={colors.mediumGray}
          backgroundSizeRatio={0.7}
        />
      </View>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Access Your Camera roll to hare</Text>
          <Text style={styles.title}>Photos</Text>
          <Text style={styles.text}>Choose how you want to allow access</Text>
          <View style={styles.extraSpace} />
          <View style={styles.sectionWrapper}>
            <Icon
              name="image"
              type="Feather"
              backgroundSizeRatio={0.7}
              color="#4CAF50"
              style={styles.icon}
            />
            <View style={styles.textWrapper}>
              <Text style={styles.subTitle}>Allow access to all photo</Text>
              <Text style={styles.text}>
                Find Photos and videos faster by viewing
              </Text>
              <Text style={styles.text}>your entire camera roll</Text>
            </View>
          </View>

          <Separator text="Or" style={styles.separator} />

          <View style={styles.sectionWrapper}>
            <Icon
              name="check-circle"
              type="Feather"
              backgroundSizeRatio={0.7}
              color={colors.iondigoDye}
              style={styles.icon}
            />
            <View style={styles.textWrapper}>
              <Text style={styles.subTitle}>Select photos to limit access</Text>
              <Text style={styles.text}>
                You'll need to manually select new photos
              </Text>
              <Text style={styles.text}>every time you want to share</Text>
            </View>
          </View>
          <View style={styles.endWrapper}>
            <Text style={styles.text}>
              Select allow access to all Photos to make
            </Text>
            <Text style={styles.text}>Sharing easier</Text>
          </View>
          <View style={styles.button}>
            <Button title="Continue" />
          </View>
        </View>
      </ScrollView>

      <GiftDrawer
        isVisible={isDrawerVisible}
        setIsVisible={setIsDrawerVisible}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
  },
  line: {
    height: 1.5,
    width: "100%",
    backgroundColor: colors.lighterGray,
  },
  listContainer: {
    padding: 10,
  },
  cameraIcon: {
    alignItems: "flex-end",
    marginTop: 20,
    marginRight: 20,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 17,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "normal",
  },
  text: {
    color: colors.mediumGray,
    fontSize: 13,
    marginTop: 5,
  },
  sectionWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    marginVertical: 20,
  },
  endWrapper: {
    marginTop: "15%",
    alignItems: "center",
    // backgroundColor: "red",
  },
  button: {
    width: "70%",
    marginVertical: 10,
  },
  extraSpace: {
    marginVertical: 15,
  },
  icon: {
    marginRight: 15,
  },
});
