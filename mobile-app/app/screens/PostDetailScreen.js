import React, { useContext, useState, useCallback } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
//import Text from "../components/Text";
import Tab from '../components/buttons/Tab';
import Screen from '../components/Screen';
import { Header } from '../components/headers';
import colors from '../config/colors';
import Icon from '../components/Icon';
import routes from '../navigation/routes';
import { useFocusEffect } from '@react-navigation/native';
import authContext from '../Contexts/authContext';
import postService from '../services/post.service';
import CommentsScreen from './CommentsScreen';
import ImageView from 'react-native-image-viewing';
import { SliderBox } from 'react-native-image-slider-box';
import Separator from '../components/Separator';
import PostOptionDrawer from '../components/drawers/PostOptionsDrawer';
import SwapActionContainer from '../components/posts/SwapActionContainer';
import constants from '../config/constants';


export default function PostDetailScreen({ navigation, route }) {
  const { postData } = route.params;
  const { userState } = useContext(authContext);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [writeComment, setWriteComment] = useState(false);
  const [isUserLiked, setIsUserLiked] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const data = [
    {
      allPostsType: 'post',
      content:
        "If you're alive, you can't be bored in San Francisco \n\n@SanFrancisco\n#With_Friends##Feeling Happy",
      group: null,
      id: 1650184271184,
      lastEdited: '13 April 2022 08:39:06',
      liked: false,
      media: [
        {
          comments: [],
          id: 1650184271184,
          media: '76B0732B-E7FE-4727-815E-4DBD51AFF7E6.jpg',
          mediaPath:
            '/Users/lokeesan/Documents/GitHub/Shareup-Mobile-App-CLI/app/assets/images/15.jpg',
          mediaType: 'post',
        },
      ],
      numberOfComments: 1,
      numberOfReaction: 0,
      numberOfshares: 0,
      published: '13 April 2022 08:39:06',
      saved: false,
      userTag: null,
      userdata: {
        email: 'hagetap144@leafzie.com',
        firstName: 'Steve',
        id: 1649759197093,
        lastName: 'Jobs',
        profilePicture: 'profile-image-lokeesan@shareup.qa-1650259496598.jpg',
        profilePicturePath: '/src/main/default.png',
      },
      views: 0,
    },
  ];
  const options = [
    {
      title: 'Unsave',
      icon: {
        name: 'note-remove-outline',
        type: 'MaterialCommunityIcons',
      },
      onPress: () => {
        alert('Share friends');
      },
    },
    {
      title: 'Share',
      icon: {
        name: 'share',
        type: 'MaterialCommunityIcons',
      },
      onPress: () => {
        alert('Share friends');
      },
    },
  ];
  useFocusEffect(
    useCallback(() => {
      loadImages();
    }, []),
  );
  const loadImages = () => {
    if (postData.media?.length !== 0) {
      setImages(postData.media?.map(image => image.mediaPath));
    }
  };
  const acceptHang = () => {
    navigation.navigate(routes.SHIPPING_ADDRESS, postData);
  };
  const acceptSwap = () => {
    navigation.navigate(routes.CHECKOUT, { postType: postData.allPostsType });
  };
  const handleReactions = async () => {
    postService
      .likePost(userState.userData?.id, postData.id)
      .then(res => {
        setIsUserLiked(!isUserLiked);
        //setNumberOfReactions(res.data.numberOfReaction);
      }) //need to get likePostIds
      .catch(e => console.error(e));
  };
  return (
    <Screen>
      <SafeAreaView></SafeAreaView>
      <Header
        backgroundColor={colors.white}
        left={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={() => navigation.goBack()} >
              <View style={{ marginRight: 15 }}  >

                <Icon
                  name="chevron-back"
                  type="Ionicons"
                  size={25}
                  backgroundSizeRatio={1}
                />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.userNameContainer}>
              <View>
                <Image
                  source={{ uri: postData.userdata.profilePicturePath }}
                  style={styles.profilePicture}
                />
                <TouchableOpacity
                  onPress={_ => navigation.navigate(routes.GROUP_FEED, postData.group)}
                >
                  <Image
                    source={{
                      uri: postData.group?.groupImagePath,
                    }}
                    style={{
                      borderRadius: 15,
                      width: 25,
                      height: 25,
                       zIndex: 1,
                       position: 'absolute',
                      marginBottom: 10,
                      marginLeft: 1,
                       top: -16,
                       left: 25,

                    }}
                  /></TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    routes.USER_PROFILE,
                    postData.userdata.email,
                  )
                }>
                <Text style={styles.userName}>
                  {postData.userdata.firstName}
                </Text>
                {postData.group ?
                  <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start' }}>
                    
                  </View> : <></>}
                <View style={styles.postDateContainer}>
                  <Text style={styles.postDate}>{postData.published}</Text>
                  <Text style={{ fontWeight: 'bold' }}> .</Text>
                  <Icon
                    image={require('../assets/post-privacy-options-icons/public-icon.png')}
                    type="FontAwesome5"
                    backgroundSizeRatio={1}
                    size={15}
                    color={colors.dimGray}
                    style={styles.privacy}
                  />
                </View>
                <View style = {{flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start' }}>
                
                  <TouchableOpacity
                      onPress={_ => navigation.navigate(routes.GROUP_FEED, postData.group)}
                    >
                      <Text style={styles.group}>{postData.group?.name}</Text>
                    </TouchableOpacity>
                  </View>
              </TouchableOpacity>
            </View>
          </View>
        }
        right={
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setIsOptionsVisible(true);
            }}>
            <Icon
              name="options"
              type="SimpleLineIcons"
              style={styles.optionsIcon}
              size={20}
              backgroundSizeRatio={1}
            />
          </TouchableOpacity>
        }
      />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.postText}>{postData.content}</Text>
        </View>
        {currentImage && (
          <ImageView
            visible={imageViewerVisible}
            images={[{ uri: currentImage }]}
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
        {((postData.allPostsType === constants.postTypes.SWAP) || (postData.allPostsType === constants.postTypes.HANG_SHARE)) && (
          <SwapActionContainer

            item={postData}
            onPress={
              postData.allPostsType === constants.postTypes.SWAP
                ? acceptSwap
                : acceptHang
            }
          />)}

        <Separator style={styles.separator} />
        <View style={styles.actionsContainer}>
          <Tab
            title={'Star'}
            iconName={isUserLiked ? 'star' : 'star-o'}
            iconType="FontAwesome"
            //sizeRatio={actionsTabSizeRatio}
            style={styles.actionTab}
            color={colors.white}
            fontColor={isUserLiked ? '#FFC107' : colors.mediumGray}
            onPress={handleReactions}
          />

          <Tab
            title={'Comment'}
            iconName="comments"
            iconType="FontAwesome"
            //sizeRatio={actionsTabSizeRatio}
            //style={styles.actionTab}
            color={colors.white}
            fontColor={colors.mediumGray}
            onPress={() => {
              setWriteComment(true);
            }}
          />

          <Tab
            title={'Share'}
            iconName="share"
            iconType="FontAwesome"
            //sizeRatio={actionsTabSizeRatio}
            //style={styles.actionTab}
            color={colors.white}
            fontColor={colors.mediumGray}
          />
        </View>
        <Separator style={styles.separator} />
        <View style={styles.listFooter}>
          <CommentsScreen
            route={{
              params: {
                postId: postData.id,
                postType: postData.allPostsType,
                swapId: postData.id,
                fromDetailScreen: true,
                writeComment: writeComment,
              },
            }}
          />
        </View>
        <PostOptionDrawer
          source={'card'}
          postId={postData.id}
          postText={postData.content}
          options={options}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
        />
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  shadowBox: {
    backgroundColor: 'coral',
    height: 50,
    shadowColor: 'red',
  },
  container: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginTop: 15,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  listItem: {
    borderRadius: 10,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postDate: {
    fontSize: 12,
    color: colors.dark,
  },
  separator: {
    marginVertical: 10,
  },
  postText: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  userNameContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    //backgroundColor: colors.red,
  },
  profilePicture: {
    borderRadius: 10,
    marginRight: 10,
    width: 45,
    height: 45,
  },
  postDateContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    // justifyContent:"space-between"
    // backgroundColor: colors.red,
  },
  privacy: {
    paddingLeft: 10,
  },
  actionTab: {
    paddingHorizontal: 5,
    marginHorizontal: 5,
    borderColor: colors.red,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginTop: 15,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  image: {
    width: '99%',
    height: 300,
    borderRadius: 10,
    resizeMode: 'cover',
    marginTop: 20,
  },
  separator: {
    marginTop: 10,
    width: '100%',
  },
  listFooter: {
    marginBottom: 10,
    width: '100%',
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginTop: 10,
    overflow: 'hidden',
    // padding: 7,
    // paddingHorizontal: 6,
  },
  group: {
    fontWeight: '500',
    fontSize: 13,
    //marginTop:10,
    color:colors.dimGray
  },
});
