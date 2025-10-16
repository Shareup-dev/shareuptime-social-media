import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function TabNavigation({ tabMenus, initTab = tabMenus[0].name }) {
  const [activeTab, setActiveTab] = useState(initTab);

  const TabButton = ({ name }) => {
    return (
      <TouchableOpacity onPress={() => setActiveTab(name)} activeOpacity={0.6} style={styles.btn}>
        <Text style={name === activeTab ? { fontWeight: '700' } : null}>{name}</Text>
      </TouchableOpacity>
    );
  };

  const ActiveScreen = () => {
    return tabMenus.find((menu) => menu.name === activeTab).component;
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        {tabMenus.map(({ name }, index) => (
          <TabButton key={index} name={name} />
        ))}
      </View>
      <View style={styles.content}>
        <ActiveScreen />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  navigation: {
    // backgroundColor: "#cacaca",
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btn: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    height: 40,
    alignItems: 'center',
    width: '50%',
    borderBottomColor: '#cacaca',
    borderBottomWidth: 1,
  },
});
