import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import AuthContext from '../../Contexts/authContext';
import colors from '../../config/colors';
import defaultStyles from '../../config/GlobalStyles';
import routes from '../../navigation/routes';
import Card from './Card';
import moment from 'moment';
import postService from '../../services/post.service';
import Icon from '../Icon';
import PostOptionDrawer from '../drawers/PostOptionsDrawer';
import constants from '../../config/constants';

import onShareHandler from '../Share';
import { postDataSliceAction } from '../../redux/postDataSlice';

import { useDispatch } from 'react-redux';

import SwapCard from './SwapCard';
import BetterImage from '../betterImage/BetterImage';
import { Texts, Title } from '../../Materials/Text';
import Tab from '../buttons/Tab';
import { ReactionBar, TopReactions } from '../Reactions';

export default function SharedPostCard(props) {
  const { postData, navigation, user, ...rest } = props;
  const dispatch = useDispatch();
  const [feel] = useState(postData.feelings);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [listOfReactions, setListOfReactions] = useState(postData.countOfEachReaction);

  const actionsTabSizeRatio = 0.5;

  const {
    userState: { userData },
  } = React.useContext(AuthContext);

  const [date] = useState(
    moment(postData.published, 'DD MMMM YYYY hh:mm:ss').fromNow(),
    // null
  );

  const savePost = (pid) => {
    try {
      // userData.id is the authenticated user id
      postService.savePost(userData?.id, pid);
    } catch (e) {
      Alert.alert('Error', 'Could not save post');
    }
  };

  const navigateToShare = () => {
    dispatch(postDataSliceAction.setPostData(postData.post));
    navigation.navigate(routes.ADD_POST, {
      postType: constants.postTypes.SHARE_POST,
      // postData,
    });
  };

  const options = [
    {
      title: 'Save post',
      icon: {
        image: require('../../assets/post-options-icons/save-post-icon.png'),
      },
      onPress: () => {
        savePost(postData.id);
      },
    },
    {
      title: 'Hide my profile',
      icon: {
        image: require('../../assets/post-options-icons/hide-profile-icon.png'),
      },
      onPress: () => {
        savePost(postData.id);
      },
    },
    {
      title: userData?.id !== postData.userdata?.id ? '' : 'Edit',
      icon: { image: require('../../assets/post-options-icons/swap-icon.png') },
      onPress: () => {
        dispatch(postDataSliceAction.setEditPost(true));
        dispatch(postDataSliceAction.setPostData(postData));
        // dispatch(
        //   postDataSliceAction.setImages(
        //     postData.media?.map(image => image.mediaPath),
        //   ),
        // );
        navigation.navigate(routes.ADD_POST, {
          postType: constants.postTypes.SHARE_POST,
        });
        setIsOptionsVisible(false);
      },
    },
    {
      title: 'Share friends',
      icon: {
        image: require('../../assets/post-options-icons/share-friends-icon.png'),
      },
      onPress: navigateToShare,
    },
    {
      title: 'Share via',
      icon: {
        image: require('../../assets/icons/share-point-icon.png'),
      },
      onPress: () => {
        onShareHandler(postData);
      },
    },
    {
      title: userData?.id !== postData.userdata?.id ? 'Unfollow' : '',
      icon: {
        image: require('../../assets/post-options-icons/unfollow-icon.png'),
      },
      onPress: () => {
        Alert.alert('Unfollow');
      },
    },
    {
      title: userData?.id !== postData.userdata?.id ? 'Report' : 'Delete',
      icon: {
        image:
          userData?.id !== postData.userdata?.id
            ? require('../../assets/post-options-icons/report-icon.png')
            : require('../../assets/post-options-icons/delete-red-icon.png'),
      },
      onPress: () => {
        userData?.id !== postData.userdata?.id ? Alert.alert('Report') : showDeleteAlert();
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
    ]);

  const navigateToComments = () =>
    navigation.navigate(routes.COMMENTS, {
      postId: postData.id,
      userId: postData.userdata.id,
      //comments,
      postType: postData.allPostsType,
    });
  const deletePost = async () => {
    postService
      .deletePost(postData.id)
      .then((res) => {
        if (res.status === 200) {
          navigation.navigate(routes.FEED);
        }
      })
      .catch((e) => Alert.alert('Error', String(e)));
  };

  const showShareList = () =>
    navigation.navigate(routes.SHARE_LIST, {
      postData,
    });
  /* eslint-disable react/no-unstable-nested-components */
  const HeaderComponent = () => {
    return (
      <>
        <View style={lintFixStyles.headerRow}>
          <View style={styles.userInfo}>
            <TouchableOpacity
              onPress={() =>
                postData.userdata?.id === userData.id
                  ? navigation.navigate(routes.USER_PROFILE, {
                      user: postData.userdata,
                    })
                  : navigation.navigate(routes.FRIEND_PROFILE, {
                      user: postData.userdata,
                    })
              }
            >
              <Image
                source={{
                  uri: postData.userdata.profilePicturePath,
                }}
                style={styles.profilePicture}
              />
            </TouchableOpacity>

            <View style={styles.userNameContainer}>
              <TouchableOpacity>
                <Title style={styles.userName}>{postData.userdata.firstName}</Title>
              </TouchableOpacity>

              <Texts light>{date}</Texts>
            </View>
          </View>
          <View style={styles.actionsContainer}>
            <Tab
              textFontSize={17}
              iconType="FontAwesome5"
              title={
                <TopReactions
                  reactionsList={listOfReactions}
                  emojiSize={10}
                  overlayColor={colors.mediumGray}
                  allowNagativeVal={true}
                />
              }
              sizeRatio={actionsTabSizeRatio}
              style={[styles.actionTab]}
              color={colors.mediumGray}
              fontColor={colors.white}
            />

            <Tab
              title={`${postData.numberOfComments}`}
              onPress={navigateToComments}
              iconName="comment"
              iconType="Octicons"
              sizeRatio={actionsTabSizeRatio}
              style={styles.actionTab}
              color={colors.mediumGray}
              fontColor={colors.white}
            />

            <Tab
              title={`${postData.numberOfshares}`}
              iconImage={require('../../assets/icons/share-icon.png')}
              sizeRatio={actionsTabSizeRatio}
              style={styles.actionTab}
              color={colors.mediumGray}
              onPress={navigateToShare}
              fontColor={colors.white}
              iconSize={10}
            />
          </View>
        </View>
      </>
    );
  };

  const renderCard = (item) => {
    switch (item.post.allPostsType) {
      case constants.postTypes.SWAP:
        return (
          <SwapCard
            noActionBar
            noOptions
            navigation={navigation}
            // route={route}
            item={item.post}
            userId={item.post.userdata.id}
            // onPress={() => { navigation.navigate(routes.POST_DETAILS_SCREEN, { postData: item.post }) }}
          />
        );

      case constants.postTypes.HANG_SHARE:
        return (
          <SwapCard
            noActionBar
            noOptions
            navigation={navigation}
            // route={route}
            item={item.post}
            userId={item.post.userdata.id}
            // onPress={() => {
            //   navigation.navigate(routes.POST_DETAILS_SCREEN, {
            //     postData: item.post,
            //   });
            // }}
          />
          // <HangFeedCard //style={styles.listItem}
          //   user={item.userdata}
          //   postData={item}
          //   navigation={navigation}
          //   reloadPosts={loadNews}
          //   postType={item.allPostsType}
          //   onPress={() => { navigation.navigate(routes.POST_DETAILS_SCREEN, { postData: item }) }}
          // />
        );
      default:
        return (
          <Card
            {...rest}
            noActionBar
            noOptions
            postData={postData.post}
            navigation={navigation}
            user={user}
          />
        );
    }
  };

  return (
    <View style={[styles.card, defaultStyles.cardBorder]}>
      <HeaderComponent />

      {postData.post ? (
        <View>{renderCard(postData)}</View>
      ) : (
        <View style={lintFixStyles.centerPaddingY10}>
          <Text>Post unavailable</Text>
        </View>
      )}
      <View style={lintFixStyles.paddingX15Top15}>
        <View style={styles.actionsBar}>
          <ReactionBar
            contentId={postData.id}
            emojiSize={14}
            contentType={'post'}
            isLiked={postData.likedType}
            setListOfReaction={setListOfReactions}
          />

          <View style={styles.commentsShares}>
            <TouchableWithoutFeedback onPress={navigateToComments}>
              <Texts style={styles.bold}>{`${
                postData.numberOfComments
              } Comments  ${0} Shares`}</Texts>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/********************************* Post Feelings and tags ****************************************/}
        <View style={lintFixStyles.rowAlignCenterWrap}>
          {postData?.feelings && (
            <View style={styles.row}>
              <BetterImage noBackground source={feel.img} style={styles.feelImg} />
              <Texts size={13} color={'#333'} style={lintFixStyles.textBold}>
                {feel.name}
              </Texts>
            </View>
          )}
          {postData?.activity && (
            <View style={styles.row}>
              <Icon name={feel.icon} color={feel.color} />
              <Texts size={13} color={'#333'} style={lintFixStyles.textBold}>
                {feel.name}
              </Texts>
            </View>
          )}
          {postData?.taggedList.length !== 0 && (
            <View style={lintFixStyles.row}>
              <Texts size={14} color={colors.dimGray}>
                {' '}
                -with{' '}
              </Texts>
              <TouchableOpacity onPress={() => showShareList(constants.constant.SHOW_TAGLIST)}>
                <Texts size={14} color={'#333'} style={lintFixStyles.textBold}>
                  {postData.taggedList[0]?.firstName}
                  {postData.taggedList[0]?.lastName} and{' '}
                  {postData.taggedList.length - 1 === 1
                    ? postData.taggedList[1]?.firstName + postData.taggedList[1]?.lastName
                    : `${postData.taggedList.length - 1} others`}
                </Texts>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {postData.content !== '' && (
          <Texts truncate style={lintFixStyles.mt10} color={'#333'}>
            {postData.content}
          </Texts>
        )}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            setIsOptionsVisible(true);
          }}
        >
          <Icon
            name="options"
            type="SimpleLineIcons"
            style={styles.optionsIcon}
            size={20}
            backgroundSizeRatio={1}
          />
        </TouchableOpacity>
        <PostOptionDrawer
          source={'card'}
          postId={postData.id}
          postText={postData.content}
          options={options}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  comments: {
    marginRight: 10,
  },
  menuButton: {
    padding: 3,
    alignSelf: 'flex-end',
    marginTop: -5,
  },
  actionsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
  star: {
    marginRight: 5,
  },
  userNameContainer: {
    alignItems: 'flex-start',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionTab: {
    paddingHorizontal: 5,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  actionsBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postText: {
    fontSize: 11,
    marginVertical: 5,
  },
  postDate: {
    fontSize: 12,
    color: colors.dimGray,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginTop: 10,
    paddingBottom: 5,

    overflow: 'hidden',
    // padding: 7,
    // paddingHorizontal: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  commentsShares: {
    flexDirection: 'row',
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

// Styles extracted to reduce inline style warnings without changing UI
const lintFixStyles = StyleSheet.create({
  menuReportText: { color: colors.dark },
  menuDeleteText: { color: colors.red },
  centerPaddingY10: { alignItems: 'center', paddingVertical: 10 },
  paddingX15Top15: { paddingHorizontal: 15, paddingTop: 15 },
  rowAlignCenterWrap: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  textBold: { fontWeight: 'bold' },
  row: { flexDirection: 'row' },
  mt10: { marginTop: 10 },
  headerRow: {
    paddingTop: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
