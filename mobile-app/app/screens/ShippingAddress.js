import React from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import AppButton from '../components/buttons/Button';
import { Header, HeaderCloseIcon, HeaderTitle } from '../components/headers';
import Screen from '../components/Screen';
import colors from '../config/colors';
import routes from '../navigation/routes';
import store from '../redux/store';
import { swapedImagesAction } from '../redux/swapedImages';

const ShippingAddress = ({ navigation, route }) => {
  return (
    <Screen>
      <Header
        left={
          <HeaderCloseIcon
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
        middle={<HeaderTitle>Shipping Address</HeaderTitle>}
      />
      <View>
        <Text style={styles.title}>Please provide your address</Text>
        <Text style={styles.subTitle}>So that we can deliver the item to your door step</Text>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/icons/googleMapsIcon.png')} />
        </View>
        <Text style={styles.subTitle}>Please allow the location when prompted</Text>
        <View style={styles.phoneNumberContainer}>
          <Text style={styles.counteryCode}>QA +974</Text>
          <TextInput
            keyboardType={'phone-pad'}
            maxLength={8}
            placeholder={'Enter your mobile number'}
          />
        </View>
        <AppButton
          onPress={() => {
            navigation.navigate(routes.SWAP_CHECKOUT, {
              swapedPostId: route.params.swapedPostId,
            });
          }}
          style={styles.payButton}
          title={"Let's Pay"}
          width={'70%'}
        />
        <Text style={styles.partners}>See your partners</Text>
      </View>
    </Screen>
  );
};

export default ShippingAddress;
const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 20,
    marginVertical: 20,
  },
  subTitle: {
    fontSize: 20,
    color: colors.LightGray,
    textAlign: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  counteryCode: {
    fontSize: 16,
    fontWeight: '400',
    marginRight: 20,
  },
  phoneNumberContainer: {
    borderWidth: 1,
    borderColor: colors.LightGray,
    padding: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    marginHorizontal: '15%',
    borderRadius: 8,
    marginVertical: 10,
    height: 50,
  },
  payButton: {
    borderRadius: 12,
    marginVertical: 50,
    marginHorizontal: '15%',
  },
  partners: {
    color: colors.iondigoDye,
    textAlign: 'center',
    fontSize: 18,
  },
});
