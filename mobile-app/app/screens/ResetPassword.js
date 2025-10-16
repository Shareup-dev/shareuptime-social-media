import React, { useContext, useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import * as Yup from 'yup';

import { Form, FormField, SubmitButton } from '../components/forms';
import RegistrationContainer from '../components/forms/RegistrationContainer';
import authService from '../services/auth.service';
import AuthContext from '../authContext';

const validationSchema = Yup.object().shape({
  password: Yup.string().required().min(3).label('Password'),
  confirmPassword: Yup.string()
    .required()
    .label('Re-Enter Password')
    .when('password', {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], 'Password not matched.'),
    }),
});

export default function ResetPassword({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const { username } = route?.params;
  const { authActions } = useContext(AuthContext);

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
            // If the user confirmed, then we dispatch the action we blocked earlier
            // This will continue the action that had triggered the removal of the screen
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]);
      }),
    [navigation],
  );

  const authenticate = (username, password) => {
    authService
      .login(username, password)
      .then(async (res) => {
        await authActions.login(res.data.username, res.data.jwt);
      })
      .finally(() => {
        // Toast.show({
        //   position: 'bottom',
        //   visibilityTime: 5000,
        //   type: 'success',
        //   text1: 'Success',
        //   text2: 'Password changed',
        // });
        setLoading(false);
      });
  };

  const handleSubmit = async (values, props) => {
    setLoading(true);
    const { setFieldError } = props;
    authService
      .resetPassword(username, values?.password)
      .then((res) => {
        if (res.status === 200) {
          authenticate(username, values?.password);
        }
      })
      .catch((_e) => {
        setFieldError('confirmPassword', 'Error while changing the Password.');
        setLoading(false);
      });
  };

  return (
    <RegistrationContainer title="Forgot Password">
      <Form
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormField
          autoCorrect={false}
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password" // Only for ios
          style={styles.formField}
        />

        <FormField
          autoCorrect={false}
          name="confirmPassword"
          placeholder="Re-Enter Password"
          secureTextEntry
          textContentType="password" // Only for ios
          style={styles.formField}
        />

        <SubmitButton title="Confirm" style={styles.submitButton} />
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
