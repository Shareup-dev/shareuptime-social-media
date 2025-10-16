import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppButton from '../components/buttons/Button';
import Screen from '../components/Screen';
import colors from '../config/colors';
import routes from '../navigation/routes';
import store from '../redux/store';
import { swapedImagesAction } from '../redux/swapedImages';

const SwapCheckoutComplete = ({ navigation, route }) => {
  return (
    <Screen>
      <View style={styles.mainContainer}>
        <Image
          style={{ marginTop: 100, height: 350 }}
          resizeMode={'center'}
          width={'auto'}
          source={require('../assets/icons/CheckoutComplete.png')}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.congrats}>Congratulation !!!</Text>
          <Text style={styles.checkoutMessage}>
            Thank you for choosing ShareUp to swap items, your item will be shipped soon
          </Text>
          <TouchableOpacity
            onPress={() => {
              store.dispatch(swapedImagesAction.removeImages(route.params.swapedPostId));
              navigation.navigate(routes.FEED);
            }}
          >
            <View style={styles.goBackButton}>
              <Text style={styles.goBackLabel}>Go to homepage</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
  },
  congrats: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoContainer: {
    width: '60%',
    marginHorizontal: '20%',
  },
  checkoutMessage: {
    color: colors.LightGray,
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  goBackButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    backgroundColor: 'rgba(4, 69, 102, .19)',
    borderRadius: 25,
    height: 50,
    paddingBottom: 5,
  },
  goBackLabel: {
    fontSize: 22,
    color: colors.iondigoDye,
    opacity: 1,
    // position:'absolute'
  },
});

export default SwapCheckoutComplete;
