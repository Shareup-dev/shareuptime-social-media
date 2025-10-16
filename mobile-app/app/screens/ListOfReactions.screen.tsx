import { Dimensions, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HeaderWithBackArrow } from '../components/headers';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabView } from '../components/Reactions';
import postService from '../services/post.service';
import { useFetch } from '../hooks';
import { Texts } from '../Materials/Text';

enum contentTypeEnum {
  post = 'post',
  comment = 'comment',
  reply = 'reply',
}

interface Props {
  navigation: NativeStackNavigationProp<unknown>;
  route: { params: { id: string; contentType?: keyof typeof contentTypeEnum } };
  contentType: contentTypeEnum;
}

const ListOfReactions: React.FC<Props> = (props) => {
  const {
    navigation,
    route: {
      params: { id, contentType = 'post' },
    },
  } = props;

  const findContentType = () => {
    switch (contentType) {
      case contentTypeEnum.post:
        return postService.listOfReactions(id);

      case contentTypeEnum.comment:
        return postService.listOfCommentReactions(id);

      case contentTypeEnum.reply:
        return postService.listOfReactions(id);

      default:
        return postService.listOfReactions(id);
    }
  };

  const [data, loading] = useFetch(() => findContentType());

    const [reactions, setReactions] = useState<Array<[string, unknown]>>([]);

    useEffect(() => {
      const entries = Object.entries(data as Record<string, unknown>) as Array<[string, unknown]>;
      setReactions(entries.filter(([_, value]) => Array.isArray(value) && value.length > 0));
    }, [data]);

  const goBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <HeaderWithBackArrow onBackButton={goBack} title={'Reactions'} />
        {loading ? (
          <View style={styles.loadingContainer}>
            <Texts>Loading...</Texts>
          </View>
        ) : reactions.length > 0 ? (
          <TabView tabs={reactions} />
        ) : (
          <View style={styles.loadingContainer}>
            <Texts>No Reactions</Texts>
          </View>
        )}
      </View>
    </View>
  );
};

export default ListOfReactions;

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  loadingContainer: {
    height: height / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContainer: {
    backgroundColor: '#eee',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  headerContainer: {},
});
