import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

import Screen from '../components/Screen';
import Icon from '../components/Icon';
import useImagePicker from '../hooks/useImagePicker';

import routes from '../navigation/routes';
import defautlStyles from '../config/styles';
import colors from '../config/colors';
import { Header, HeaderTitle } from '../components/headers';
import Toast from 'react-native-toast-message';

import groupService from '../services/group.service';

const UpdateGroupPhoto = ({ navigation, route }) => {
  const groupData = route.params;

  const [loading, setLoading] = useState(false);

  const { file = [], pickImage } = useImagePicker();

  const proceedHandler = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const groupFormData = new FormData();

    if (file[0]?.uri) {
      groupFormData.append('group_image', {
        name: file[0].fileName,
        type: file[0].type,
        uri: file[0].uri,
      });
    }
    groupService
      .addGroupImage(groupData.id, groupFormData)
      .then(
        (resp) =>
          resp.status === 200 &&
          navigation.navigate({
            name: routes.GROUP_FEED,
            params: resp.data,
            merge: true,
          }),
      )
      .catch((_e) =>
        Toast.show({
          position: 'bottom',
          visibilityTime: 5000,
          type: 'error',
          text1: 'Error',
          text2: 'Error occurred while creating the group 😒',
        }),
      )
      .finally((_) => setLoading(false));
  };

  return (
    <Screen>
      <Header
        backgroundColor={colors.white}
        left={
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" type="Ionicons" size={25} backgroundSizeRatio={1} />
          </TouchableWithoutFeedback>
        }
        middle={<HeaderTitle>Change Group Photo</HeaderTitle>}
        right={
          <TouchableOpacity disabled={loading} onPress={proceedHandler}>
            <Text>{loading ? 'Saving' : 'Save'}</Text>
          </TouchableOpacity>
        }
      />
      <Text style={styles.title}>Add Group Cover photo</Text>
      <Text style={styles.subTitle}>
        Give people an idea of what your group is about with a photo
      </Text>
      <View style={styles.photoContainer}>
        {!file[0]?.uri && (
          <TouchableOpacity style={[defautlStyles.row, styles.uploadButton]} onPress={pickImage}>
            <Icon type={'FontAwesome'} size={50} name={'photo'} style={{ marginRight: 10 }} />
            <Text>Upload cover photo</Text>
          </TouchableOpacity>
        )}
        {file[0]?.uri && (
          <View onTouchEnd={pickImage}>
            <Image style={styles.groupPhoto} source={file[0]} />
          </View>
        )}
      </View>
      {file[0]?.uri && (
        <Text style={[styles.subTitle]}>Touch on the image to change if needed</Text>
      )}
    </Screen>
  );
};

export default UpdateGroupPhoto;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    marginTop: 50,
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
  uploadButton: {
    backgroundColor: colors.lighterGray,
    padding: 10,
    borderRadius: 7,
  },
  photoContainer: {
    margin: 25,
    borderWidth: 1,
    borderColor: colors.grayX11Gray,
    height: 200,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:'coral'
  },
  groupPhoto: {
    // width: 250,
    height: 200,
    width: Dimensions.get('screen').width - 40,
  },
});
