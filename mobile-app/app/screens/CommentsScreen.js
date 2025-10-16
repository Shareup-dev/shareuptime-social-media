import React, { useState, useRef, useContext, useCallback } from 'react';
import { View, StyleSheet, FlatList, Keyboard, Text, Alert } from 'react-native';

import { Header, HeaderCloseIcon, HeaderTitle } from '../components/headers';
import Screen from '../components/Screen';
import CommentItem from '../components/comments/CommentItem';
import CommentTextField from '../components/comments/CommentTextField';
// import EmojiesBar from '../components/comments/EmojiesBar';
// import constants from '../config/constants';
// import { prepareDataForValidation } from 'formik';
import colors from '../config/colors';
import AuthContext from '../authContext';
// import { color } from 'react-native-reanimated';

import { useFocusEffect } from '@react-navigation/native';
import postService from '../services/post.service';

import EnhancedOptionsDrawer from '../components/drawers/EnhancedOptionsDrawer';

//import UserService from '../services/UserService';

export default function CommentsScreen({ navigation, route }) {
  const { userId, postId, postType, swapId, fromReply } = route.params;
  const commentsListRef = useRef();
  const commentTextFieldRef = useRef();
  //const [isUserLiked, setIsUserLiked] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [replyList, setReplyList] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentId] = useState('');
  const [isReply, setIsReply] = useState(false);
  // needed to setup list refreshing
  const [refreshing, setRefreshing] = useState(false);
  const { userState } = useContext(AuthContext);
  //const [frmReply,setFrmReply] = useState(fromReply)

  const loadComments = useCallback(async () => {
    console.log('postId', postId);
    postService
      .getAllComments(postId)
      .then((res) => {
        console.log('Comment Data', res.data);
        const commentArray = res.data; //.reverse();
        setCommentsList(commentArray);
      })
      .catch((e) => console.error(e.message));
  }, [postId]);

  useFocusEffect(
    useCallback(() => {
      loadComments();
      return;
    }, [loadComments]),
  );
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const options = [
    {
      title: 'Edit',
      icon: {
        image: require('../assets/post-options-icons/unfollow-icon.png'),
      },
      onPress: () => {
        Alert.alert('Edit');
      },
    },
    {
      title: <Text style={styles.deleteText}>Delete</Text>,
      icon: {
        image: require('../assets/post-options-icons/delete-red-icon.png'),
      },
      onPress: () => {
        Alert.alert('Delete');
      },
    },
  ];
  const handleCancel = () => {
    navigation.goBack();
  };

  const hideReply = () => {
    //<CommentsScreen route={{params: { comments: reply, userId: comment.user.id, commendId: comment.id, postType: postType, swapId: swapId, fromReply:true }}}/>
  };
  const handleAddComment = async () => {
    if (isReply) {
      if (postType === 'swapPost') {
        const comment = { content: commentContent };
        postService
          .addSwapComment(userState?.userData?.id, swapId, comment.content)
          .then((resp) => {
            refreshComments();
            setCommentContent('');
            commentTextFieldRef.current.clear();
            Keyboard.dismiss();
            // scrollToListBottom();
          });
      } else {
        const reply = { reply: commentContent };
        console.log('Making comment: ', userId, commentId, reply);
        if (commentContent !== '') {
          postService
            .replay(userState?.userData?.id, commentId, reply)
            .then((_res) => {
              refreshComments();
              setCommentContent('');
              commentTextFieldRef.current.clear();
              Keyboard.dismiss();
            })
            .catch((e) => console.error('1', e));

          // scrollToListBottom();
        }
      }
    } else {
      if (postType === 'swapPost') {
        const comment = { content: commentContent };
        postService
          .addSwapComment(userState?.userData?.id, swapId, comment.content)
          .then((_resp) => {
            refreshComments();
            setCommentContent('');
            commentTextFieldRef.current.clear();
            Keyboard.dismiss();
            // scrollToListBottom();
          });
      } else {
        const comment = { content: commentContent };

        if (commentContent !== '') {
          postService
            .addComment(userState?.userData?.id, postId, comment)
            .then((_res) => {
              refreshComments();
              setCommentContent('');
              commentTextFieldRef.current.clear();
              Keyboard.dismiss();
            })
            .catch((e) => console.error('3', e));

          // scrollToListBottom();
        }
      }
    }
  };

  const handleEditComment = (_comment) => {
    //<CommentTextField value={comment.content}/>
    //commentTextFieldRef.current.value = "hello" //defaultValue = comment.content
    // commentTextFieldRef.current.focus()
  };
  const handleReplyComment = (replyCommentId) => {
    //setCommentId(commentId)
    //setCommentsList(reply)
    postService
      .getAllReply(replyCommentId)
      .then((res) => {
        console.log(res);
        const replyArray = res.data; //.reverse();
        setReplyList(replyArray);
      })
      .catch((e) => console.error(e));
    commentTextFieldRef.current.focus();
    setIsReply(true);
  };

  const handleDeleteComment = (itemId, isHide) => {
    if (postType === 'swapPost') {
      const comment = { content: commentContent };

      postService.addSwapComment(userId, swapId, comment.content).then((_resp) => {
        refreshComments();
        setCommentContent('');
        commentTextFieldRef.current.clear();
        Keyboard.dismiss();
        // scrollToListBottom();
      });
    } else {
      if (!isHide) {
        postService
          .deleteComment(itemId)
          .then((res) => {
            refreshComments();
            Keyboard.dismiss();
          })
          .catch((e) => console.error('2', e));
      } else {
      }
      // scrollToListBottom();
    }
  };

  const refreshComments = async () => {
    setRefreshing(true);
    if (postType !== 'swapPost') {
      loadComments();
      // postService.getPostByPostId(postId)
      // .then(res => {
      //   console.log("response",res.data)
      //   setCommentsList(res.data.comments);

      //  // setCommentsList(res.data.comments);
      // })
      // .catch(e => console.error(e))
    } else {
      const response = await postService.getSwapById(swapId);
      setCommentsList(response.data.comments);
    }
    setRefreshing(false);
  };

  const handleOnChangeText = (text) => {
    setCommentContent(text);
  };

  const scrollToListBottom = () => {
    commentsListRef.current.scrollToEnd({ animated: true });
  };

  const handleReactions = async (cid, isUserLiked) => {
    const params = { reaction: isUserLiked };
    postService
      .likeUnlikeComment(userState?.userData?.id, cid, params)
      .then((res) => {
        console.log('responseLike', res.data);
        // setIsUserLiked(!isUserLiked)
      }) // need to get likePostIds
      .catch((e) => console.error('4', e));

    // refreshComments();
  };

  return !fromReply ? (
    <Screen style={styles.container}>
      <Header
        left={<HeaderCloseIcon onPress={handleCancel} />}
        middle={<HeaderTitle>Comments</HeaderTitle>}
      />

      <FlatList
        data={commentsList}
        keyExtractor={(comment) => comment.id.toString()}
        ref={commentsListRef}
        onContentSizeChange={scrollToListBottom}
        refreshing={refreshing}
        onRefresh={refreshComments}
        renderItem={({ item }) => (
          <CommentItem
            comment={item}
            reactionsLength={item?.reactions?.length ? item?.reactions?.length : 0}
            //isUserLiked ={isUserLiked}
            onInteraction={handleReactions}
            handleDelete={handleDeleteComment}
            onReply={handleReplyComment}
            handleEdit={handleEditComment}
            isReply={isReply}
            reply={replyList}
            postType={postType}
          />
        )}
      />

      <View style={styles.textFieldContainer}>
        {/* <EmojiesBar addEmoji={addEmoji}/>  */}
        <View style={styles.textFieldContainer}>
          <CommentTextField
            onForwardPress={handleAddComment}
            onChangeText={handleOnChangeText}
            ref={commentTextFieldRef}
            isReply={isReply}
          />
        </View>
      </View>
    </Screen>
  ) : (
    <Screen style={styles.replayContainer}>
      <Text style={styles.hideReplies} onPress={hideReply}>
        -- Hide replies
      </Text>
      <FlatList
        data={commentsList}
        keyExtractor={(comment) => comment.id.toString()}
        ref={commentsListRef}
        onContentSizeChange={scrollToListBottom}
        refreshing={refreshing}
        onRefresh={refreshComments}
        renderItem={({ item }) => (
          <CommentItem
            comment={item}
            reactionsLength={item?.reactions?.length ? item?.reactions?.length : 0}
            // isUserLiked ={isUserLiked}
            onInteraction={handleReactions}
            handleDelete={handleDeleteComment}
            onReply={handleReplyComment}
            handleEdit={handleEditComment}
            isReply={isReply}
            reply={replyList}
            postType={postType}
            fromReply={fromReply}
            isOptionVisible={isOptionsVisible}
            setIsOptionVisible={setIsOptionsVisible}
          />
        )}
      />
      <EnhancedOptionsDrawer
        //source={'comment'}
        // postId={comment.id}
        // postText={comment.content}
        options={options}
        isVisible={isOptionsVisible}
        setIsVisible={setIsOptionsVisible}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  textFieldContainer: {
    marginHorizontal: 15,
    marginBottom: 25,
    marginTop: 15,
  },
  container: {},
  replayContainer: {
    marginTop: 15,
    marginStart: '20%',
    // width: "50%",
    alignItems: 'flex-start',
  },
  deleteText: {
    color: colors.red,
  },
  hideReplies: {
    color: colors.iondigoDye,
    fontSize: 12,
  },
});
