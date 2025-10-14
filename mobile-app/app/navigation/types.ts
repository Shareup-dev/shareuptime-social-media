import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Authentication Stack Types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

// Main Tab Navigator Types  
export type MainTabParamList = {
  NewsFeedNavigator: NavigatorScreenParams<NewsFeedStackParamList>;
  GroupNavigator: NavigatorScreenParams<GroupStackParamList>;
  AddPost: { postType?: string };
  ActivityNavigator: NavigatorScreenParams<ActivityStackParamList>;
  Account: undefined;
};

// News Feed Stack Types
export type NewsFeedStackParamList = {
  Feed: undefined;
  PostDetails: { postId: string };
  UserProfile: { userId: string };
  Comments: { postId: string };
  Stories: { storyId?: string; userId?: string };
  Reels: { reelId?: string };
  AddNewReel: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Followers: { userId: string };
  Following: { userId: string };
  Search: undefined;
  HashtagPosts: { hashtag: string };
  LocationPosts: { locationId: string };
  
  // Legacy routes for backward compatibility
  KeepHang: undefined;
  Swap: undefined;
  SwapDisplay: undefined;
  SwapShipping: undefined;
  SwapCheckout: undefined;
  SwapCheckoutComplete: undefined;
  GroupFeed: undefined;
  InviteGroupMembers: undefined;
  SetPostAudience: undefined;
};

// Group Stack Types  
export type GroupStackParamList = {
  GroupsList: undefined;
  GroupDetails: { groupId: string };
  GroupMembers: { groupId: string };
  CreateGroup: undefined;
  EditGroup: { groupId: string };
  GroupSettings: { groupId: string };
};

// Activity Stack Types
export type ActivityStackParamList = {
  Notifications: undefined;
  Messages: undefined;
  MessageThread: { conversationId: string; recipientName: string };
  NewMessage: undefined;
};

// Root Stack Types (Main App Structure)
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  // Modal screens that appear over everything
  Modal: {
    screen: string;
    params?: any;
  };
  FullScreenCamera: undefined;
  FullScreenImageViewer: {
    images: Array<{ url: string; id: string }>;
    initialIndex?: number;
  };
  VideoPlayer: {
    videoUrl: string;
    title?: string;
  };
};

// Navigation Prop Types for Components
export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
export type NewsFeedNavigationProp = StackNavigationProp<NewsFeedStackParamList>;
export type GroupNavigationProp = StackNavigationProp<GroupStackParamList>;
export type ActivityNavigationProp = StackNavigationProp<ActivityStackParamList>;

// Combined Navigation Props (for screens that need access to multiple navigators)
export type CombinedNavigationProp = CompositeNavigationProp<
  MainTabNavigationProp,
  CompositeNavigationProp<
    NewsFeedNavigationProp,
    CompositeNavigationProp<
      GroupNavigationProp,
      ActivityNavigationProp
    >
  >
>;

// Route Prop Types for Screens
export type AuthRouteProp<T extends keyof AuthStackParamList> = RouteProp<AuthStackParamList, T>;
export type NewsFeedRouteProp<T extends keyof NewsFeedStackParamList> = RouteProp<NewsFeedStackParamList, T>;
export type GroupRouteProp<T extends keyof GroupStackParamList> = RouteProp<GroupStackParamList, T>;
export type ActivityRouteProp<T extends keyof ActivityStackParamList> = RouteProp<ActivityStackParamList, T>;
export type MainTabRouteProp<T extends keyof MainTabParamList> = RouteProp<MainTabParamList, T>;

// Hook Types for useNavigation
export type UseAuthNavigation = () => AuthNavigationProp;
export type UseMainTabNavigation = () => MainTabNavigationProp;
export type UseNewsFeedNavigation = () => NewsFeedNavigationProp;
export type UseGroupNavigation = () => GroupNavigationProp;
export type UseActivityNavigation = () => ActivityNavigationProp;

// Screen Props Types (combination of navigation and route)
export type AuthScreenProps<T extends keyof AuthStackParamList> = {
  navigation: AuthNavigationProp;
  route: AuthRouteProp<T>;
};

export type NewsFeedScreenProps<T extends keyof NewsFeedStackParamList> = {
  navigation: NewsFeedNavigationProp;
  route: NewsFeedRouteProp<T>;
};

export type GroupScreenProps<T extends keyof GroupStackParamList> = {
  navigation: GroupNavigationProp;
  route: GroupRouteProp<T>;
};

export type ActivityScreenProps<T extends keyof ActivityStackParamList> = {
  navigation: ActivityNavigationProp;
  route: ActivityRouteProp<T>;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> = {
  navigation: MainTabNavigationProp;
  route: MainTabRouteProp<T>;
};

// Declare global type for React Navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}