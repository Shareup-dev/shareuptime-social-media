import { StyleSheet, Platform, View, TextInput } from 'react-native';

import Screen from '../components/Screen';
import { Header, HeaderButton, HeaderTitle } from '../components/headers';
import Separator from '../components/Separator';
import React, { useContext, useState } from 'react';
import colors from '../config/colors';
import authContext from '../authContext';
import LinkButton from '../components/buttons/LinkButton';
import Section from '../components/Section';
import TextField from '../components/TextField';
import { ScrollView } from 'react-native-gesture-handler';
import UserService from '../services/user.service';
import EncryptedStorage from 'react-native-encrypted-storage';
import { ToastAndroid, TouchableOpacity, Image } from 'react-native';
import useImagePicker from '../hooks/useImagePicker';
import settings from '../config/settings';

export default function EditProfileScreen({ navigation }) {
  const { user, setUser } = useContext(authContext);
  // Call hook but ignore returned values (unused)
  useImagePicker();
  // const [displayImage, setDisplayImage] = useState(false);
  const [enteredBio, setEnteredBio] = useState(user.aboutme);
  const [enteredCurrenttown, setEnteredCurrenttown] = useState(user.currenttown);
  const [enteredhometown, setEnteredhometown] = useState(user.hometown);
  const [enteredRelation, setEnteredRelation] = useState(user.relationshipstatus);
  const [enteredinterests, setEnteredinterests] = useState(user.interests);
  const [imageVal] = useState(settings.apiUrl + user.profilePicturePath);
  const [imageFile] = useState(null);

  // const addImage = async () => {
  //   const _image = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     quality: 0.5,
  //   });

  //   if (!_image.cancelled) {
  //     setImage(_image.uri);
  //     setSelectedImageFile(_image);
  //   }
  // };

  async function EditProfileImagw() {
    const formData = new FormData();
    formData.append('profilePicture', {
      name: 'profilePicture2',
      type: 'image/jpg',
      uri: imageFile.uri,
    });

    await UserService.uploadProfilePicture(user.email, formData).then(async (res) => {
      if (res.data) {
        setUser(res.data);
        await EncryptedStorage.setItem('user', JSON.stringify(res.data));
        showToast();
      }
    });
  }
  async function EditUser() {
    await UserService.editProfile(user.email, user).then(async (res) => {
      if (res.data) {
        setUser(res.data);
        await EncryptedStorage.setItem('user', JSON.stringify(res.data));
        showToast();
      }
    });
  }

  const showToast = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Profile Edit Successfully',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };
  // getUser();

  // function sendValues(enteredBio) {}
  function callFun() {
    // addImage();
  }
  return (
    <Screen style={styles.container}>
      {/** Header */}
      <Header
        left={
          <View style={styles.leftAndRight}>
            <HeaderButton title="Cancel" isActive={true} onPress={() => navigation.goBack()} />
          </View>
        }
        middle={<HeaderTitle titleStyle={styles.headerTitle}>Edit Profile</HeaderTitle>}
        right={
          <View style={styles.leftAndRight}>
            <HeaderButton title="Done" isActive={true} />
          </View>
        }
        backgroundColor={colors.white}
        headerContainerStyle={styles.header}
      />
      <ScrollView>
        {/** Content */}
        <View style={styles.content}>
          {/** Section 1 */}
          <Section
            title="Edit Profile"
            onAdd={() => {
              user.profilePicturePath = imageVal;
              EditProfileImagw();
            }}
          >
            <TouchableOpacity onPress={callFun}>
              <Image
                source={{ uri: imageVal }}
                style={[
                  { width: 100, height: 100, borderRadius: 100 / 2 },
                  styles.userProfilePicture,
                ]}
              />
            </TouchableOpacity>
          </Section>

          <Separator />
          {/** Section 2 */}
          <Section
            title="Bio"
            onAdd={() => {
              user.aboutme = enteredBio;
              EditUser();
            }}
          >
            <TextInput
              placeholder="Describe yourself..."
              textAlign="center"
              multiline
              placeholderTextColor={colors.mediumGray}
              value={enteredBio}
              onChangeText={(text) => setEnteredBio(text)}
            />
          </Section>

          <Separator />
          {/** Section 3 */}
          <Section
            title="Details"
            onAdd={() => {
              user.currenttown = enteredCurrenttown;
              user.hometown = enteredhometown;
              user.relationshipstatus = enteredRelation;
              EditUser();
            }}
          >
            <TextField
              placeholder="Current town / city"
              iconImage={require('../assets/icons/home-icon.png')}
              backgroundColor={colors.white}
              value={enteredCurrenttown}
              onChangeText={(text) => setEnteredCurrenttown(text)}
            />

            <TextField
              placeholder="Home town"
              iconImage={require('../assets/icons/location-icon.png')}
              backgroundColor={colors.white}
              value={enteredhometown}
              onChangeText={(text) => setEnteredhometown(text)}
            />
            <TextField
              placeholder="Relationship status"
              iconImage={require('../assets/icons/double-heart-icon.png')}
              backgroundColor={colors.white}
              value={enteredRelation}
              onChangeText={(text) => setEnteredRelation(text)}
            />
          </Section>

          <Separator />
          {/** Section 4 */}
          <Section
            title="Hobbies"
            onAdd={() => {
              user.interests = enteredinterests;
              EditUser();
            }}
          >
            <TextInput
              placeholder="Add your hobbies..."
              textAlign="center"
              multiline
              placeholderTextColor={colors.mediumGray}
              value={enteredinterests}
              onChangeText={(text) => setEnteredinterests(text)}
            />
          </Section>

          <Separator />

          <LinkButton
            title=" Switch to professional account"
            fontSize={18}
            style={styles.linkButtons}
          />
          <Separator />

          <LinkButton
            title=" Professional information settings"
            fontSize={18}
            style={styles.linkButtons}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
  },
  leftAndRight: {
    marginBottom: 2,
  },
  content: {
    flex: 1,
  },
  textField: {
    alignSelf: 'center',
  },
  linkButtons: {
    margin: 10,
  },
  userProfilePicture: {
    alignSelf: 'center',
  },
});
