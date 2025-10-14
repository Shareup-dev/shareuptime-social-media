import React from "react";
import { View, StyleSheet } from "react-native";
import Modal from "react-native-modal";

import defaultStyle from "../../config/styles";
import colors from "../../config/colors";

export default function DownModal({ isVisible, setIsVisible, children }) {
  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      swipeDirection={["down"]}
      onSwipeComplete={() => setIsVisible(false)}
      onBackdropPress={() => setIsVisible(false)}
      backdropOpacity={0.2}
    >
      <View style={[styles.container, defaultStyle.shadow]}>{children}</View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  container: {
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    padding: 10,
    backgroundColor: colors.white,
    width: "100%",
  },
});
