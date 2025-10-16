import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { Texts } from '../../Materials/Text';
import colors from '../../config/colors';
import BetterImage from '../betterImage/BetterImage';
import { findEmoji } from '../../Constants/reactions';

interface ReactionListItem {
  profilePicture: string;
  firstName: string;
  lastName: string;
}

type TabTuple = [string, ReactionListItem[]];
interface Props {
  tabs: TabTuple[];
}

const { width } = Dimensions.get('window');

const TabView: React.FC<Props> = (props) => {
  const { tabs } = props;
  const [activeIndex, setactiveIndex] = useState<number>(0);

  const renderReactions = ({ item }: { item: ReactionListItem }) => {
    return (
      <View style={styles.card}>
        <BetterImage style={styles.img} source={{ uri: item.profilePicture }} />
        <Texts size={15} style={styles.name}>
          {`${item.firstName} ${item.lastName}`}
        </Texts>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.container}>
        <ScrollView horizontal style={styles.tabs}>
          {tabs.map(([tabName], index) => (
            <TouchableOpacity
              onPress={() => setactiveIndex(index)}
              key={index}
              style={[styles.tab, index === activeIndex ? styles.active : null]}
            >
              <Texts
                size={15}
                style={[
                  index === activeIndex && { fontWeight: '700' },
                  { textTransform: 'capitalize' },
                ]}
                color={index === activeIndex ? colors.iondigoDye : '#333'}
              >
                {tabName !== 'all' ? `${findEmoji(tabName)} ${tabName}` : tabName}
              </Texts>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.bodyContainer}>
        <FlatList
          data={tabs.length ? tabs[activeIndex][1] : null}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderReactions}
        />
      </View>
    </View>
  );
};

export default TabView;

const styles = StyleSheet.create({
  name: {
    marginHorizontal: 10,
    fontWeight: '500',
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 0.5,
  },
  container: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 2,
    borderRadius: 3,
  },
  active: {
    borderBottomColor: colors.iondigoDye,
    borderBottomWidth: 3,
  },
  tabs: {},
  bodyContainer: {
    backgroundColor: '#eee',
    height: '100%',
  },
});
