import { useNavigation } from '@react-navigation/native';
import type {
  AuthNavigationProp,
  MainTabNavigationProp,
  NewsFeedNavigationProp,
  GroupNavigationProp,
  ActivityNavigationProp,
  CombinedNavigationProp,
} from './types';

// Typed navigation hooks
export const useAuthNavigation = () => useNavigation<AuthNavigationProp>();
export const useMainTabNavigation = () => useNavigation<MainTabNavigationProp>();
export const useNewsFeedNavigation = () => useNavigation<NewsFeedNavigationProp>();
export const useGroupNavigation = () => useNavigation<GroupNavigationProp>();
export const useActivityNavigation = () => useNavigation<ActivityNavigationProp>();
export const useCombinedNavigation = () => useNavigation<CombinedNavigationProp>();

// Generic typed navigation hook
export const useTypedNavigation = <T>() => useNavigation<T>();
