import React, { useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";

import Screen from "../components/Screen";
import TextField from "../components/TextField";
import colors from "../config/colors";
import { HeaderWithBackArrow } from "../components/headers";
import { Checkbox } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";

const usersData = [
  { name: "john Mac", img: "../assets/images/reel2.png" },
  { name: "Kaneshamoorthi Lokeesan", img: "../assets/images/reel2.png" },
];

export default function TagPeople({ navigation }) {
  const [tagPeople, setTagPeople] = useState([]);

  const TagUserCard = (props) => {
    const { name, img } = props.data;

    const CheckIfChecked = (name) => {
      return tagPeople.find((item) => item === name);
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={(e) => {
          CheckIfChecked(name)
            ? setTagPeople((prev) => prev.filter((item) => item !== name))
            : setTagPeople((prev) => [...prev, name]);
        }}
      >
        <View style={styles.usersInfo}>
          <Image
            style={styles.img}
            source={require("../assets/images/reel2.png")}
          />
          <Text style={{ marginLeft: 15 }}>{name}</Text>
        </View>
        <Checkbox status={CheckIfChecked(name) ? "checked" : "unchecked"} />
      </TouchableOpacity>
    );
  };
  return (
    <Screen style={styles.container}>
      <HeaderWithBackArrow
        onBackButton={() => navigation.goBack()}
        component={
          <TextField
            placeholder="Search Friends"
            iconName="search1"
            iconType="AntDesign"
            style={styles.searchbar}
          />
        }
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tag Friends</Text>
      </View>
      {usersData.map((data, i) => (
        <TagUserCard data={data} key={i} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  usersInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
  },
  searchbar: {
    width: "90%",
    marginLeft: 10,
  },

  separator: {
    backgroundColor: colors.LightGray,
    width: "100%",
    height: 10,
    marginTop: 15,
  },
});
