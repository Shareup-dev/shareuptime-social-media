const { getDefaultConfig } = require('@react-native/metro-config');
const { mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
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
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
