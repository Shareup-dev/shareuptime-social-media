import React, { useContext, useState } from 'react';
import { StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

import { Form, FormField, SubmitButton } from '../components/forms';
import routes from '../navigation/routes';

import defaultStyles from '../config/styles';
import RegistrationContainer from '../components/forms/RegistrationContainer';
import colors from '../config/colors';
import authService from '../services/auth.service';
import authContext from '../authContext';
import Loading from '../components/Loading';
import defaultStyles from '../config/styles';
import colors from '../config/colors';

const validationSchema = Yup.object().shape({
  otp: Yup.string('Invalid Code').required().label('Verification code').length(6),
});

export default function SignupVerification({ navigation, route }) {
  const { authActions } = useContext(authContext);
  const { params } = route;

  const [message, setMessage] = useState({
    text: 'Shareup has sent you a verification code to the email',
    type: 'default',
    isSending: false,
  });

  const [timeOver, setTimeOver] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert('Discard changes?', 'Are you sure to discard and leave the screen?', [
          { text: "Don't leave", style: 'cancel', onPress: () => {} },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]);
      }),
    [navigation],
  );

  const resendOTP = () => {
    setMessage({ ...message, isSending: true });
    authService
      .verifyEmailOTP(params.username)
      .then((res) =>
        res.status === 200
          ? setMessage({
              isSending: false,
              text: 'Shareup has re-sent your verification code',
              type: 'success',
            })
          : null,
      )
      .catch((e) =>
        setMessage({
          isSending: false,
          text: 'Verification code not send',
          type: 'error',
        }),
      );
  };

  const handleSubmit = async (values, props) => {
    setLoading(true);
    setTimeout(() => {
      const { setFieldError } = props;
      authService
        .verifyEmailConfirmOTP(params.username, values.otp)
        .then(async (res) => {
          if (res.status === 200) {
            if (params.jwt) await authActions.signup(params.username, params.jwt);
            else {
              authService.login(params.username, params.password).then(async (result) => {
                if (result.status === 200) {
                  await authActions.login(result.data.username, result.data.jwt);
                  Toast.show({
                    position: 'bottom',
                    visibilityTime: 5000,
                    type: 'success',
                    text1: 'Success',
                    text2: 'Logged in Successfully 👋',
                  });
                }
              });
            }
          }
        })
        .catch((e) => {
          if (e.message === 'Request failed with status code 400') {
            setFieldError('otp', 'Incorrect code');
          } else if (e.message === 'Request failed with status code 408') {
            setFieldError('otp', 'Code expired');
          } else setFieldError('otp', 'Unexpected error.');
        })
        .finally((_) => setLoading(false));
    }, 2000);
  };

  return (
    <RegistrationContainer title="Account Verification">
      <Form
        initialValues={{
          otp: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <>
          {params.fromLogin && (
            <Text
              style={{
                fontWeight: '600',
                color: 'crimson',
                marginVertical: 10,
              }}
            >
              Your account not verified. Please confirm your Email
            </Text>
          )}
          <Text
            style={
              message.type === 'success'
                ? { color: 'green' }
                : message.type === 'error' && 'crimson'
            }
          >
            {message.text}
          </Text>
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            name="otp"
            placeholder="Verification code"
            textContentType="number" // Only for ios
            style={defaultStyles.formField}
          />
          <Text>Verification code will expire after 5 minutes</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              marginVertical: 5,
              backgroundColor: '#cacaca60',
              paddingHorizontal: 15,
              paddingVertical: 6,
              borderRadius: 30,
            }}
            disabled={message.isSending}
          >
            <Text style={{ color: colors.iondigoDye, fontWeight: '700' }} onPress={resendOTP}>
              {message.isSending ? 'Sending..' : 'Re-send'}
            </Text>
          </TouchableOpacity>

          {timeOver && (
            <TouchableOpacity activeOpacity={0.7} style={{ marginVertical: 5 }}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 18,
                  color: colors.iondigoDye,
                }}
              >
                Send again
              </Text>
            </TouchableOpacity>
          )}

          <SubmitButton title="Verify" disabled={loading} style={styles.submitButton} />
        </>
      </Form>
    </RegistrationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  submitButton: {
    alignSelf: 'center',
    width: '60%',
    paddingTop: '10%',
  },
});
