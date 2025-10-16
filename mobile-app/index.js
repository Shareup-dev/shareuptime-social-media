/**
 * @format
 */

// Must be at the very top for React Navigation gesture handling
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { enableScreens } from 'react-native-screens';
import App from './App';
import { name as appName } from './app.json';

// Optimize memory usage for navigation
enableScreens(true);
AppRegistry.registerComponent(appName, () => App);
