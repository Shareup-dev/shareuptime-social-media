module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|react-native-reanimated|react-native-gesture-handler|@react-native|@react-navigation)/)"
  ]
};