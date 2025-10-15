import {Formik} from 'formik';
import React, {useContext, useState} from 'react';
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
import {HeaderWithBackArrow} from '../../components/headers';
import colors from '../../config/colors';
import * as Yup from 'yup';
import Loading from '../../components/Loading';
import userService from '../../services/user.service';
import {RadioButton} from 'react-native-paper';

export default function UpdateGender({navigation}) {
  const {
    userState: {
      userData: {gender, ...rest},
      username,
    },
    authActions,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(gender);

  const handleSubmit = () => {
    setLoading(true);
    Keyboard.dismiss();
    userService
      .editProfile(username, {...rest, gender: checked})
      .then(({status, data}) => {
        if (status === 200) {
          authActions.updateUserInfo(data);
          setLoading(false);
          navigation.goBack();
        }
      })
      .catch(e => console.error(e.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <HeaderWithBackArrow
        onBackButton={_ => navigation.goBack()}
        title="Gender"
      />
      {loading && <Loading text="Saving.." modal />}
      <View style={{flex: 1}}>
        <View style={styles.card}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity
            onPress={() => setChecked('Male')}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioButton
              value="Male"
              onPress={() => setChecked('Male')}
              status={checked === 'Male' ? 'checked' : 'unchecked'}
              color={colors.iondigoDye}
            />
            <Text style={{fontSize: 16, fontWeight: '600'}}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setChecked('Female')}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioButton
              value="Female"
              onPress={() => setChecked('Female')}
              color={colors.iondigoDye}
              status={checked === 'Female' ? 'checked' : 'unchecked'}
            />
            <Text style={{fontSize: 16, fontWeight: '600'}}>Female</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 10,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
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
