import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import DownModal from "./DownModal";
import { HeaderButton } from "../headers";
import defaultStyles from "../../config/styles";
import colors from "../../config/colors";
import Separator from "../Separator";
import { RadioButton } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import RadioItem from "./RadioItem";

export default function RadioOptionDrawer({
  isVisible,
  setIsVisible,
  title,
  subTitle,
  options,
  onSubmit,
  initialValue,
}) {
  const [value, setValue] = useState(initialValue);
  const [allowSubmit, setAllowSubmit] = useState(false);

  const handleOnValueChange = (newValue) => {
    setValue(newValue);
    setAllowSubmit(true);
  };

  useEffect(() => {
    setAllowSubmit(false);
  }, []);



  return (
    <DownModal isVisible={isVisible} setIsVisible={setIsVisible}>
      <View style={styles.container}>
        {/**Header */}
        <View style={styles.headerContainer}>
          <HeaderButton
            title="Done"
            isActive={allowSubmit}
            style={styles.headerButton}
            onPress={() => onSubmit(value)}
          />
          <Text style={[styles.title, defaultStyles.fontWeightMedium]}>
            {title}
          </Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
          <Separator style={styles.separator} />
        </View>

        <RadioButton.Group onValueChange={handleOnValueChange} value={value}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => <RadioItem item={item} />}
          />
        </RadioButton.Group>
      </View>
    </DownModal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 18,
  },
  subTitle: {
    color: colors.mediumGray,
  },
  headerButton: {
    alignSelf: "flex-end",
  },
});
