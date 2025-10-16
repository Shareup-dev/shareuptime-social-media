import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import Screen from '../components/Screen';
import Icon from '../components/Icon';
import AppTextInput from '../components/TextInput';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import ChoosePrivacyDrawer from '../components/drawers/ChoosePrivacyDrawer';
import { Header, HeaderCloseIcon, HeaderTitle } from '../components/headers';

import * as Yup from 'yup';
import { Formik } from 'formik';
import GroupService from '../services/group.service';
import routes from '../navigation/routes';

export default function EditGroup({ navigation, route }) {
  const groupData = route?.params;
  const [privacy, setPrivacy] = useState(groupData?.privacySetting);
  const [isPrivacyDrawerVisible, setIsPrivacyDrawerVisible] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    description: Yup.string().required().min(3).label('Description'),
    // privacySetting: Yup.string().required().label('Privacy option'),
  });

  const handleEdit = (values) => {
    GroupService.editGroup(groupData.id, {
      ...values,
      privacySetting: privacy,
    })
      .then(async (res) => {
        if (res.status === 200) {
          navigation.navigate({
            name: routes.GROUP_FEED,
            params: res.data,
            merge: true,
          });
        }
      })
      .catch((e) => console.error(e));
  };

  return (
    <Formik
      initialValues={{
        name: groupData.name,
        description: groupData.description,
        privacySetting: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleEdit}
    >
      {({ setFieldValue, handleSubmit, handleBlur, errors, values }) => {
        return (
          <>
            <Screen>
              <Header
                left={<HeaderCloseIcon onPress={() => navigation.goBack()} />}
                middle={<HeaderTitle>Edit Group</HeaderTitle>}
                right={
                  <TouchableOpacity onPress={handleSubmit}>
                    <Text>Save</Text>
                  </TouchableOpacity>
                }
              />
              <View style={styles.container}>
                <ScrollView>
                  <View style={styles.input}>
                    <Text style={styles.title}>Name</Text>
                    <Text style={styles.subTitle}>
                      Type useful name so that it can be searched easily
                    </Text>
                    <AppTextInput
                      style={styles.inputField}
                      backgroundColor={'white'}
                      onChangeText={(val) => setFieldValue('name', val)}
                      onBlur={() => handleBlur('name')}
                      value={values.name}
                      error={errors.name}
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
                      onChangeText={(val) => setFieldValue('description', val)}
                      onBlur={() => handleBlur('description')}
                      value={values.description}
                      style={[styles.inputField, styles.groupDescription]}
                    />
                    <Text
                      style={{
                        color: 'crimson',
                        textAlign: 'right',
                        paddingHorizontal: 30,
                      }}
                    >
                      {errors.description}
                    </Text>
                  </View>
                  <View
                    onTouchEnd={() => {
                      setIsPrivacyDrawerVisible(!isPrivacyDrawerVisible);
                    }}
                    style={styles.input}
                  >
                    <Text style={styles.title}>Privacy</Text>
                    <Text style={styles.subTitle}>Choose the privacy setting of group</Text>
                    <View style={[styles.privacySelector, { width: '88%', marginHorizontal: 30 }]}>
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
                </ScrollView>
              </View>

              <ChoosePrivacyDrawer
                setPrivacy={setPrivacy}
                isVisible={isPrivacyDrawerVisible}
                setIsVisible={setIsPrivacyDrawerVisible}
              />
            </Screen>
          </>
        );
      }}
    </Formik>
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
