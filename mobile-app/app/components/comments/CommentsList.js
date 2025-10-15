import React, {useRef} from 'react';
import {FlatList, Text, View} from 'react-native';
import {CommentCard} from '.';

export default function CommentsList({
  data,
  refreshing,
  replyComment = false,
  onRefreshing,
  navigation,
}) {
  const commentsListRef = useRef();

  const scrollToListBottom = () => {
    commentsListRef.current.scrollToEnd({animated: true});
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      ref={commentsListRef}
      onContentSizeChange={scrollToListBottom}
      refreshing={refreshing}
      onRefresh={onRefreshing}
      renderItem={({item}) => (
        <CommentCard
          navigation={navigation}
          comment={item}
          replyComment={replyComment}
          onRefreshing={onRefreshing}
        />
      )}
      ListEmptyComponent={
        <View style={{alignItems: 'center', marginTop: 5, minHeight: 200}}>
          <Text>{refreshing ? `Loading...` : `No comments found`}</Text>
        </View>
      }
    />
  );
}
