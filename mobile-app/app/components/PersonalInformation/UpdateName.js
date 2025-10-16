import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AuthContext from '../../Contexts/authContext';
import { HeaderWithBackArrow } from '../../components/headers';
import colors from '../../config/colors';
import * as Yup from 'yup';
import Loading from '../../components/Loading';
import userService from '../../services/user.service';

export default function UpdateName({ navigation }) {
  const {
    userState: { userData, username },
    authActions,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const handleSubmit = (values) => {
    setLoading(true);
    Keyboard.dismiss();
    userService
      .editProfile(username, values)
      .then(({ status, data }) => {
        if (status === 200) {
          authActions.updateUserInfo(data);
          setLoading(false);
          navigation.goBack();
        }
      })
      .catch((e) => console.error(e.message));
  };

  const validation = Yup.object().shape({
    firstName: Yup.string().required().label('First name'),
    lastName: Yup.string().required().label('Last name'),
  });

  return (
    <KeyboardAvoidingView style={styles.container}>
      <HeaderWithBackArrow onBackButton={(_) => navigation.goBack()} title="Name" />
      {loading && <Loading text="Saving.." modal />}
      <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={(_) => Keyboard.dismiss()}>
        <Formik initialValues={userData} onSubmit={handleSubmit} validationSchema={validation}>
          {({ values, handleChange, handleSubmit, handleBlur, errors }) => (
            <View style={styles.card}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                value={values.firstName}
                onBlur={handleBlur('firstName')}
                onChangeText={handleChange('firstName')}
                style={[styles.input, { borderColor: errors.firstName ? 'crimson' : '#cacaca' }]}
              />
              {/* <Text style={styles.error}>{errors['firstName']}</Text> */}

              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={[styles.input, { borderColor: errors.lastName ? 'crimson' : '#cacaca' }]}
                value={values.lastName}
                onBlur={handleBlur('lastName')}
                onChangeText={handleChange('lastName')}
              />
              {/* <Text style={styles.error}>{errors['lastName']}</Text> */}

              <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                <Text style={styles.btnText}>Update</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
