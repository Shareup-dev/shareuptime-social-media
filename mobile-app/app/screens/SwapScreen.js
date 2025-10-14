import React, {useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

import {Header, HeaderTitle, HeaderCloseIcon} from '../components/headers';
import Tab from '../components/buttons/Tab';
import Separator from '../components/Separator';
import LinkButton from '../components/buttons/LinkButton';
import colors from '../config/colors';
import Screen from '../components/Screen';
import {launchImageLibrary,launchCamera} from 'react-native-image-picker';
import routes from '../navigation/routes';

export default function SwapScreen({navigation, route}) {
  // const [imageUri, setImageUri] = useState('');
  const [file, setFile] = useState({});
  const imagePickHandler = () => {
    launchImageLibrary({
      quality: 0.5,
      mediaType: 'photo',
      selectionLimit: 1,
    }).then(({didCancel, assets}) => {
      if (!didCancel) {
        setFile(assets[0]);
        navigation.navigate(routes.SWAP_DISPLAY, {
          swapImage: assets[0].uri,
          returnSwap: route.params?.returnSwap
            ? route.params.returnSwap
            : false,
          swapPostId: route.params?.swapPostId,
        });
      }
    });
  };
  const imageCaptureHandler = () => {
    launchCamera({
      quality: 0.5,
      cameraType:'back',
      mediaType:'photo',

      
    }).then(({didCancel, assets}) => {
      if (!didCancel) {
        setFile(assets[0]);
        navigation.navigate(routes.SWAP_DISPLAY, {
          swapImage: assets[0].uri,
          returnSwap: route.params?.returnSwap
            ? route.params.returnSwap
            : false,
          swapPostId: route.params?.swapPostId,
        });
      }
    });
  };
  return (
    <Screen>
      {/** Header */}
      <Header
        left={<HeaderCloseIcon onPress={() => navigation.goBack()} />}
        middle={<HeaderTitle>Let's Swap</HeaderTitle>}
      />
      {/** Contact */}
      <View style={styles.content}>
        <View style={styles.upperContainer}>
          <Text style={styles.text}>
            To swap you will have to provide clear image of the object you want
            swap
          </Text>

          <Image
            source={require('../assets/icons/swap-square-dashed.png')}
            style={styles.image}
          />
        </View>

        <View style={styles.lowerContainer}>
          <Tab
            title="Let's take picture"
            color={colors.iondigoDye}
            style={styles.button}
            titleStyle={styles.buttonTitleStyle}
            onPress={imageCaptureHandler}
          />
          <Separator text="or" style={styles.separator} />
          <LinkButton
            title="Already have image?"
            fontSize={14}
            style={styles.linkButton}
          />
          <Tab
            title="Continue"
            color={colors.iondigoDye}
            style={styles.button}
            titleStyle={styles.buttonTitleStyle}
            onPress={imagePickHandler}
          />
        </View>
        {/* <Tab
          title="Proceed"
          color={colors.iondigoDye}
          style={styles.button}
          titleStyle={styles.buttonTitleStyle}
          onPress={() => {
            navigation.navigate(routes.SWAP_DISPLAY, { image: file.uri });
          }}
        /> */}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 40,
  },
  lowerContainer: {
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  button: {
    height: 40,
  },
  buttonTitleStyle: {
    fontWeight: 'bold',
    color: colors.white,
  },
  linkButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  separator: {
    marginVertical: 20,
  },
});
