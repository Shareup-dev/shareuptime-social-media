import { ColorValue, StyleSheet, View, ViewStyle } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Texts } from '../../Materials/Text';
import { findEmoji } from '../../Constants/reactions';
import Icon from '../Icon';
import { TouchableOpacity } from 'react-native';
import routes from '../../navigation/routes';

interface Props {
  style?: ViewStyle;
  emojiSize?: number;
  topReactionsCount?: number;
  overlayColor: ColorValue;
  allowNagativeVal?: boolean;
  navigation: any;
  reactionsList: {
    angry: number;
    cry: number;
    laugh: number;
    love: number;
    star: number;
    wow: number;
  };
  contentId: number;
  contentType: string;
}

const TopThreeReactions: React.FC<Props> = (props) => {
  const {
    reactionsList,
    topReactionsCount = 3,
    emojiSize = 16,
    style,
    overlayColor = '#fff',
    allowNagativeVal = false,
    contentId,
    navigation,
    contentType = 'post',
  } = props;

  const [topReactions, setTopReactions] = useState<[string, number][]>([]);

  useEffect(() => {
    const sortTopReactions = () => {
      setTopReactions(
        Object.entries(reactionsList)
          .filter((item): item is [string, number] => (item[1] as number) > 0)
          .slice(0, topReactionsCount - 1),
      );
    };
    sortTopReactions();
  }, [reactionsList, topReactionsCount]);

  const getTotalCount = (): number =>
    Object.values(reactionsList).reduce((prev, crnt) => prev + crnt, 0);

  return (
    <TouchableOpacity
      style={[style, styles.row]}
      onPress={() =>
        navigation.navigate((routes as any)?.LIST_OF_REACTIONS ?? 'ListOfReactions', {
          id: contentId,
          contentType,
        })
      }
    >
      {topReactions.length ? (
        topReactions.map((item, i) => (
          <View key={i} style={[styles.container, { backgroundColor: overlayColor }]}>
            <Texts size={emojiSize}>{` ${findEmoji(item[0])}`}</Texts>
          </View>
        ))
      ) : (
        <Icon
          image={undefined}
          name={'star'}
          type={'FontAwesome5'}
          color={'#fff'}
          style={styles.icon}
          size={emojiSize}
          noBackground
          backgroundSizeRatio={0.9}
        />
      )}

      <Texts size={emojiSize} color={overlayColor === '#fff' ? '#333' : '#fff'}>{` ${
        getTotalCount() ? getTotalCount() : allowNagativeVal ? '0' : ''
      }`}</Texts>
    </TouchableOpacity>
  );
};

export default React.memo(TopThreeReactions);

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    alignItems: 'center',
    marginLeft: -6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {},
});
