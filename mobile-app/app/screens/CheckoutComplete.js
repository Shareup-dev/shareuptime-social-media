import React, { useContext } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import colors from '../config/colors';
import routes from '../navigation/routes';
import store from '../redux/store';
import { swapedImagesAction } from '../redux/swapedImages';
import constants from '../config/constants';
import authContext from '../Contexts/authContext';

const CheckoutComplete = ({ navigation, route }) => {
  const { postType, swapedPostId, item: _item } = route.params;
  const { postTypes } = constants;
  const { userData: _user } = useContext(authContext)?.userState;

  const createPostFormData = (content) => {
    const formData = new FormData();
    formData.append('content', content.text);
    if (content.images.length !== 0) {
      content.images.forEach((image) => {
        // const splitPathArr = image.split('/');
        formData.append(`files`, {
          name: 'String(splitPathArr.slice(-1).pop())',
          type: 'image/jpg',
          uri: image, //Platform.OS === 'ios' ? image.replace('file://', '') : image,
        });
      });
    }

    if (content.groupId) {
      formData.append('groupid', content.groupId);
    }
    if (content.category) {
      formData.append('category', content.category);
    }
    return formData;
  };

  const createHang = () => {
    //   const swapContent = {
    //     text: item.title,
    //     category: "gifts",
    //     images: ["assets/gift-images/flower.png"],
    //   };
    //   const formData = createPostFormData(swapContent);
    //     hangShareService
    //       .createHang(user.id, formData)
    //       .then(resp => {
    //         //store.dispatch(feedPostsAction.addFeedPost(resp.data));
    //         navigation.navigate(routes.FEED);
    //       })
    //       .catch(e => {
    //         console.error(e);
    //       }).finally(_ => navigation.navigate(routes.FEED));;
    navigation.navigate(routes.FEED);
  };
  return (
    <Screen>
      <View style={styles.mainContainer}>
        <Image
          style={styles.checkoutImage}
          resizeMode={'center'}
          width={'100%'}
          source={require('../assets/icons/CheckoutComplete.png')}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.congrats}>Congratulation !!!</Text>
          <Text style={styles.checkoutMessage}>
            Thank you for choosing ShareUp to swap items, your item will be shipped soon
          </Text>
          <TouchableOpacity
            onPress={() => {
              postType === postTypes.HANG_SHARE
                ? createHang()
                : store.dispatch(swapedImagesAction.removeImages(swapedPostId));
            }}
          >
            <View style={styles.goBackButton}>
              <Text style={styles.goBackLabel}>
                {postType === postTypes.HANG_SHARE ? 'Hang In' : 'Track Order'}
              </Text>
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
    fontSize: 20,
    color: colors.iondigoDye,
    opacity: 0.8,
    // position:'absolute'
  },
  checkoutImage: { marginTop: 100, height: '50%' },
});

export default CheckoutComplete;
