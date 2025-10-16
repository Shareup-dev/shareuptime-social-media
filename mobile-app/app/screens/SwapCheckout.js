import React from 'react';
import { View, Text, Image, StyleSheet, TextInput } from 'react-native';
import AppButton from '../components/buttons/Button';
import { Header, HeaderCloseIcon, HeaderTitle } from '../components/headers';
import Screen from '../components/Screen';
import colors from '../config/colors';
import routes from '../navigation/routes';

const SwapCheckout = ({ navigation, route }) => {
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
      <View style={styles.mainContainer}>
        <View>
          <Text style={styles.title}>Billing Information</Text>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.pricingSeparator}>:</Text>
            <Text style={styles.shippingCharges}>50 QR</Text>
          </View>
        </View>
        <Text style={styles.paymentMethodLabel}>Payment Method</Text>
        <Text style={styles.inputLabel}>Name on card</Text>
        <TextInput placeholder={'Your name as on the card'} style={styles.textInput} />
        <Text style={styles.inputLabel}>Card number</Text>
        <TextInput placeholder={'Enter card number'} style={styles.textInput} />
        <View>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput placeholder={'MM/YY'} style={styles.textInput} />
          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput placeholder={'***'} style={styles.textInput} />
        </View>
        <View style={styles.actionButtons}>
          <AppButton
            style={[styles.actionButton, { borderWidth: 1, borderColor: colors.iondigoDye }]}
            width={'45%'}
            fontColor={colors.iondigoDye}
            color={colors.white}
            title={'Cancel'}
          />
          <AppButton
            onPress={() => {
              navigation.navigate(routes.SWAP_CHECKOUT_COMPLETE, {
                swapedPostId: route.params.swapedPostId,
              });
            }}
            width={'45%'}
            style={styles.actionButton}
            title={'Pay'}
          />
        </View>
        <View style={styles.logosContainer}>
          <Image
            style={styles.logoStyle}
            resizeMode={'stretch'}
            width={'100%'}
            source={require('../assets/icons/paymentIcons.png')}
          />
        </View>
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginVertical: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 32,
    color: colors.LightGray,
    fontWeight: '500',
  },
  pricingSeparator: {
    fontSize: 32,
    color: colors.LightGray,
  },
  shippingCharges: {
    fontSize: 32,
  },
  paymentMethodLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 18,
    color: colors.LightGray,
    marginVertical: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.LightGray,
    paddingHorizontal: 10,
    borderRadius: 7,
    height: 50,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    borderRadius: 8,
    elevation: 0,
  },
  logosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor: "coral",
  },
  logoStyle: {
    height: 80,
    width: '100%',
    marginVertical: 10,
  },
});

export default SwapCheckout;
