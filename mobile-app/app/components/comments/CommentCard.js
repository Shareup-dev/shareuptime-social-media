import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Keyboard,
  Alert,
  TextInput,
} from 'react-native';
import moment from 'moment';

import colors from '../../config/colors';
import LinkButton from '../buttons/LinkButton';
import Icon from '../Icon';
import UserProfilePicture from '../UserProfilePicture';
import { CommentText } from './';
import AuthContext from '../../Contexts/authContext';
import postService from '../../services/post.service';
import Separator from '../Separator';
import CommentsList from './CommentsList';
import CommentsContext from '../../Contexts/commentsContext';
import DownModal from '../drawers/DownModal';
import { ReactionBar, TopReactions } from '../Reactions';
import { Texts, Title } from '../../Materials/Text';

const { width } = Dimensions.get('window');

export default function CommentCard(props) {
  const {
    userState: { userData },
  } = useContext(AuthContext);
  const { setSelectedComment, setIsReply, focusTextField, isReplied } = useContext(CommentsContext);
  const { comment, replyComment, onRefreshing, navigation } = props;
  const time = moment(comment.published, 'DD MMMM YYYY hh:mm:ss').fromNow();

  const [openModal, setOpenModal] = useState(false);
  const [editable, setEditable] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [reactionCount, setReactionCount] = useState(comment.numberOfReaction);
  const [listOfReaction, setlistOfReaction] = useState(comment.countOfEachReaction);

  const [collapseReply, setCollapseReply] = useState(false);
  const [replies, setReplies] = useState({
    loading: false,
    state: [],
  });

  useEffect(() => {
    if (isReplied) {
      getAllReplies();
    }
  }, [isReplied]);

  const getAllReplies = () => {
    setReplies((prev) => ({ ...prev, loading: true }));
    postService
      .getAllReply(userData.id, comment.id)
      .then(({ data }) => {
        setReplies((prev) => ({ ...prev, state: data }));
      })
      .catch((e) => console.error(e))
      .finally(() => setReplies((prev) => ({ ...prev, loading: false })));
  };

  const handleCollapseReply = () => {
    if (!collapseReply) {
      getAllReplies();
      return setCollapseReply(true);
    }
    setCollapseReply(false);
  };

  const addReplyHandler = (comment) => {
    setSelectedComment(comment);
    setIsReply(true);
    focusTextField();
  };

  const replyCommentMargin = replyComment ? 40 : 0;

  const openModalHandler = () => {
    if (userData.id === comment.user.id) {
      setOpenModal(true);
    }
  };

  const DeleteComment = () => {
    if (userData.id !== comment.user.id) {
      return;
    }
    if (replyComment) {
      postService
        .deleteReply(comment.id)
        .then((res) => onRefreshing())
        .catch((e) => console.error(e));
    } else {
      postService
        .deleteComment(comment.id)
        .then((res) => {
          onRefreshing();
          Keyboard.dismiss();
        })
        .catch((e) => console.error(e));
    }
    // scrollToListBottom();
  };

  const deleteCommentHandler = () => {
    setOpenModal(false);
    Alert.alert('Delete Comment', 'Do you want to delete this comment?', [
      {
        text: 'Confirm',
        onPress: () => DeleteComment(),
        style: 'default',
      },
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  };

  const editCommentHandler = () => {
    if (replyComment) {
      postService
        .editReply(comment.id, content)
        .then((res) => {
          if (res.status === 200) {
            onRefreshing();
          }

          setEditable(false);
        })
        .catch((e) => console.error(e.message));
    } else {
      postService
        .editComment(comment.id, content)
        .then((res) => {
          if (res.status === 200) {
            onRefreshing();
          }
          setEditable(false);
        })
        .catch((e) => console.error(e.message));
    }
  };

  return (
    <View style={{ paddingHorizontal: 25 }}>
      <View style={[styles.commentContainer]}>
        {/** Left */}

        <UserProfilePicture
          size={replyComment ? 25 : 35}
          profilePicture={comment.user.profilePicturePath}
        />

        <TouchableOpacity style={styles.contentContainer} onLongPress={() => openModalHandler()}>
          <Title color={'#585858'} size={15}>
            {comment.user.firstName}
          </Title>

          <View style={styles.commentBody}>
            {editable ? (
              <>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#cacaca',
                    borderRadius: 5,
                    marginVertical: 3,
                    paddingVertical: 3,
                    minWidth: width / 1.6,
                    maxWidth: width / 1.6,
                  }}
                  multiline
                  value={content}
                  onChangeText={(val) => setContent(val)}
                />
                <View
                  style={{
                    minWidth: width / 1.6,
                    maxWidth: width / 1.6,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}
                >
                  <LinkButton
                    onPress={editCommentHandler}
                    title={'Update'}
                    fontSize={14}
                    style={{ marginHorizontal: 15 }}
                  />
                  <LinkButton title={'Cancel'} fontSize={14} onPress={(_) => setEditable(false)} />
                </View>
              </>
            ) : (
              <CommentText>{comment.content}</CommentText>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.commentDetailsContainer]}>
        <ReactionBar
          style={{ flex: 1 }}
          contentType={replyComment ? 'reply' : 'comment'}
          isLiked={replyComment ? comment.replyLiked : comment.commentLiked}
          contentId={comment.id}
          setListOfReaction={setlistOfReaction}
        />

        <Text style={styles.time}>{time}</Text>
        <TopReactions
          contentType={replyComment ? 'reply' : 'comment'}
          emojiSize={12}
          style={{ marginHorizontal: 10 }}
          reactionsList={listOfReaction}
          navigation={navigation}
          contentId={comment.id}
          numberOfReaction={reactionCount}
        />

        <View>
          {replyComment ? null : (
            <LinkButton
              title="Reply"
              style={styles.reply}
              onPress={() => addReplyHandler(comment)}
            />
          )}
        </View>
      </View>

      {comment.numberOfReplies > 0 && (
        <View style={{ marginLeft: 25 }}>
          <LinkButton
            onBlur={handleCollapseReply}
            title={collapseReply ? `-Hide reply` : `-Show reply`}
            style={[styles.reply, { marginBottom: 10 }]}
            onPress={handleCollapseReply}
          />
        </View>
      )}

      {collapseReply ? (
        <>
          <CommentsList
            replyComment
            onRefreshing={getAllReplies}
            refreshing={replies.loading}
            data={replies.state}
          />
        </>
      ) : null}
      <Separator style={[styles.separator, { marginLeft: replyCommentMargin }]} />
      <DownModal isVisible={openModal} setIsVisible={(_) => setOpenModal(false)}>
        <View style={styles.menuContainer}>
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: '#cacaca',
                width: 80,
                height: 6,
                borderRadius: 6,
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.menu}
            onPress={(_) => {
              setEditable(true);
              setOpenModal(false);
            }}
          >
            <View>
              <Text style={styles.menuText}>Edit</Text>
              <Text>Edit the Comment</Text>
            </View>
            <Icon size={45} name={'edit'} type="Entypo" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menu} onPress={deleteCommentHandler}>
            <View>
              <Text style={styles.menuText}>Delete</Text>
              <Text>Delete your Comment</Text>
            </View>
            <Icon size={45} name={'delete'} color="crimson" />
          </TouchableOpacity>
        </View>
      </DownModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 6,
    alignItems: 'flex-start',
  },
  menuText: {
    fontWeight: '600',
    fontSize: 20,
    color: '#585858',
  },
  customDownModel: {
    paddingBottom: 60,
    height: 300,
    backgroundColor: '#fff',
  },
  commentContainer: {
    flexDirection: 'row',

    paddingTop: 20,
    justifyContent: 'space-between',
  },
  replyContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 6,
    justifyContent: 'space-between',
  },

  contentContainer: {
    flex: 1,
    marginLeft: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#33333315',
    borderRadius: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  commentDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#333',
  },
  comment: {
    color: colors.mediumGray,
    fontSize: 13,
  },
  commentBody: {
    marginTop: 5,
  },
  time: {
    fontSize: 9,
  },

  stars: {
    fontSize: 10,
    color: colors.iondigoDye,
    marginHorizontal: 20,
  },
  reply: {
    fontSize: 12,
    color: colors.iondigoDye,
    fontWeight: 'bold',
  },
  reactionContainer: {
    paddingTop: 5,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  separator: {
    marginHorizontal: 15,
  },
  commentTextContainer: {
    marginVertical: 5,
  },
  menu: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomWidth: 0.6,
    // borderBottomColor: '#cacaca',
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
  replayContainer: {
    marginTop: 15,
    marginStart: '20%',
    width: '80%',
    alignItems: 'flex-start',
  },
});
