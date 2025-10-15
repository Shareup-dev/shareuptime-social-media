import moment from 'moment';
import React, {useContext, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import AuthContext from '../../Contexts/authContext';
import routes from '../../navigation/routes';
import ReelsService from '../../services/Reels.service';
import Icon from '../Icon';
import UserProfilePicture from '../UserProfilePicture';

const BottomCard = React.memo(
  ({
    rid,
    reactions,
    user,
    content,
    publishedDate,
    numberOfComments,
    numberOfReaction,
    reelLiked,
    navigation,
  }) => {
    const {
      userState: {userData},
    } = useContext(AuthContext);
    const {firstName, lastName, id: userID} = user;

    const [date, setDate] = useState(
      moment(publishedDate, 'DD MMMM YYYY hh:mm:ss').fromNow(),
      // null
    );
    const [like, setLike] = useState(Boolean(reelLiked));
    const [totalLikes, setTotalLikes] = useState(
      numberOfReaction ? numberOfReaction : 0,
    );
    const [totalComments, setTotalComments] = useState(
      numberOfComments ? numberOfComments : 0,
    );

    const toggleLike = () => {
      ReelsService.likeUnLike(userData.id, rid, {})
        .then(({status}) => {
          if (status === 200) {
            if (like) setTotalLikes(prev => prev - 1);
            else setTotalLikes(prev => prev + 1);
            setLike(prev => !prev);
          }
        })
        .catch(e => console.error(e.message));
    };

    const navigateToComments = () =>
      navigation.navigate(routes.COMMENTS, {
        postId: rid,
        userId: userID,
        //comments,
        postType: 'reel',
      });

    return (
      <View style={styles.card}>
        <View style={styles.reelInfo}>
          <View
            style={{
              backgroundColor: '#33333345',
              borderRadius: 35,
            }}>
            <View style={styles.reelsInfo}>
              <UserProfilePicture
                profilePicture={user?.profilePicturePath}
                size={50}
              />

              <View>
                <Text
                  style={{
                    color: '#fff',
                    marginTop: 2,
                    marginLeft: 5,
                    fontSize: 14,
                  }}>
                  {`${firstName} ${lastName}`}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    color={like ? '#FFCE45' : '#fff'}
                    name={like ? 'star' : 'star-o'}
                    noBackground
                    type="FontAwesome"
                  />
                  <Text style={{color: '#fff'}}>{totalLikes}</Text>
                  <Icon
                    color="#fff"
                    name="comment"
                    noBackground
                    type="Octicons"
                  />
                  <Text style={{color: '#fff'}}>{totalComments}</Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                color: '#fff',
                marginTop: 2,
                marginHorizontal: 15,
                fontSize: 14,
              }}>
              {`Posted on: ${date}`}
            </Text>
            <Text
              style={{
                color: '#fff',
                marginTop: 2,
                marginHorizontal: 15,
                marginBottom: 10,
                fontSize: 14,
              }}>
              {content}
            </Text>
          </View>
        </View>
        <View style={styles.reelAction}>
          <TouchableOpacity onPress={toggleLike}>
            <Icon
              color={like ? '#FFCE45' : '#fff'}
              name={like ? 'star' : 'star-o'}
              style={{marginVertical: 5}}
              backgroundSizeRatio={0.7}
              noBackground
              type="FontAwesome"
            />
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={_ =>
            //   navigation.navigate(routes.ADD_COMMENT_REEL, {reelId: rid})
            // }
            onPress={navigateToComments}>
            <Icon
              color="#fff"
              style={{marginVertical: 5}}
              name="comment"
              noBackground
              backgroundSizeRatio={0.7}
              type="Octicons"
            />
          </TouchableOpacity>
          {/* <Icon
            color="#fff"
            style={{marginVertical: 5}}
            image={require('../assets/icons/share-icon.png')}
            noBackground
            backgroundSizeRatio={0.7}
            type="Octicons"
          /> */}
        </View>
      </View>
    );
  },
);

export default BottomCard;

const styles = StyleSheet.create({
  caption: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 30,
    fontSize: 18,
    maxHeight: 100,
    width: '85%',
  },
  reelAction: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    borderRadius: 35,
    width: '20%',
    // backgroundColor: '#33333335',
  },
  reelInfo: {
    paddingHorizontal: 15,
    width: '80%',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  reelsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
});
