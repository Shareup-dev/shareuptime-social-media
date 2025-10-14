import React, {useState, useEffect, useCallback,useContext} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Alert,Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {SliderBox} from 'react-native-image-slider-box';

import colors from '../../config/colors';
import defaultStyles from '../../config/styles';
import authContext from '../../authContext';
import UserService from '../../services/user.service';
import PostService from '../../services/post.service';

import PostOptionDrawer from '../drawers/PostOptionsDrawer';
import fileStorage from '../../config/fileStorage';
import ImageView from 'react-native-image-viewing';
import PostActions from '../PostActions';
import { color } from 'react-native-reanimated';
export default function Card({
  user,
  //postId,
  //userId,
  postData,
  //firstName,
  //lastName,
  //userEmail,
  //date,
  //postText,
  //postImages,
  //profileImage,
  //reactions,
  //comments,
  //post,
  reloadPosts,
  onPress,
  style,
  navigation,
  postType,
}) {

  const {userState} = useContext(authContext);
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
        alert('Share friends');
      },
    },
    {
      title: userState?.userData?.id !== user?.id ? 'Unfollow' : '',
      icon: {
        image: require('../../assets/post-options-icons/unfollow-icon.png'),
      },
      onPress: () => {
        alert('Unfollow');
      },
    },
    {
      title: userState?.userData?.id !== user?.id ? <Text style={{color:colors.dark}}>Report</Text> : <Text style={{color:colors.red}}>Delete</Text>,
      icon: {
        image:  userState?.userData?.id !== user?.id ? require('../../assets/post-options-icons/report-icon.png'): require('../../assets/post-options-icons/delete-red-icon.png'),
      },
      onPress: () => {
        userState?.userData?.id !== user?.id ? alert('Report'): showDeleteAlert();
      },
    },
  ];

  const [formattedDate, setFormattedDate] = useState({
    day: '',
    month: '',
    year: '',
    time: '',
  });
  function randomno() {
    return Math.floor(Math.random() * (100000 - 0 + 1) + 0);
  }
  const formateDate = () => {
    const arrDate = postData.lastEdited.split(' ');
    const monthShort = arrDate[1].slice(0, 3);
    setFormattedDate({
      day: arrDate[0],
      month: monthShort,
      year: arrDate[2],
      time: arrDate[3],
    });
  };
  const formateNumber = number => {
    if (number > 1000) {
      number = Math.floor(number / 1000);
      return number + 'k ';
    } else return number;
  };

  useEffect(() => {
    formateDate();
    checkIfLiked();
    loadImages();
  }, []);

  useFocusEffect(
    useCallback(() => {
      reloadPost();
    }, [postData.id]),
  );


  const [numberOfReactions, setNumberOfReactions] = useState(postData.numberOfReaction);
  const [numberOfComments, setNumberOfComments] = useState(postData.numberOfComments);

  const [comment,setComments] =useState(postData.comments)
  const [isUserLiked, setIsUserLiked] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [sliderWidth, setSliderWidth] = useState();

  const loadImages = () => {

    if (postData.media?.length !== 0) {
      setImages(postData.media?.map(image => fileStorage.baseUrl + image.media + 'g'));
    }
  };

  const checkIfLiked = () => {
    const result = postData.liked
      return setIsUserLiked(result);
  };

  const handleReactions = async () => {
    PostService.likePost(user.id, postData.id)
    .then (res => {
      console.log("likeUnliked",res.data)
      setIsUserLiked(!isUserLiked)
      })//need to get likePostIds 
    .catch(e => console.error(e))
    reloadPost();
  };

  // rerenders the post when interaction
  const reloadPost = async () => {
    PostService.getPostByPostId(postData.id)
    .then(res => {
      //setComments(res.data.comments)
      setNumberOfComments(res.data.numberOfComments);
      setNumberOfReactions(res.data.numberOfReaction);})
    .catch(e => console.error(e))
    
  };

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
    ]);

  const deletePost = async () => {
    const response = await PostService.deletePost(postData.id);
    reloadPosts();
  };

  const actionsTabSizeRatio = 0.5;

  const onLayout = e => {
    setSliderWidth(e.nativeEvent.layout.width);
  };

return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[styles.card, defaultStyles.cardBorder, style]}
        onLayout={onLayout}>
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

        {images?.length !== 0 && (
          <SliderBox
            images={images}
            ImageComponentStyle={styles.image}
            imageLoadingColor={colors.iondigoDye}
            // parentWidth={sliderWidth / 1.04}
            onCurrentImagePressed={index => {
              setCurrentImage(images[index]);
              setImageViewerVisible(true);
            }}
          />

          // <Image source={{ uri: images[0] }} style={styles.image} />
        )}

        <PostActions
          //comments={comment}
          postData={postData}
          //firstName={firstName}
          navigation={navigation}
          postId={postData.id}
          //date={formattedDate}
          //postText={postText}
          userId={user.id}
          //userEmail={userEmail}
          numberOfReactions={`${numberOfReactions}`}
          numberOfComments={`${numberOfComments}`}
          //profileImage={profileImage}
          isUserLiked={isUserLiked}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
          setIsOptionsVisible={setIsOptionsVisible}
          onInteraction={handleReactions}
          postType = {postType}
        />

        <PostOptionDrawer
          source={'card'}
          postId={postData.id}
          postText={postData.content}
          options={options}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const borderRadius = 10;
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginTop: 10,
    overflow: 'hidden',
    // padding: 7,
    // paddingHorizontal: 6,
  },
  image: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    resizeMode: 'cover',
  },
  profilePicture: {
    borderRadius: 15,
    marginRight: 10,
    width: 50,
    height: 50,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
  },
  content: {
    justifyContent: 'center',
    padding: 10,
  },
  postDate: {
    fontSize: 12,
    color: colors.dimGray,
  },
  separator: {
    marginVertical: 10,
  },
  postText: {
    fontSize: 11,
    marginTop: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  userNameContainer: {
    width: '40%',
  },
  actionsContainer: {
    flexDirection: 'row',
    width: '42%',
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  actionTab: {
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  commentsShares: {
    flexDirection: 'row',
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  star: {
    marginRight: 5,
  },
  comments: {
    marginRight: 10,
  },
  optionsIcon: {
    alignSelf: 'flex-end',
    top: 8,
  },
  menuButton: {
    padding: 3,
    alignSelf: 'flex-end',
    width: 60,
    marginTop: -5,
  },
});
