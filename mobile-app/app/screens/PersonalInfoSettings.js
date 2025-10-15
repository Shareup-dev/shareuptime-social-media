import React, {useContext} from 'react';
import {View, StyleSheet, Text, Dimensions, TextInput, TouchableOpacity} from 'react-native';
import AuthContext from '../Contexts/authContext';
import HeaderWithBackArrow from '../components/headers/HeaderWithBackArrow';
import routes from '../navigation/routes';

export default function PersonalInfoSettings({navigation}) {
  const {
    userState: {userData:{firstName,lastName,email,gender,birthday_date}},
  } = useContext(AuthContext);

  function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

  return (
    <View style={styles.container}>
      <HeaderWithBackArrow
        onBackButton={_ => navigation.goBack()}
        title="Personal Information"
      />
      <View style={styles.bodyContainer}>
        <Text>
          Provide your personal information, even if the account is used for a
          business, This won't be part of your public profile.
        </Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.formGroup} onPress={_=> navigation.navigate(routes.UPDATE_NAME)} >
            <Text style={styles.label}>Name</Text>
            <Text  style={styles.input} >{`${firstName} ${lastName}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.formGroup} onPress={_=> navigation.navigate(routes.UPDATE_EMAIL)} >
            <Text style={styles.label}>Email</Text>
            <Text  style={styles.input} >{email}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.formGroup}>
            <Text style={styles.label}>Phone number</Text>
            <Text  style={styles.input} >{lastName}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.formGroup} onPress={_=> navigation.navigate(routes.UPDATE_GENDER)} >
            <Text style={styles.label}>Gender</Text>
            <Text  style={styles.input} >{gender}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.formGroup} onPress={_=> navigation.navigate(routes.UPDATE_DOB)} >
            <Text style={styles.label}>Date of Birth</Text>
            <Text  style={styles.input} >{birthday_date ? `${birthday_date} (${calculateAge(new Date(birthday_date))} Years)`: `Please add your Date of Birth`}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formGroup: {},
  label: {
    fontSize: 17,
    fontWeight: '800',
},
input: {
      fontSize: 16,
      margin:5,
      paddingLeft:5
  },
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15 ,
    marginTop: 5,
    borderRadius: 5,
  },
  bodyContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
});
