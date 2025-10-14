import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignupStepTwo from '../screens/SignupStepTwo';
import ForgotPassword from '../screens/ForgotPassword';
import PasswordResetOTP from '../screens/PasswordResetOTP';
import ResetPassword from '../screens/ResetPassword';
import SignupVerification from '../screens/SignupVerification';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          title: 'Sign In',
        }}
      />
      
      <Stack.Screen 
        name="Register" 
        component={SignUpScreen}
        options={{
          title: 'Create Account',
        }}
      />
      
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPassword}
        options={{
          title: 'Reset Password',
          gestureDirection: 'vertical',
        }}
      />
      
      <Stack.Screen 
        name="ResetPassword" 
        component={ResetPassword}
        options={{
          title: 'New Password',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;