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
import Icon from '../../components/Icon';
import profileService from '../../services/profile.service';
import routes from '../../navigation/routes';

export default function UpdateEmail({navigation}) {
  const {
    userState: {userData, username},
    authActions,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState({state: false, content: 'Loading..'});
  const [verifying, setVerifying] = useState(false);
  const [optionalEmail, setOptionalEmail] = useState('');
  const [step, setStep] = useState(0);

  const Validation = Yup.object().shape({
    email: Yup.string().email().label('Email').required(),
  });

  const handleSubmit = values => {
    setLoading(prev => ({...prev, state: true}));
    userService
      .editProfile(username, values)
      .then(({status, data}) => {
        if (status === 200) {
          authActions.updateUserInfo(data);
          setLoading(prev => ({...prev, state: false}));
          navigation.goBack();
        }
      })
      .catch(e => console.error(e.message));
  };

  const sendOtp = ({email}) => {
    if (!email) {
      return;
    }
    setVerifying(true);

    profileService
      .sendOTPtoVerifyEmail(userData.id, {email: email})
      .then(res => res)
      .catch(e => console.error(e))
      .finally(_ => setVerifying(false));
  };

  const addOptionalEmail = ({email}) => {
    setLoading(prev => ({content: 'Saving', state: true}));
    profileService
      .addOptionalEmail(userData.id, email)
      .then(({status}) => {
        if (status === 200) {
           authActions.updateUserInfo({
            ...userData,
            optional_email: email,
          });
        }
      })
      .catch(e => e.message)
      .finally(_ => setLoading(prev => ({...prev, state: false})));
  };

  return (
    <View style={styles.container}>
      <HeaderWithBackArrow
        onBackButton={_ => navigation.goBack()}
        title="Email"
      />
      {loading.state && <Loading text={loading.content} modal />}
      <TouchableOpacity activeOpacity={1} style={{flex: 1}}>
        <View style={styles.card}>
          <TouchableOpacity
            // onPress={_ =>
            //   navigation.navigate(routes.MANAGE_EMAIL, {
            //     value: userData.email,
            //     title: 'Primary Email',
            //   })
            // }
            activeOpacity={1}
            style={{
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon name={'email'} color="#fff" backgroundColor="#333333" />
              <View style={{marginLeft: 10}}>
                <Text style={styles.label}>Primary Email</Text>
                <Text>{userData.email}</Text>
              </View>
            </View>
            {/* <Icon name={'chevron-right'} noBackground size={55} /> */}
          </TouchableOpacity>

          {userData.optional_email ? (
            <TouchableOpacity
              onPress={_ =>
                navigation.navigate(routes.MANAGE_EMAIL, {
                  value: userData.optional_email,
                  title: 'Secondary Email',
                })
              }
              style={{
                marginVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row'}}>
                {/* <Icon name={'email'} color="#fff" backgroundColor="#333333" /> */}
                <View style={{marginLeft: 10}}>
                  <Text style={styles.label}>Secondary Email</Text>
                  <Text>{userData.optional_email}</Text>
                </View>
              </View>
              <Icon name={'chevron-right'} noBackground size={55} />
            </TouchableOpacity>
          ) : (
            <Formik
              initialValues={{email: ''}}
              onSubmit={addOptionalEmail}
              // validateOnChange={false}
              validationSchema={Validation}>
              {({handleChange, handleBlur, values, handleSubmit, errors}) => (
                <>
                  <Text style={styles.label}>Secondary Email</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {borderColor: errors['email'] ? 'crimson' : '#cacaca'},
                    ]}
                    value={values['email']}
                    onBlur={handleBlur('email')}
                    keyboardType="email-address"
                    onChangeText={handleChange('email')}
                  />

                  <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                    <Text style={styles.btnText}>Add Email</Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          )}
        </View>
      </TouchableOpacity>
    </View>
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
    // alignSelf: 'flex-end',
    marginVertical: 10,
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
    fontSize: 15,
    color: '#242424',
    fontWeight: '800',
  },
  input: {
    // borderColor: '#cacaca',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginVertical: 5,
  },
});
