// Reaction tipini tahmini olarak tanımladım. Gerekirse alanlar genişletilebilir.
interface Reaction {
  id: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
}
import { Dimensions, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HeaderWithBackArrow } from '../components/headers';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
import { TabView } from '../components/Reactions';
import { Texts } from '../Materials/Text';

// Use a string union instead of enum to avoid no-shadow issues with TS/ESLint
type ContentType = 'post' | 'comment' | 'reply';

interface Props {
  navigation: NativeStackNavigationProp<ParamListBase>;
  route: { params: { id: string; contentType?: ContentType } };
}

const ListOfReactions: React.FC<Props> = (props) => {
  const { navigation } = props;

  // Geçici stub veri ile reaksiyonları gösteriyoruz (postService bulunamadı)
  const [data, setData] = useState<Record<string, Reaction[]>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData({
        like: [
          { id: '1', profilePicture: '', firstName: 'Ali', lastName: 'Veli' },
          { id: '2', profilePicture: '', firstName: 'Ayşe', lastName: 'Fatma' },
        ],
        love: [{ id: '3', profilePicture: '', firstName: 'Mehmet', lastName: 'Can' }],
      });
      setLoading(false);
    }, 500);
  }, []);

  const reactions: Array<[string, Reaction[]]> = Object.entries(data)
    .filter(([_, value]) => Array.isArray(value) && (value as Reaction[]).length > 0)
    .map(([k, v]) => [k, v as Reaction[]]);

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
    backgroundColor: '#eee',
  },
  container: {
    flex: 1,
  },
  headerContainer: {},
});
