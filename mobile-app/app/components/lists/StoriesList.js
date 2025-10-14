import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, SectionList, Text} from 'react-native';
import AuthContext from '../../authContext';
import storiesService from '../../services/story.service';
import CreateStoryCard from './CreateStoryCard';
import StoryCard from './StoryCard';

export default function StoriesList({navigation, style}) {
  const {
    userState: {userData, username},
  } = useContext(AuthContext);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = () => {
      Promise.all([
        storiesService.getStoriesByEmail(username),
        storiesService.getStoriesOfFriends(userData.id),
      ])
        .then(res =>
         { 
          setStories([
            {
              title: 'my stories',
              data: res[0].data.length ? [{
                ...res[0].data[0].user,
                stories_List: res[0].data,
              }] : [],
            },
            {
              title: 'friends stories',
              data: res[1].data,
            },
          ]);
        }
        )
        .catch(e => console.error(e.message));
    };
    fetchStories();
  }, []);



  return (
    <View style={[styles.container, style]}>
      <CreateStoryCard navigation={navigation} />
      <SectionList
        sections={stories}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => i.toString()}
        style={styles.list}
        renderItem={({item}) => {
          return (
            <StoryCard
              data={item}
              navigation={navigation}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 10,
    marginBottom: 15,
  },
});
