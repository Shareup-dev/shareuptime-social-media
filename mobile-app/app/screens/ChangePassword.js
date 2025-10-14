import React from 'react';
import {Form, FormField, SubmitButton} from '../components/forms';
import {StyleSheet, View, Text} from 'react-native';
import Screen from '../components/Screen';
import defaultStyles from '../config/styles';
import {Header, HeaderTitle, HeaderCloseIcon} from '../components/headers';
import * as Yup from 'yup';
import colors from '../config/colors';
import routes from '../navigation/routes';
import ForgotPasswordHeader from '../components/ForgotPassword/Header';

export default function ChangePassword({navigation}) {
  // determine all the rules for validating our form
  const validationSchema = Yup.object().shape({
    password1: Yup.string().required().label('Password').min(8),
    password2: Yup.string()
      .required()
      .oneOf([Yup.ref('password1'), null], 'Password mismatch')
      .label('Re-Password')
      .min(8),
  });

  const handleSubmit = async userInfo => userInfo;

  return (
    <Screen style={styles.container}>
      <ForgotPasswordHeader navigation={navigation} />
      <View>
        <Text style={styles.noteText}>Please enter your new password.</Text>
      </View>
      <Form
        initialValues={{
          password1: '',
          password2: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        <View style={{marginTop: 10}}>
          <FormField
            autoCorrect={false}
            name="password1"
            placeholder="Password"
            secureTextEntry
            textContentType="password" // Only for ios
            style={defaultStyles.formField}
          />
          <FormField
            autoCorrect={false}
            name="password2"
            secureTextEntry
            placeholder="Re-Password"
            textContentType="password" // Only for ios
            style={defaultStyles.formField}
          />
        </View>

        <SubmitButton title="Save" style={styles.submitButton} />
      </Form>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  submitButton: {
    alignSelf: 'center',
    width: '60%',
    paddingTop: 5,
  },

  leftAndRight: {
    marginBottom: 2,
  },
  content: {
    flex: 1,
  },
  textField: {
    alignSelf: 'center',
  },
  linkButtons: {
    margin: 10,
  },
  userProfilePicture: {
    alignSelf: 'center',
  },
  groupsList: {paddingTop: 20},
  listItem: {
    marginBottom: 13,
    marginHorizontal: 28,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  noteText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 15,
    marginHorizontal: 15,
    textAlign: 'center',
  },
});
