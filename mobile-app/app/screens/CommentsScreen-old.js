import React, {
  useState,
  useRef,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import {View, StyleSheet, FlatList, Keyboard} from 'react-native';

import {Header, HeaderCloseIcon, HeaderTitle} from '../components/headers';
import Screen from '../components/Screen';
import CommentItem from '../components/comments/CommentItem';
import CommentTextField from '../components/comments/CommentTextField';
import constants from '../config/constants';
import AuthContext from '../Contexts/authContext';

import {useFocusEffect} from '@react-navigation/native';
import postService from '../services/post.service';
import SwapService from '../services/swap.service';

export default function CommentsScreen({navigation, route}) {
  const {
    userId,
    postId,
    setNumberOfComments,
    postType,
    swapId,
    fromDetailScreen,
    writeComment,
  } = route.params;
  const commentsListRef = useRef();
  const commentTextFieldRef = useRef();
  //const [isUserLiked, setIsUserLiked] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [replyList, setReplyList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentId, setCommentId] = useState('');
  const [isReply, setIsReply] = useState(false);
  // needed to setup list refreshing
  const [refreshing, setRefreshing] = useState(false);
  const {userState} = useContext(AuthContext);
  const {postTypes} = constants;

  //const [frmReply,setFrmReply] = useState(fromReply)

  useEffect(() => {}, [isEdit]);

  useFocusEffect(
    useCallback(() => {
      loadComments();
      if (writeComment) {
        commentTextFieldRef.current.focus();
      }

      // loadStories();
      // return setActivityIndicator(false);
      return;
    }, []),
  );
  const loadComments = async () => {
    if (postType === postTypes.SWAP) {
      SwapService.getSwapComment(swapId)
        .then(res => {
          const commentArray = res.data; //.reverse();
          setCommentsList(commentArray);
        })
        .catch(e => console.error(e.message));
      setCommentsList(response.data.comments);
    } else {
      postService
        .getAllComments(userState?.userData?.id, postId)
        .then(res => {
          const commentArray = res.data; //.reverse();
          setCommentsList(commentArray);
        })
        .catch(e => console.error(e.message));
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const hideReply = () => {
    //<CommentsScreen route={{params: { comments: reply, userId: comment.user.id, commendId: comment.id, postType: postType, swapId: swapId, fromReply:true }}}/>
  };
  const handleAddComment = async () => {
    if (isReply) {
      if (postType === postTypes.SWAP) {
        const comment = {content: commentContent};
        postService
          .addSwapComment(userState?.userData?.id, swapId, comment.content)
          .then(resp => {
            refreshComments();
            setCommentContent('');
            commentTextFieldRef.current.clear();
            Keyboard.dismiss();
            // scrollToListBottom();
          });
      } else {
        //const reply = {reply: commentContent};
        const comment = {content: commentContent};
        if (commentContent !== '') {
          postService
            .replay(userState?.userData?.id, commentId, comment)
            .then(res => {
              refreshComments();
              setCommentContent('');
              commentTextFieldRef.current.clear();
              Keyboard.dismiss();
            })
            .catch(e => console.error('1', e));

          // scrollToListBottom();
        }
      }
    } else {
      if (postType === 'swap') {
        const comment = {content: commentContent};
        SwapService.createSwapcomment(
          userState?.userData?.id,
          swapId,
          comment.content,
        )
          .then(resp => {
            refreshComments();
            setCommentContent('');
            commentTextFieldRef.current.clear();
            Keyboard.dismiss();
            // scrollToListBottom();
          })
          .catch(console.error(e));
      } else {
        const comment = {content: commentContent};
        if (commentContent !== '') {
          postService
            .addComment(userState?.userData?.id, postId, comment)
            .then(res => {
              refreshComments();
              setCommentContent('');
              commentTextFieldRef.current.clear();
              Keyboard.dismiss();
            })
            .catch(e => console.error(e));

          // scrollToListBottom();
        }
      }
    }
  };
  const handleEditComment = status => {
    setIsEdit(status);
  };
  const handleReplyComment = (commentId, showReply) => {
    if (showReply) {
      setCommentId(commentId);
      //  postService.getAllReply(commentId)
      //   .then(res => {
      //     const replyArray = res.data//.reverse();
      //     setReplyList(replyArray)})
      //   .catch(e => console.error(e))
      commentTextFieldRef.current.focus();
      setIsReply(true);
    } else {
      commentTextFieldRef.current.blur();
      setIsReply(false);
    }
  };

  const refreshComments = async () => {
    setRefreshing(true);
    await loadComments();
    setRefreshing(false);
  };

  const handleOnChangeText = text => {
    setCommentContent(text);
  };

  const scrollToListBottom = () => {
    commentsListRef.current.scrollToEnd({animated: true});
  };

  const handleReactions = async cid => {
    const params = {reaction: 'null'};
    postService
      .likeUnlikeComment(userState?.userData?.id, cid, params)
      .then(res => {
        refreshComments();
        //setIsUserLiked(!isUserLiked)
      }) //need to get likePostIds
      .catch(e => console.error(e));

    //refreshComments();
  };

  return (
    <Screen style={styles.container}>
      {!fromDetailScreen && (
        <Header
          left={<HeaderCloseIcon onPress={handleCancel} />}
          middle={<HeaderTitle>Comments</HeaderTitle>}
        />
      )}

      <FlatList
        data={commentsList}
        keyExtractor={comment => comment.id.toString()}
        ref={commentsListRef}
        onContentSizeChange={scrollToListBottom}
        refreshing={refreshing}
        onRefresh={refreshComments}
        renderItem={({item}) => (
          <CommentItem
            comment={item}
            reactionsLength={
              item?.reactions?.length ? item?.reactions?.length : 0
            }
            isUserLiked={item.commentLiked}
            onInteraction={handleReactions}
            //handleDelete={handleDeleteComment}
            onReply={handleReplyComment}
            handleEdit={handleEditComment}
            isReply={false}
            reply={replyList}
            postType={postType}
            isEdit={isEdit}
            refresh={refreshing}
            refreshComments={refreshComments}
          />
        )}
      />
      {!isEdit && (
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
      )}
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
});
