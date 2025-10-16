import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import routes from './routes';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignupStepTwo from '../screens/SignupStepTwo';
import ForgotPassword from '../screens/ForgotPassword';
import PasswordResetOTP from '../screens/PasswordResetOTP';
import ResetPassword from '../screens/ResetPassword';
import SignupVerification from '../screens/SignupVerification';

export default function AuthNavigation() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name={routes.LOGIN} component={LoginScreen} />
      <Stack.Screen name={routes.SIGNUP} component={SignUpScreen} />

      <Stack.Screen name={routes.FORGOT_PASSWORD} component={ForgotPassword} />
      <Stack.Screen name={routes.PASSWORD_RESET} component={ResetPassword} />
      <Stack.Screen name={routes.SIGNUP_VERIFICATION} component={SignupVerification} />
      <Stack.Screen name={routes.PASSWORD_RESET_OTP} component={PasswordResetOTP} />

      <Stack.Screen name={routes.SIGNUP_STEP2} component={SignupStepTwo} />
    </Stack.Navigator>
  );
}
