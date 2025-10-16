import React, { useContext, useState } from 'react';
import { FlatList } from 'react-native';

import routes from '../../navigation/routes';
import defaultStyles from '../../config/styles';
import ListItem from '../lists/ListItem';
import EmptyNotice from './EmptyNotice';
import ListWrapper from './ListWrapper';
import conversation from '../../backendless/conversation';
import AuthContext from '../../authContext';

export default function FriendsList({ navigation, friends, loading, refresh }) {
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useContext(AuthContext);

  const handelRefresh = () => {
    setRefreshing(true);
    refresh();
    setRefreshing(false);
  };

  const directToChatRoom = async (item) => {
    let currentConversation = await conversation.findConversation(user.id, item.id);

    if (currentConversation === null) {
      currentConversation = await conversation.createConversation(user.id, item.id);
    }

    navigation.navigate(routes.CHAT_ROOM, {
      contact: item,
      conversationId: currentConversation.objectId,
    });
  };

  return (
    <ListWrapper loading={loading}>
      <FlatList
        data={friends}
        keyExtractor={(friend) => friend.id.toString()}
        refreshing={refreshing}
        onRefresh={handelRefresh}
        ListEmptyComponent={<EmptyNotice navigation={navigation} />}
        renderItem={({ item }) => (
          <ListItem
            style={[defaultStyles.listItemStyle, defaultStyles.lightShadow]}
            title={item.firstName}
            image={item.profilePicturePath}
            subTitle="Accepted your request! "
            displayLeft={true}
            tabTitle="Send Message"
            showCloseButton={false}
            onPress={() => directToChatRoom(item)}
          />
        )}
      />
    </ListWrapper>
  );
}
