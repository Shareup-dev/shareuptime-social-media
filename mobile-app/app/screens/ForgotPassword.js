import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import * as Yup from 'yup';

import { Form, FormField, SubmitButton } from '../components/forms';
import routes from '../navigation/routes';

import defaultStyles from '../config/styles';
import RegistrationContainer from '../components/forms/RegistrationContainer';
import authService from '../services/auth.service';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
});

export default function ForgotPassword({ navigation }) {
  const [Loading, setLoading] = useState(false);

  // Sending OTP to email to reset password
  const sendOTP = (values, setFieldError) => {
    authService
      .passwordResetOTP(values.email)
      .then((res) => {
        if (res.status === 200) {
          navigation.navigate(routes.PASSWORD_RESET_OTP, {
            ...values,
          });
        } else {
          setFieldError('email', 'Error while sending OTP');
        }
      })
      .catch((e) => setFieldError('email', 'Error while sending OTP'))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (values, props) => {
    const { setFieldError } = props;
    setLoading(true);

    //checking if the user account exist
    authService
      .verifyUser(values.email)
      .then((res) => {
        if (res.status === 200) {
          sendOTP(values, setFieldError);
        } else setFieldError('email', 'Account not exist. Please check your Email');
      })
      .catch((e) => {
        if (e.message === 'Request failed with status code 404')
          setFieldError('email', 'Account not exist. Please check your Email');
        else setFieldError('email', 'Unexpected Error.');
        setLoading(false);
      });
  };

  return (
    <RegistrationContainer title="Forgot Password">
      <Form
        initialValues={{
          email: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress" // Only for ios
          style={defaultStyles.formField}
        />
        <Text>Help us to Find your Account</Text>

        <SubmitButton
          title={Loading ? `Verifying` : `Find my account`}
          disabled={Loading}
          style={[styles.submitButton, { opacity: Loading ? 0.5 : 1 }]}
        />
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
