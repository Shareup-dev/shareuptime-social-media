import React, { useState } from 'react';
import * as Yup from 'yup';
import { ErrorMessage, Form, FormField, SubmitButton } from '../components/forms';
import Toast from 'react-native-toast-message';

import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '../components/Text';
import AuthService from '../services/auth.service';
import Icon from '../components/Icon';
import FormRadio from '../components/forms/FormRadio';

import settings from '../config/settings';
import useIsReachable from '../hooks/useIsReachable';
import RegistrationContainer from '../components/forms/RegistrationContainer';

import routes from '../navigation/routes';

const SignupStepTwo = ({ navigation, route }) => {
  const prevStepValues = route?.params;

  const [agreed, setagreed] = useState(false);
  const [_verified, _setVerified] = useState(false);
  const [registerFailed, setRegisterFailed] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isReachable, checkIfReachable } = useIsReachable();

  const validationSchema = Yup.object().shape({
    gender: Yup.string().required(),
    password: Yup.string().required().min(3).label('Password'),
    confirmPassword: Yup.string()
      .required()
      .label('Re-Enter Password')
      .when('password', {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf([Yup.ref('password')], 'Password not matched.'),
      }),
  });

  const handleSubmit = async (values) => {
    if (!agreed) {
      Toast.show({
        position: 'bottom',
        visibilityTime: 5000,
        type: 'error',
        text1: 'Error',
        text2: 'Please agree to the terms 👋',
      });
      return;
    }
    setLoading(true);
    const reachable = await checkIfReachable(settings.apiUrl);

    if (reachable === false) {
      setLoading(false);
      setRegisterError("Can't reach server please try later");
      return setRegisterFailed(true);
    }

    const userCompleteData = { ...prevStepValues, ...values };

    AuthService.signup(userCompleteData)
      .then(async (res) => {
        const { jwt, username } = res.data;
        navigation.navigate(routes.SIGNUP_VERIFICATION, {
          jwt,
          username,
        });
      })
      .catch((e) =>
        Toast.show({
          position: 'bottom',
          visibilityTime: 5000,
          type: 'error',
          text1: 'Error',
          text2: 'Error while signup.',
        }),
      )
      .finally(() => setLoading(false));
  };

  return (
    <>
      <RegistrationContainer>
        <View style={styles.registerError}>
          <ErrorMessage error={registerError} visible={registerFailed} />
        </View>

        <Form
          initialValues={{
            password: '',
            confirmPassword: '',
            gender: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <FormRadio name="gender" style={[styles.formField, styles.formRadio]} />

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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.agree} onPress={() => setagreed(!agreed)}>
              <Icon
                name={agreed ? 'check-box' : 'check-box-outline-blank'}
                type={'MaterialIcons'}
                size={30}
                backgroundSizeRatio={0.9}
                style={styles.checkIcon}
              />
            </TouchableOpacity>
            <Text style={{ marginLeft: 10 }}>{'Agree to terms & conditions'}</Text>
          </View>

          <SubmitButton disabled={loading} title="Register" style={styles.submitButton} />
        </Form>
      </RegistrationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    alignSelf: 'center',
    width: '60%',
    justifyContent: 'center',
    marginVertical: 20,
  },
  agree: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  registerError: {
    alignItems: 'center',
  },
  formField: {
    width: '90%',
    marginBottom: 5,
  },
  formRadio: {
    marginBottom: 20,
  },
});
export default SignupStepTwo;
