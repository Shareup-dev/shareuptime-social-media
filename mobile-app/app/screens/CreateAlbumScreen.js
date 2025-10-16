import React, { useMemo, useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import { Header, HeaderTitle } from '../components/headers';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from '../components/Icon';
import { Texts } from '../Materials/Text';
import colors from '../config/colors';
import TextField from '../components/TextField';
import common from '../config/common';
import RadioOptionDrawer from '../components/drawers/RadioOptionDrawer';
import postService from '../services/post.service';
import authContext from '../Contexts/authContext';
import { postDataSliceAction } from '../redux/postDataSlice';
import { useDispatch } from 'react-redux';

export default function CreateAlbumScreen({ navigation }) {
  const { userData: user } = useContext(authContext)?.userState;
  const privacyOptions = useMemo(() => common.privacyOptions, []);
  const [postPrivacyOption, setPostPrivacyOption] = useState(privacyOptions[0]); // object to present the current privacy option
  const [isPrivacyOptionsVisible, setIsPrivacyOptionsVisible] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const dispatch = useDispatch();

  const handelPrivacySetting = (value) => {
    const index = privacyOptions.map((item) => item.value).indexOf(value);
    const option = privacyOptions[index];
    setPostPrivacyOption(option);
    setIsPrivacyOptionsVisible(!isPrivacyOptionsVisible);
    console.log(postPrivacyOption);
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
        middle={<HeaderTitle>Create Albums</HeaderTitle>}
        right={
          <TouchableOpacity
            onPress={() => {
              postService.createAlbum(albumName, false, user.id).then((res) => {
                dispatch(postDataSliceAction.addAlbum(res.data));
              });
              navigation.goBack();
            }}
          >
            <Texts color={colors.iondigoDye} size={17}>
              Done
            </Texts>
          </TouchableOpacity>
        }
      />
      <View>
        <TextField
          placeholder=" Album Name"
          style={styles.searchbar}
          //ref={searchTextFieldRef}
          onChangeText={(text) => {
            setAlbumName(text);
            //onSearch(text);
            // store.dispatch(recentSearchActions.setList(text))
          }}
        />
        <Header
          left={
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                image={postPrivacyOption.icon}
                type="FontAwesome5"
                backgroundSizeRatio={1}
                size={20}
                color={colors.dimGray}
                style={{ marginLeft: 5, marginRight: 6 }}
              />
              <Texts size={15}>{postPrivacyOption.value}</Texts>
            </TouchableOpacity>
          }
          right={
            <TouchableOpacity
              onPress={() => {
                setIsPrivacyOptionsVisible(!isPrivacyOptionsVisible);
              }}
            >
              <Icon type="AntDesign" name="caretright" noBackground={true} />
            </TouchableOpacity>
          }
        />
        <RadioOptionDrawer
          isVisible={isPrivacyOptionsVisible}
          setIsVisible={setIsPrivacyOptionsVisible}
          options={privacyOptions}
          title="Who can see your posts?"
          subTitle="Your post will appear in news feed, on your profile and in search results"
          initialValue={privacyOptions[0].value}
          onSubmit={handelPrivacySetting}
        />
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  searchbar: {
    marginTop: 15,
    marginBottom: 15,
    paddingLeft: 15,
  },
});
