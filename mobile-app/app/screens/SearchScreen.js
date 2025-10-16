import React, { useState, useRef } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import Screen from '../components/Screen';
import TextField from '../components/TextField';
import Separator from '../components/Separator';
import ListItem from '../components/lists/ListItem';
import defaultStyles from '../config/GlobalStyles';
import RecentSearchList from '../components/lists/recentSearchList';
import colors from '../config/colors';
import { HeaderWithBackArrow } from '../components/headers';
import routes from '../navigation/routes';
import UserService from '../services/user.service';
//import { recentSearchActions } from '../redux/recentSearch';

export default function SearchScreen({ navigation }) {
  const [searchResult, setSearchResult] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [recentList] = useState([]);
  const searchTextFieldRef = useRef();

  // useEffect(() => {
  //     //const recent = store.dispatch(recentSearchActions.getList())
  //     //setRecentList(recent)
  //     return;
  //   },[])
  const onSearch = (searchKey) => {
    if (searchKey === '') {
      setIsSearch(false);
    } else {
      UserService.search(searchKey).then((resp) => {
        // let filteredResult = resp.data.filter(
        //   person => person.id !== userState?.userData?.id,
        // );
        setSearchResult(resp.data);
        setIsSearch(true);
      });
    }
    return;
  };

  return (
    <Screen>
      <HeaderWithBackArrow
        onBackButton={() => navigation.goBack()}
        component={
          <View style={styles.searchContainer}>
            <TextField
              placeholder="Search Friends"
              iconName="search1"
              iconType="AntDesign"
              style={styles.searchbar}
              ref={searchTextFieldRef}
              onChangeText={(text) => {
                onSearch(text);
                // store.dispatch(recentSearchActions.setList(text))
              }}
            />
          </View>
        }
      />
      <Separator style={styles.separator} />
      <FlatList
        contentContainerStyle={styles.groupsList}
        ListHeaderComponent={RecentListHeader({ options: recentList })}
        data={searchResult}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            email={item.email}
            user={item}
            image={item.profilePicturePath}
            title={item.firstName}
            subTitle="Recommended"
            onPress={() => navigation.navigate(routes.USER_PROFILE, item.email)}
            style={[defaultStyles.listItemStyle, defaultStyles.lightShadow]}
            // displayLeft={true}
          />
        )}
      />
    </Screen>
  );
}

// extracted to avoid nested component creation on each render
const RecentListHeader = ({ options }) => <RecentSearchList options={options} />;
const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 5,
    paddingTop: 15,
    paddingEnd: 0,
  },
  tabs: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchbar: {
    marginBottom: 10,
  },

  separator: {
    backgroundColor: colors.LightGray,
    marginTop: 20,
  },
});
