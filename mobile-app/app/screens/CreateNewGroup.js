import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import Screen from '../components/Screen';
import AppButton from '../components/buttons/Button';
import Icon from '../components/Icon';
import AppTextInput from '../components/TextInput';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import routes from '../navigation/routes';
import ChoosePrivacyDrawer from '../components/drawers/ChoosePrivacyDrawer';
import {Header, HeaderCloseIcon, HeaderTitle} from '../components/headers';

import * as Yup from 'yup';
import {Formik} from 'formik';
import GroupService from '../services/group.service';
import AuthContext from '../authContext';

export default function CreateNewGroup({navigation}) {
  const [privacy, setPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPrivacyDrawerVisible, setIsPrivacyDrawerVisible] = useState(false);

  const {userData} = useContext(AuthContext).userState;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    description: Yup.string().required().min(3).label('Description'),
    // privacySetting: Yup.string().required().label('Privacy option'),
  });

  const handleSubmit = values => {
    setLoading(true);
    GroupService.createGroup(userData.id, {
      ...values,
      privacySetting: privacy,
    })
      .then(res => navigation.navigate(routes.SET_GROUP_PHOTO, res.data))
      .catch(e => console.error(e))
      .finally(_ => setLoading(false));
  };

  return (
    <Screen>
      <Header
        left={<HeaderCloseIcon onPress={() => navigation.goBack()} />}
        middle={<HeaderTitle>Create Group</HeaderTitle>}
      />
      <View style={styles.container}>
        <ScrollView>
          <Formik
            initialValues={{
              name: '',
              description: '',
              privacySetting: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({setFieldValue, handleSubmit, handleBlur, errors, values}) => {
              return (
                <>
                  <View style={styles.input}>
                    <Text style={styles.title}>Name</Text>
                    <Text style={styles.subTitle}>
                      Type useful name so that it can be searched easily
                    </Text>
                    <AppTextInput
                      style={styles.inputField}
                      backgroundColor={'white'}
                      onChangeText={val => setFieldValue('name', val)}
                      onBlur={() => handleBlur('name')}
                      value={values['name']}
                      error={errors['name']}
                    />
                  </View>
                  <View style={styles.input}>
                    <Text style={styles.title}>Description</Text>
                    <Text style={styles.subTitle}>
                      Describe your group so people know what it’s about.
                    </Text>
                    <TextInput
                      multiline={true}
                      numberOfLines={10}
                      onChangeText={val => setFieldValue('description', val)}
                      onBlur={() => handleBlur('description')}
                      value={values['description']}
                      style={[styles.inputField, styles.groupDescription]}
                    />
                    <Text
                      style={{
                        color: 'crimson',
                        textAlign: 'right',
                        paddingHorizontal: 30,
                      }}>
                      {errors['description']}
                    </Text>
                  </View>
                  <View
                    onTouchEnd={() => {
                      setIsPrivacyDrawerVisible(!isPrivacyDrawerVisible);
                    }}
                    style={styles.input}>
                    <Text style={styles.title}>Privacy</Text>
                    <Text style={styles.subTitle}>
                      Choose the privacy setting of group
                    </Text>
                    <View
                      style={[
                        styles.privacySelector,
                        {width: '88%', marginHorizontal: 30},
                      ]}>
                      <View style={defaultStyles.row}>
                        <Icon
                          type={!privacy ? 'Entypo' : 'Ionicons'}
                          name={!privacy ? 'globe' : 'lock-closed'}
                        />
                        <Text>{!privacy ? 'Public' : 'Private'}</Text>
                      </View>
                      <Icon type={'AntDesign'} size={35} name={'caretdown'} />
                    </View>
                  </View>
                  {/* <View
                    onTouchEnd={() => {
                      setIsPrivacyDrawerVisible(!isPrivacyDrawerVisible);
                    }}
                    style={styles.input}>
                    <Text style={styles.title}>Hide group</Text>
                    <Text style={styles.subTitle}>
                      Choose the who can find the group
                    </Text>
                    <View
                      style={[
                        styles.privacySelector,
                        {width: '88%', marginHorizontal: 30},
                      ]}>
                      <View style={defaultStyles.row}>
                        <Icon
                          type={privacy === 'Public' ? 'Entypo' : 'Ionicons'}
                          name={privacy === 'Public' ? 'globe' : 'lock-closed'}
                        />
                        <Text>{privacy}</Text>
                      </View>
                      <Icon type={'AntDesign'} size={35} name={'caretdown'} />
                    </View>
                  </View> */}

                  <AppButton
                    title={'Next'}
                    width={'50%'}
                    style={{alignSelf: 'center', marginTop: 20}}
                    onPress={handleSubmit}
                    disabled={loading}
                  />
                </>
              );
            }}
          </Formik>
        </ScrollView>
      </View>

      <ChoosePrivacyDrawer
        setPrivacy={setPrivacy}
        isVisible={isPrivacyDrawerVisible}
        setIsVisible={setIsPrivacyDrawerVisible}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  inputField: {
    borderWidth: 1,
    width: '100%',
    height: 50,
    borderRadius: 8,
    color: 'black',
    paddingHorizontal: 15,
    fontSize: 18,
    borderColor: colors.grayX11Gray,
  },

  icon: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    paddingHorizontal: 30,
  },
  subTitle: {
    paddingHorizontal: 30,
    color: colors.mediumGray,
    fontSize: 18,
    marginBottom: 15,
  },
  groupDescription: {
    width: '88%',
    marginHorizontal: 30,
    textAlignVertical: 'top',
    height: 150,
    paddingTop: 10,
  },
  privacySelector: {
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderColor: colors.grayX11Gray,
  },
  privacySheet: {
    // backgroundColor: colors.lighterGray,
    position: 'absolute',
    bottom: 0,
    elevation: 3,
    zIndex: 1,
    width: '100%',
    padding: 15,
    paddingHorizontal: 30,
    height: 120,
    justifyContent: 'space-between',
    // elevation:1
  },
});
