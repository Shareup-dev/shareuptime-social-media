import React, { useCallback, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import postService from '../../services/post.service';
import colors from '../../config/colors';
import { useDispatch, useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');
export default function CommentText({
  readMoreStyle,
  comment,
  textStyle,
  style,
  isEdit,
  setIsEdit,
  isReply,
}) {
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [textShown, setTextShown] = useState(false);
  const [numLines, setNumLines] = useState(undefined);
  const [newComment, setNewComment] = useState(comment.content);
  const dispatch = useDispatch();
  const updatedComment = useSelector((state) => state.commentsSlice);

  const toggleTextShown = () => {
    setTextShown(!textShown);
  };

  useEffect(() => {
    setNumLines(textShown ? undefined : 3);
  }, [textShown]);

  const editCommentHandler = (cid) => {
    if (isReply) {
      postService
        .editReply(cid, newComment)
        .then((res) => {
          if (res.status === 200) {
          }
          // const cmnt = {id:cid,comment:newComment}
          // dispatch(commentsActions.setComment(cmnt)),
          setIsEdit(false);
        })
        .catch((e) => console.error(e.message));
    } else {
      postService
        .editComment(cid, newComment)
        .then((res) => {
          if (res.status === 200) {
          }
          // const cmnt = {id:cid,comment:newComment}
          // dispatch(commentsActions.setComment(cmnt)),
          setIsEdit(false);
        })
        .catch((e) => console.error(e.message));
    }
  };
  const onTextLayout = useCallback(
    (e) => {
      if (e.nativeEvent.lines.length > 3 && !textShown) {
        setShowMoreButton(true);
        setNumLines(3);
      }
    },
    [textShown],
  );

  return (
    <View style={styles.container}>
      {isEdit ? (
        <View>
          <TextInput
            value={newComment}
            autoFocus={true}
            onChangeText={(text) => setNewComment(text)}
            multiline={true}
            style={{
              width: width - 155,
              borderRadius: 10,
              backgroundColor: colors.white,
              flex: 1,
              borderColor: colors.LightGray,
              borderWidth: 1,
              padding: 10,
            }}
          />
          <View style={{ flexDirection: 'row', alignSelf: 'flex-end', paddingHorizontal: 10 }}>
            <TouchableOpacity
              onPress={(_) => setIsEdit(false)}
              style={{
                backgroundColor: colors.iondigoDye,
                alignSelf: 'auto',
                paddingVertical: 8,
                paddingHorizontal: 15,
                borderRadius: 5,
                marginVertical: 5,
                marginHorizontal: 5,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(_) => editCommentHandler(comment.id)}
              style={{
                backgroundColor: colors.iondigoDye,
                alignSelf: 'flex-end',
                paddingVertical: 8,
                paddingHorizontal: 15,
                borderRadius: 5,
                marginVertical: 5,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text
          onTextLayout={onTextLayout}
          numberOfLines={numLines}
          style={textStyle}
          ellipsizeMode="tail"
        >
          {newComment ? newComment : comment.content}
        </Text>
      )}
      {showMoreButton ? (
        <Text onPress={toggleTextShown} style={readMoreStyle}>
          {textShown ? '...Read Less' : 'Read More...'}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
