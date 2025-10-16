import React, { useState, useEffect, useContext, useCallback } from 'react';
import { FlatList, Image, View } from 'react-native';
import Screen from '../components/Screen';
import { Header, HeaderTitle } from '../components/headers';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from '../components/Icon';
import { Texts } from '../Materials/Text';
import Separator from '../components/Separator';
import colors from '../config/colors';
import routes from '../navigation/routes';
import postService from '../services/post.service';
import authContext from '../Contexts/authContext';
import { postDataSliceAction } from '../redux/postDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

export default function AlbumListScreen({ navigation, route }) {
  const { userData: user } = useContext(authContext)?.userState;
  const [albums, setAlbums] = useState([]);
  const dispatch = useDispatch();
  const postData = useSelector((state) => state.postDataSlice);

  useFocusEffect(
    useCallback(() => {
      postService.getAlbums(user.id).then((res) => {
        setAlbums(res.data);
      });
    }, [postData]),
  );

  const CheckIfChecked = (item) => {
    return postData.Album.id === item.id;
  };

  const HeaderComponent = () => {
    return (
      <TouchableOpacity
        style={{ flexDirection: 'column' }}
        onPress={() => {
          navigation.navigate(routes.CREATE_ALBUM);
        }}
      >
        <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              margin: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: colors.LightGray,
              width: 100,
              height: 100,
            }}
          >
            <Icon
              type="AntDesign"
              name="plus"
              size={40}
              color={colors.iondigoDye}
              backgroundSizeRatio={1}
            />
          </View>
          <Texts size={15} color={colors.iondigoDye} style={{ marginLeft: 20 }}>
            Create Album
          </Texts>
        </View>
        <Separator />
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ flexDirection: 'column' }}
        onPress={() => {
          dispatch(postDataSliceAction.addAlbum(item));
          navigation.goBack();
        }}
      >
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                margin: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: colors.LightGray,
                width: 100,
                height: 100,
              }}
            >
              <Icon
                type="Entypo"
                name="images"
                size={25}
                color={colors.dimGray}
                backgroundSizeRatio={1}
              />
            </View>
            <View style={{ marginVertical: 10, paddingLeft: 20 }}>
              <Texts size={15} color={colors.dark}>
                {item.albumName}
              </Texts>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <Texts size={12} color={colors.dimGray}>
                  {item.media.length}
                </Texts>
                <Texts size={12} color={colors.dimGray} style={{ marginLeft: 2 }}>
                  {' '}
                  posts{' '}
                </Texts>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <Icon
                  image={9}
                  type="FontAwesome5"
                  backgroundSizeRatio={1}
                  size={15}
                  color={colors.dimGray}
                  //style={{ marginTop: 5,}}
                />
                <Texts size={12} color={colors.dimGray} style={{ marginLeft: 2 }}>
                  {' '}
                  {item.albumName}
                </Texts>
              </View>
            </View>
          </View>
          <Checkbox
            color={colors.iondigoDye}
            status={CheckIfChecked(item) ? 'checked' : 'unchecked'}
          />
        </View>
        <Separator />
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      <Header
        left={
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon type="AntDesign" name="close" noBackground={true} />
          </TouchableOpacity>
        }
        middle={<HeaderTitle>Albums</HeaderTitle>}
      />
      <View>
        <FlatList ListHeaderComponent={HeaderComponent} data={albums} renderItem={renderItem} />
      </View>
    </Screen>
  );
}
