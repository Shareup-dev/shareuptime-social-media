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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Loading from '../../components/Loading';
import userService from '../../services/user.service';

export default function UpdateDOB({navigation}) {
  const {
    userState: {userData, username},
    authActions,
  } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [dob, setDOB] = useState(
    userData.birthday_date ? new Date(userData.birthday_date) : new Date(),
  );

  const handleSubmit = _ => {
    setLoading(true);
    Keyboard.dismiss();
    userService
      .editProfile(username, {...userData, birthday_date: dob.toDateString()})
      .then(({status, data}) => {
        if (status === 200) {
          authActions.updateUserInfo(data);
          setLoading(false);
          navigation.goBack();
        }
      })
      .catch(e => console.error(e.message));
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDOB(date);
    hideDatePicker();
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <HeaderWithBackArrow
        onBackButton={_ => navigation.goBack()}
        title="Date of Birth"
      />
      {loading && <Loading text="Saving.." modal />}
      <TouchableOpacity
        activeOpacity={1}
        style={{flex: 1}}
        onPress={_ => Keyboard.dismiss()}>
        <View style={styles.card}>
          <Text style={styles.label}>Date of birth</Text>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            date={dob}
            maximumDate={new Date()}
            onCancel={hideDatePicker}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={showDatePicker}>
              <Text
                style={{
                  margin: 5,
                  fontSize: 18,
                  fontWeight: '700',
                }}>
                {dob.toDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
              <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    padding: 15,
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
