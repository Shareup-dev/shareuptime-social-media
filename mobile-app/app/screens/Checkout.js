import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import AppButton from '../components/buttons/Button';
import { Header, HeaderTitle } from '../components/headers';
import colors from '../config/colors';
import routes from '../navigation/routes';
import Icon from '../components/Icon';

const Checkout = ({ navigation, route }) => {
  const { postType, item } = route.params;
  // const { postTypes } = constants; // unused

  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
      <Header
        backgroundColor={colors.white}
        left={
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" type="Ionicons" size={50} />
          </TouchableWithoutFeedback>
        }
        middle={<HeaderTitle>Checkout</HeaderTitle>}
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
        {/* {postType === postTypes.HANG_SHARE && 
        <View
        style={styles.card}>
        <Image
          source={
            require('../assets/gift-images/flower.png')
          }
          style={styles.image}
        />
        <View style={styles.contentView}>
          <Text  style={styles.postText}>{"postData"}</Text>
          <View style={{width:95}}>
          <OptionBox
                currentOption={common.privacyOptions[0]}
                onPress={() => {
                  //setIsPrivacyOptionsVisible(!isPrivacyOptionsVisible);
                }}
              />
              </View>
         <Text style={styles.content}>{"postData"}</Text> 
          
        </View>
        
      </View>} */}
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
              navigation.navigate(routes.CHECKOUT_COMPLETE, {
                postType,
                item: item,
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
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    marginLeft: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 30,
    marginLeft: 10,
    color: colors.dimGray,
    fontWeight: '400',
  },
  pricingSeparator: {
    fontSize: 30,
    color: colors.dimGray,
  },
  shippingCharges: {
    fontSize: 30,
  },
  paymentMethodLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  inputLabel: {
    fontSize: 15,
    color: colors.dimGray,
    marginVertical: 10,
    marginLeft: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.LightGray,
    paddingHorizontal: 10,
    borderRadius: 7,
    height: 50,
    marginBottom: 20,
    marginLeft: 10,
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
  card: {
    height: 100,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginTop: 5,
    marginBottom: 10,
    overflow: 'hidden',
    alignSelf: 'center',
    padding: 7,
    borderColor: colors.LightGray,
    borderWidth: 1,
    borderRadius: 10,
  },
  image: {
    width: '25%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  contentView: {
    flexDirection: 'column',
    marginRight: 10,
    //alignItems:"flex-start",
    //alignSelf:"flex-start",
    width: '70%',
  },

  content: {
    fontSize: 12,
    marginTop: 3,
    marginLeft: 10,
    color: colors.dimGray,
  },
  postText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
    marginLeft: 10,
  },
  optionsIcon: {
    alignSelf: 'flex-end',
    paddingBottom: 5,
  },
  menuButton: {
    padding: 3,
    alignSelf: 'flex-end',
    width: 60,
    marginTop: -5,
  },
});

export default Checkout;
