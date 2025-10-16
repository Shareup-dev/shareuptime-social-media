module.exports = {
  presets: ['module:metro-react-native-babel-preset', '@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './app',
          '@/components': './app/components',
          '@/screens': './app/screens',
          '@/services': './app/services',
          '@/utils': './app/utils',
          '@/types': './app/types',
          '@/config': './app/config',
          '@/assets': './app/assets',
        },
      },
    ],
    'react-native-reanimated/plugin', // Must be last
  ],
};
