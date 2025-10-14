import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Icon from '../components/Icon';
import colors from '../config/colors';
import defaultStyles from '../config/styles';
import {StackActions} from '@react-navigation/native';
import routes from '../navigation/routes';
import store from '../redux/store';
import {swapedImagesAction} from '../redux/swapedImages';
const SwapDisplay = ({navigation, route}) => {
  return (
    <ImageBackground
      style={{
  flex: 1
        
      }}
      source={{uri: route.params.swapImage}}>
      <View
        style={[
          defaultStyles.row,
          {justifyContent: 'space-between', paddingHorizontal: 30},
        ]}>
        <Text style={styles.title}>Swap</Text>
        <TouchableOpacity
          onPress={() => {
            const popAction = StackActions.pop(1);
            navigation.dispatch(popAction);
          }}>
          <Icon
            type={'FontAwesome'}
            name={'close'}
            backgroundColor={colors.LightGray}
            color={colors.white}
            noBackground
            size={64}
          />
        </TouchableOpacity>
      </View>
      <View style={{borderBottomWidth: 2, borderColor: colors.white}}></View>
      {/* <Image
        style={{
          width: Dimensions.get("screen").width,
          height: 500,
          marginTop: 60,
          resizeMode:''
        }}
        source={{ uri: route.params.swapImage }}
      /> */}
      <View
        style={{
          justifyContent: 'flex-end',
          alignItems:"flex-end",
          flex: 1,
          padding: 15
        }}>
        <TouchableOpacity
          onPress={() => {
            if (route.params.returnSwap) {
              let previousState = store.getState().swapedImages;
              store.dispatch(
                swapedImagesAction.setImages([
                  ...previousState,
                  {...route.params, swapImage: route.params.swapImage},
                ]),
              );
              navigation.navigate(routes.FEED, {...route.params});
            } else {
              navigation.navigate(routes.ADD_POST, {
                postType: 'swapPost',
                swapImage: route.params.swapImage,
              });
            }
          }}>
          <Icon
            type={'Ionicons'}
            name={'arrow-forward-sharp'}
            size={56}
            backgroundSizeRatio={0.7}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default SwapDisplay;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.LightGray,
    width: Dimensions.get('screen').width,
    flex: 1,
    paddingTop: '12%',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
});
