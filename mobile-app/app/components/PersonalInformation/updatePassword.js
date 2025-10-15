import {Formik} from 'formik';
import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import AuthContext from '../../Contexts/authContext';
import {HeaderWithBackArrow} from '../../components/headers';
import colors from '../../config/colors';
import * as Yup from 'yup';
import Loading from '../../components/Loading';
import userService from '../../services/user.service';

export default function UpdatePassword({navigation}) {
  const {
    userState: {userData, username},
    authActions,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const handleSubmit = values => {
    setLoading(true);
    Keyboard.dismiss();
    userService
      .editProfile(username, values)
      .then(({status, data}) => {
        if (status === 200) {

          authActions.updateUserInfo(data);
          setLoading(false);
          navigation.goBack();
        }
      })
      .catch(e => console.error(e.message));
  };

  const validation = Yup.object().shape({
    password: Yup.string().required().label('Password'),
    confirmPassword: Yup.string().required().label('Confirm Password'),
  });

  return (
    <KeyboardAvoidingView style={styles.container}>
      <HeaderWithBackArrow
        onBackButton={_ => navigation.goBack()}
        title="Change Password"
      />
      {loading && <Loading text="Saving.." modal />}
      <TouchableOpacity
      activeOpacity={1}
        style={{flex: 1}}
        onPress={_ => Keyboard.dismiss()}>
        <Formik
          initialValues={{
              password:'',
              confirmPassword:''
          }}
          onSubmit={handleSubmit}
          validationSchema={validation}>
          {({values, handleChange, handleSubmit, handleBlur, errors}) => (
            <View style={styles.card}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={values['password']}
                onBlur={handleBlur('password')}
                onChangeText={handleChange('password')}
                style={[styles.input,{borderColor: errors['password'] ? "crimson":"#cacaca" }]}
              />
              {/* <Text style={styles.error}>{errors['firstName']}</Text> */}

              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[styles.input,{borderColor: errors['confirmPassword'] ? "crimson":"#cacaca" }]}
                value={values['confirmPassword']}
                onBlur={handleBlur('confirmPassword')}
                onChangeText={handleChange('confirmPassword')}
              />
              {/* <Text style={styles.error}>{errors['lastName']}</Text> */}

              <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                <Text style={styles.btnText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  error: {
    alignSelf: 'flex-end',
    fontSize: 13,
    color: 'crimson',
    marginHorizontal: 5,
  },
  btn: {
    width: 100,
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderRadius: 5,
    margin: 5,
    backgroundColor: colors.iondigoDye,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  card: {
    marginVertical: 10,
    marginHorizontal: 5,
    padding: 5,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    // borderColor: '#cacaca',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginVertical: 5,
  },
});
