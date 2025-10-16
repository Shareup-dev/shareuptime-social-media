import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as Yup from 'yup';

import { Form, FormField, SubmitButton } from '../components/forms';
import Separator from '../components/Separator';
import routes from '../navigation/routes';

import defaultStyles from '../config/styles';
import RegistrationContainer from '../components/forms/RegistrationContainer';
import LinkButton from '../components/buttons/LinkButton';
import authService from '../services/auth.service';
import colors from '../config/colors';
import AlternativeRegistrationContainer from '../components/AlternativeRegistrationContainer';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required().label('First Name'),
  lastName: Yup.string().required().label('Last Name'),
  email: Yup.string().required().email().label('Email'),
});

export default function SignUpScreen({ navigation }) {
  const [error, setError] = useState('');
  const [Loading, setLoading] = useState(false);

  const handleSubmit = (values, props) => {
    setLoading(true);
    const { setFieldError } = props;

    authService
      .verifyUser(values?.email)
      .then((res) =>
        res.status !== 200
          ? navigation.navigate(routes.SIGNUP_STEP2, {
              ...values,
            })
          : setFieldError('email', 'The Email you provide is already in used.'),
      )
      .catch((e) => {
        if (e.message === 'Request failed with status code 404') {
          // if user not exist move to next step
          {
            navigation.navigate(routes.SIGNUP_STEP2, {
              ...values,
            });
          }
        } else setError('Unexpected Error.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <RegistrationContainer>
      <Form
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormField
          autoCorrect={false}
          name="firstName"
          placeholder="First Name"
          style={defaultStyles.formField}
        />
        <FormField
          autoCorrect={false}
          name="lastName"
          placeholder="Last Name"
          style={defaultStyles.formField}
        />

        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress" // Only for ios
          style={defaultStyles.formField}
        />

        <Text style={{ color: colors.red, fontWeight: '700' }}>{error ? error : null}</Text>

        <SubmitButton disabled={Loading} title="Next" dis style={styles.submitButton} />
        <Separator text="or" />
        <AlternativeRegistrationContainer />

        <LinkButton
          title="Do you have an existing account?"
          onPress={() => navigation.navigate(routes.LOGIN)}
          style={{ marginTop: 10, fontSize: 18 }}
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
  },
});
