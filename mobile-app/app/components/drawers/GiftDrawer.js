import React from 'react';
import {View, StyleSheet, FlatList, StatusBar} from 'react-native';
import Modal from 'react-native-modal';

import colors from '../../config/colors';
import DropDownListItem from '../lists/DropDownListItem';

export default function GiftDrawer({isVisible, setIsVisible}) {
  const listItems = [
    {
      title: 'Best Buy',
      image: require('../../assets/gift-images/best-buy-logo.png'),
      items: [
        {
          id: 1,
          title: 'Flowers',
          state: 'in Offer',
          price: 'Price 152.00',
          image: require('../../assets/gift-images/flower.png'),
        },
        {
          id: 2,
          title: 'Watch',
          state: 'in Offer',
          price: 'Price 152.00',
          image: require('../../assets/gift-images/watch.png'),
        },
        {
          id: 3,
          title: 'Perfume',
          state: 'in Offer',
          price: 'Price 152.00',
          image: require('../../assets/gift-images/perfume.png'),
        },
        {
          id: 4,
          title: 'Shirts',
          state: 'in Offer',
          price: 'Price 152.00',
          image: require('../../assets/gift-images/shirts.png'),
        },
        {
          id: 5,
          title: 'Pants',
          state: 'in Offer',
          price: 'Price 152.00',
          image: require('../../assets/gift-images/jeans.png'),
        },
      ],
      onPress: () => {},
    },
    {
      title: 'Flipkart',
      image: require('../../assets/gift-images/flipkart-logo.png'),
    },
    {
      title: 'Amazon',
      image: require('../../assets/gift-images/amazon-logo.png'),
    },
    {
      title: 'Shoplify',
      image: require('../../assets/gift-images/amazon-logo.png'),
    },
  ];

  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      swipeDirection={['right']}
      onSwipeComplete={() => setIsVisible(false)}
      onBackdropPress={() => setIsVisible(false)}
      animationIn="slideInRight"
      animationOut="slideOutRight">
      <View style={styles.container}>
        <FlatList
          data={listItems}
          keyExtractor={item => item.title}
          renderItem={({item}) => (
            <View style={styles.DropDownListItems}>
              <DropDownListItem
                title={item.title}
                subTitle="All Popular Items"
                subSubTitle="100+ items"
                image={item.image}
                dropListItems={item.items}
              />
            </View>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: 0,
    margin: 0,
  },
  container: {
    flex: 1,
    padding: 10,
    marginTop: StatusBar.currentHeight,
    backgroundColor: colors.white,
    width: '75%',
    alignSelf: 'flex-end',
  },
  DropDownListItems: {
    marginVertical: 7,
  },
});
