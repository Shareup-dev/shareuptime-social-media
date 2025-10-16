import React, { useContext, useMemo } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { postFeelingsActions } from '../../redux/postFeelings';
import { data as Feelings } from '../Data/activitiesAndFeelings';

export default function ListOfFeelings(props) {
  const dispatch = useDispatch();

  const FeelingCard = ({ name, img, type }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          dispatch(postFeelingsActions.setFeel({ feeling: name, img, type }));
          props.navigation.goBack();
        }}
      >
        <View style={styles.card}>
          <Image source={img} style={styles.img} />
          <Text style={styles.cardText}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {Feelings.map(
          (feeling, index) =>
            feeling.type === 'Feeling' && (
              <FeelingCard key={index} name={feeling.name} img={feeling.img} />
            ),
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardText: {
    marginLeft: 15,
  },
  card: { flexDirection: 'row', alignItems: 'center' },
  img: {
    width: 50,
    height: 50,
  },
});
