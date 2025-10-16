import * as Yup from 'yup';
import React, { useContext, useState } from 'react';
import { StyleSheet, View, PixelRatio, TouchableOpacity, Text } from 'react-native';
import Toast from 'react-native-toast-message';

import { ErrorMessage, Form, FormField, SubmitButton } from '../components/forms';
import AlternativeRegistrationContainer from '../components/AlternativeRegistrationContainer';
import AuthService from '../services/auth.service';
import LinkButton from '../components/buttons/LinkButton';
import Separator from '../components/Separator';
import authContext from '../authContext';
import colors from '../config/colors';
import routes from '../navigation/routes';

import useIsReachable from '../hooks/useIsReachable';
import settings from '../config/settings';
import defaultStyles from '../config/styles';
import LoginContainer from '../components/forms/LoginContainer';
import Loading from '../components/Loading';
import authService from '../services/auth.service';
import { ScrollView } from 'react-native-gesture-handler';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(3).label('Password'),
});

export default function LoginScreen({ navigation }) {
  const { authActions } = useContext(authContext);
  const { checkIfReachable } = useIsReachable();

  const [loading, setLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);

    // checking if the server is reachable
    const isReachable = await checkIfReachable(settings.apiUrl);

    if (isReachable === false) {
      setLoading(false);
      setError("Can't reach server please try later");
      return setLoginFailed(true);
    }

    // --------- login ----------
    AuthService.login(email, password)
      .then(async (result) => {
        await authActions.login(result.data.username, result.data.jwt);
        Toast.show({
          position: 'bottom',
          visibilityTime: 5000,
          type: 'success',
          text1: 'Success',
          text2: 'Logged in Successfully 👋',
        });
      })
  .catch(async (err) => {
        let message;

  if (err.message === 'Request failed with status code 401') {
          // if the user not verified
          await authService
            .verifyEmailOTP(email)
            .then((res) => {
              if (res.status === 200)
                navigation.navigate(routes.SIGNUP_VERIFICATION, {
                  username: email,
                  password: password,
                  jwt: null,
                  fromLogin: true,
                });
            })
            .catch(() => (message = 'Unexpected Error!'));
        } else {
          if (err.message === 'Request failed with status code 500')
            // if invalid password or username
            message = 'Username or Password incorrect';
          else message = err.message;

          Toast.show({
            position: 'bottom',
            visibilityTime: 5000,
            type: 'error',
            text1: 'Error',
            text2: message,
          });
        }
      })
      .finally((_) => {
        setLoading(false);
        setLoginFailed(false);
      });

    // storing the token into secure store
  };

  // ToDO: Fix the layout
  return (
    <>
      {loading ? (
        <Loading text="Logging in..." />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <LoginContainer>
            <Form
              initialValues={{ email: '', password: '' }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <ErrorMessage error={error} visible={loginFailed} />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="email"
                keyboardType="email-address"
                name="email"
                placeholder="Email Address"
                textContentType="emailAddress" // Only for ios
                style={defaultStyles.formField}
              />

              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                name="password"
                placeholder="Password"
                secureTextEntry
                textContentType="password" // Only for ios
                style={defaultStyles.formField}
              />
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation.navigate(routes.FORGOT_PASSWORD)}
              >
                <Text style={styles.forgotPassword}>Forgot Password</Text>
              </TouchableOpacity>

              <SubmitButton title="Share in" style={styles.submitButton} />
              <AlternativeRegistrationContainer />

              <Separator text="or" style={styles.separator} />
              {/* added a comment here */}
              <View style={styles.thirdContainer}>
                <LinkButton
                  title="Create new account?"
                  style={styles.linkedButton}
                  onPress={() => {
                    navigation.navigate(routes.SIGNUP);
                  }}
                />
              </View>
            </Form>
          </LoginContainer>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    color: colors.iondigoDye,
    fontWeight: '600',
  },
  thirdContainer: {
    padding: PixelRatio.get() < 2.5 ? 0 : 20,
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    color: colors.dimGray,
  },
  linkedButton: {
    margin: 10,
  },
  secondContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  iconButton: {
    margin: 20,
  },
  separator: {
    paddingHorizontal: 20,
  },
  formField: {
    width: '90%',
    marginBottom: 5,
  },
  submitButton: {
    width: '60%',
    marginTop: PixelRatio.get() < 2.5 ? 7 : 20,
  },
});
