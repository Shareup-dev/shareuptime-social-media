import React, {useContext, useEffect, useState} from 'react';
import {View,TouchableOpacity, StyleSheet, Text, TextInput} from 'react-native';
import AuthContext from '../../Contexts/authContext';
import {HeaderWithBackArrow} from '../../components/headers';
import Loading from '../../components/Loading';
import colors from '../../config/colors';
import profileService from '../../services/profile.service';
import userService from '../../services/user.service';

export default function ManageEmail({navigation, route}) {
  const {title, value} = route.params;

  const [loading, setLoading] = useState({state: false, content: 'Loading...'});
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [otp, setOtp] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);
  const [error, setError] = useState('');

  const {
    userState: {userData},
    authActions,
  } = useContext(AuthContext);

  useEffect(() => {
    const checkOptEmailStatus = () => {
      userService
        .checkOptEmailVerified(userData.id)
        .then(({data}) => setEmailStatus(data))
        .catch(e => console.error(e.message));
    };
    checkOptEmailStatus();
  }, []);

  const removeOptionalEmail = () => {
    setLoading({state: true, content: 'Deleting..'});
    profileService
      .removeOptionalEmail(userData.id)
      .then(async ({status}) => {
        if (status === 200) {
          await authActions.updateUserInfo({...userData, optional_email: ''});
          navigation.goBack();
        }
      })
      .catch(e => console.error(e))
      .finally(_ => setLoading(prev => ({...prev, state: false})));
  };

  const verifyEmail = () => {
    setLoading({state: true, content: 'Sending OTP..'});

    profileService
      .sendOTPtoVerifyEmail(userData.id)
      .then(({status}) => status === 200 && setEmailVerifying(true))
      .catch(e => console.error(e.message))
      .finally(_ => setLoading(prev => ({...prev, state: false})));
  };

  const verifyOTP = _ => {
    setLoading({state: true, content: 'Verifying..'});

    profileService
      .verifyOTP(userData.id, otp)
      .then(res => res)
      .catch(({response: {status, data}}) => {
        if (status === 400) setError('Wrong OPT');
      })
      .finally(_ => setLoading(prev => ({...prev, state: false})));
  };
  return (
    <>
      <View style={styles.container}>
        <HeaderWithBackArrow
          onBackButton={_ => navigation.goBack()}
          title={title}
        />
        {loading.state && <Loading text={loading.content} modal />}
        <View style={styles.body}>
          <Text style={styles.title}>{value}</Text>
          <Text>{emailStatus ? 'Verified' : 'Pending'}</Text>
          {!emailVerifying && (
            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
              {emailStatus ? (
                <TouchableOpacity style={styles.btn}>
                  <Text style={{color: '#fff', fontWeight: '700'}}>
                    Make it Primary
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={verifyEmail} style={styles.btn}>
                  <Text style={{color: '#fff', fontWeight: '700'}}>
                    Verify
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={removeOptionalEmail}
                style={[styles.btn, {backgroundColor: 'crimson'}]}>
                <Text style={{color: '#fff', fontWeight: '700'}}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {emailVerifying && (
          <View style={styles.body}>
            <View style={styles.card}>
              <Text style={{textAlign: 'center', marginVertical: 10}}>
                Shareup has sent you a verification code to the email
              </Text>
              <View style={{alignItems: 'center'}}>
                <Text
                  style={[styles.label, {color: error ? 'crimson' : '#333'}]}>
                  {error ? error : `Verification code`}
                </Text>
                <TextInput
                  value={otp}
                  onChangeText={val => {
                    setOtp(val);
                    setError('');
                  }}
                  maxLength={6}
                  style={[
                    styles.input,
                    {
                      borderColor: error ? 'crimson' : '#cacaca',
                      minWidth: 150,
                      textAlign: 'center',
                    },
                  ]}
                />
              </View>

              <Text style={{textAlign: 'center'}}>
                Verification code will expire after 5 minutes
              </Text>
              <TouchableOpacity
                activeOpacity={0.6}
                style={{
                  marginVertical: 5,
                  backgroundColor: '#cacaca60',
                  paddingHorizontal: 15,
                  paddingVertical: 6,
                  borderRadius: 30,
                  width: 100,
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{color: colors.iondigoDye, fontWeight: '700'}}
                  onPress={verifyEmail}>
                  Re-send
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn]}
                disabled={otp.length < 6}
                onPress={verifyOTP}>
                <Text style={styles.btnText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.iondigoDye,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 3,
    marginVertical: 10,
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  body: {
    marginTop: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    // borderColor: '#cacaca',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginVertical: 5,
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
  },
});
