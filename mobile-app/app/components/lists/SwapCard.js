import React, {useEffect, useState, useContext} from 'react';
import {View, StyleSheet, TouchableOpacity, Text,Alert,Share} from 'react-native';
import {useSelector} from 'react-redux';
import ImageView from 'react-native-image-viewing';
import {SliderBox} from 'react-native-image-slider-box';
import colors from '../../config/colors';
import fileStorage from '../../config/fileStorage';
import PostOptionDrawer from '../drawers/PostOptionsDrawer';
import PostActions from '../PostActions';
import defaultStyles from '../../config/styles';
import SwapActionContainer from '../posts/SwapActionContainer';
import AuthContext from '../../authContext';
import onShare from '../Share';
const imageSize = 160;
const SwapCard = React.memo(({item, navigation, userId, style}) => {
  const actionsTabSizeRatio = 0.5;
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [numberOfComments, setNumberOfComments] = useState(
    item.numberOfComments,
  );

  const [sliderWidth, setSliderWidth] = useState();
  const [currentImage, setCurrentImage] = useState();
  const [images, setImages] = useState([]);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const swapedPosts = useSelector(state => state.swapedImages);

  const {userState} = useContext(AuthContext);

  const getSwapedImage = swapId => {
    let foundSwap = swapedPosts.filter(swap => swap.swapPostId === swapId)[0];
    if (foundSwap) {
      return {imagePath: foundSwap.swapImage, found: true};
    } else {
      let image = {
        imagePath: '../assets/icons/swap-square-dashed.png',
        found: false,
      };
      return image;
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const {userData : user} =
    useContext(AuthContext)?.userState;
  const loadImages = () => {
    if (item.media.length !== 0) {
      setImages(item.media.map(image => fileStorage.baseUrl + image.mediaPath));
    }
  };

  const options = [
    {
      title: 'Save post',
      icon: {
        image: require('../../assets/post-options-icons/save-post-icon.png'),
      },
      onPress: () => {
        alert('Save post');
      },
    },
    {
      title: 'Hide my profile',
      icon: {
        image: require('../../assets/post-options-icons/hide-profile-icon.png'),
      },
      onPress: () => {
        alert('Save post');
      },
    },
    {
      title: 'Swap',
      icon: {image: require('../../assets/post-options-icons/swap-icon.png')},
      onPress: () => {
        alert('Swap');
      },
    },
    {
      title: 'Share friends',
      icon: {
        image: require('../../assets/post-options-icons/share-friends-icon.png'),
      },
      onPress: () => {
        onShare();
      },
    },
    // {
    //   title: 'Unfollow',
    //   icon: {
    //     image: require('../../assets/post-options-icons/unfollow-icon.png'),
    //   },
    //   onPress: () => {
    //     alert('Unfollow');
    //   },
    // },
    // {
    //   title: 'Report',
    //   icon: {
    //     image: require('../../assets/post-options-icons/report-icon.png'),
    //   },
    //   onPress: () => {
    //     alert('Report');
    //   },
    // },
    {
      title: 'Delete Post',
      icon: {
        image: require('../../assets/post-options-icons/delete-red-icon.png'),
      },
      onPress: () => {
        showDeleteAlert();
      },
    },
  ];
  const showDeleteAlert = () =>
  Alert.alert('Delete', 'Are you sure to delete this post', [
    {
      text: 'Yes',
      onPress: deletePost,
      style: 'cancel',
    },
    {
      text: 'No',
      style: 'cancel',
    },
  ]) 

const deletePost = async () => {
 
    // const result = await PostService.deletePost(postId)
    // .then(res => setPosts(res.data))
    // .catch(e => console.error(e));
  
  //reloadPosts();
};
  const onLayout = e => {
    setSliderWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={[styles.card, defaultStyles.cardBorder, style]}>
      {currentImage && (
        <ImageView
          visible={imageViewerVisible}
          images={[{uri: currentImage}]}
          imageIndex={0}
          onRequestClose={() => {
            setImageViewerVisible(false);
          }}
        />
      )}

      {/** Post Image */}
      <View style={styles.imageContainer} onLayout={onLayout}>
        {images.length !== 0 && (
          <SliderBox
            images={images}
            ImageComponentStyle={styles.image}
            imageLoadingColor={colors.iondigoDye}
            parentWidth={sliderWidth}
            onCurrentImagePressed={index => {
              setCurrentImage(images[index]);
              setImageViewerVisible(true);
            }}
            paginationBoxStyle={styles.sliderDotBox}
            dotStyle={styles.sliderDot}
            activeOpacity={1}
            dotColor={colors.iondigoDye}
            backgroundColor={colors.lighterGray}
          />
        )}

        {userState?.userData.id !== userId && <SwapActionContainer />}
      </View>

      <PostActions
        comments={item.comments}
        swapId={item.id}
        firstName={item.userdata.firstName}
        //userEmail={item.userdata.email}
        isUserLiked={false}
        navigation={navigation}
        numberOfComments={`${numberOfComments}`}
        numberOfReactions={`${0}`}
        postId={item.id}
        postText={item.content}
        profileImage={item.userdata.profilePicture}
        userId={userId}
        setIsOptionsVisible={setIsOptionsVisible}
        postType={'swapPost'}
      />

      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            setIsOptionsVisible(true);
          }}></TouchableOpacity>

        <PostOptionDrawer
          source={'newfeed'}
          options={options}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
          postId={item.id}
          postText={item.content}
        />
      </View>
    </View>
  );
});

const borderRadius = 10;
export default SwapCard;
const styles = StyleSheet.create({
  swapImage: {
    margin: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  swapButton: {
    backgroundColor: colors.iondigoDye,
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginTop: 10,
    overflow: 'hidden',
  },
  menuButton: {
    padding: 3,
    alignSelf: 'flex-end',
    width: 60,
    marginTop: -5,
  },
  imagesWrapper: {
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    resizeMode: 'cover',
    backgroundColor: colors.lighterGray,
  },
  extraActionsContainer: {
    backgroundColor: colors.lighterGray,
  },
  imageContainer: {
    width: '100%',
  },
  categoryDescription: {
    fontSize: 12,
    color: colors.dimGray,
  },
  sliderDotBox: {
    height: 30,
  },
  sliderDot: {},
});
