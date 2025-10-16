import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  Alert,
  FlatList,
} from 'react-native';
import moment from 'moment';
import colors from '../../config/colors';
import Separator from '../Separator';
import UserProfilePicture from '../UserProfilePicture';
import Icon from '../Icon';
import LinkButton from '../buttons/LinkButton';
import CommentText from './CommentText';
import authContext from '../../authContext';
import { Button } from 'react-native-paper';
import CommentsScreen from '../../screens/CommentsScreen';
import PostOptionDrawer from '../drawers/PostOptionsDrawer';
export default function CommentItem({
  fromReply,
  comment,
  reactionsLength,
  isUserLiked,
  onInteraction,
  handleDelete,
  handleLongPress,
  onReply,
  isReply,
  reply,
  postType,
  swapId,
  setIsOptionsVisible,
  isOptionsVisible,
  setNumberOfComments,
}) {
  //const isReply = false
  const { userState } = useContext(authContext);
  const [time, setTime] = useState(moment(comment.published, 'DD MMMM YYYY hh:mm:ss').fromNow());
  return (
    <>
      <TouchableWithoutFeedback onLongPress={setIsOptionsVisible(true)}>
        <View style={!fromReply ? styles.container : styles.replyContainer}>
          {/** Left */}
          <View>
            <UserProfilePicture size={40} />
          </View>

          {/** Medial */}
          <View style={styles.medialContainer}>
            <Text style={styles.userName}>{comment.user.firstName}</Text>

            {/* <Text style={styles.comment}>{comment}</Text> */}
            <View style={styles.commentBody}>
              <CommentText
                text={comment.content}
                textStyle={styles.comment}
                readMoreStyle={styles.readMore}
              />
            </View>

            <View style={styles.commentDetailsContainer}>
              <Text style={styles.time}>{time}</Text>
              <Text style={styles.stars}>
                {reactionsLength} {reactionsLength < 2 ? 'Star' : 'Stars'}
              </Text>
              <LinkButton title="Reply" style={styles.reply} onPress={() => onReply(comment.id)} />
            </View>
          </View>

          {/** Right */}
          <View style={styles.reactionContainer}>
            {/* <TouchableWithoutFeedback onPress={onInteraction}>
            <Icon
              name="staro"
              type="AntDesign"
              color={colors.iondigoDye}
              size={20}
              backgroundSizeRatio={1}
            />
          </TouchableWithoutFeedback> */}
            {isUserLiked ? (
              <TouchableWithoutFeedback onPress={() => onInteraction(comment.id)}>
                <Icon
                  name="star"
                  type="AntDesign"
                  size={isReply ? 20 : 15}
                  color={colors.iondigoDye}
                  backgroundSizeRatio={1}
                />
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback onPress={() => onInteraction(comment.id)}>
                <Icon
                  name="staro"
                  type="AntDesign"
                  size={isReply ? 20 : 15}
                  color={colors.iondigoDye}
                  backgroundSizeRatio={1}
                />
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
        <Separator style={styles.separator} />
        {isReply ? (
          <CommentsScreen
            route={{
              params: {
                comments: reply,
                userId: comment.user.id,
                commendId: comment.id,
                postType: postType,
                swapId: swapId,
                fromReply: true,
              },
            }}
          />
        ) : (
          <Text />
        )}
        {/* <Separator style={styles.separator} /> */}
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: '10%',
    paddingTop: 25,
    paddingBottom: 6,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  replyContainer: {
    flexDirection: 'row',
    width: '90%',
    paddingTop: 20,
    paddingBottom: 6,
    //justifyContent: "flex-start",
    justifyContent: 'space-between',
  },

  medialContainer: {
    marginLeft: 10,
    paddingTop: 5,
    justifyContent: 'space-between',
  },
  userName: {
    fontWeight: 'bold',
  },
  commentDetailsContainer: {
    width: '65%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comment: {
    color: colors.mediumGray,
    width: Dimensions.get('window').width / 1.7,
    fontSize: 13,
  },
  commentBody: {
    marginVertical: 6,
  },
  time: {
    fontSize: 9,
  },
  stars: {
    fontSize: 10,
    color: colors.iondigoDye,
  },
  reply: {
    fontSize: 10,
    color: colors.iondigoDye,
    fontWeight: 'bold',
  },
  reactionContainer: {
    paddingTop: 5,
  },
  separator: {
    marginHorizontal: 15,
    width: '90%',
  },
  commentTextContainer: {
    marginVertical: 5,
  },
  readMore: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.iondigoDye,
  },
  deleteBox: {
    backgroundColor: colors.dimGray,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
});
