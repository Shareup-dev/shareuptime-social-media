import { useState } from 'react';
import Backendless from './Backendless';

import conversation from './conversation';
import store from '../redux/store';
import { messagesAction } from '../redux/messagesSlice';

let offset = 0;
let pagesize = 50;
let hasNext = true;

// hook function
const useMessages = (channelName) => {
  // Table constants
  const TABLE_CONVERSATION = 'Conversation';
  const TABLE_CHAT_HISTORY = 'ChatHistory';
  // define the subscription of channel
  // const channel = Backendless.Messaging.subscribe(
  //   channelName === undefined ? "ChatRoom" : channelName
  // );
  const channel = Backendless.Messaging.subscribe(channelName);

  const queryBuilder = Backendless.DataQueryBuilder.create();

  // Query Builder
  const loadRelationsQueryBuilder = Backendless.LoadRelationsQueryBuilder.create();
  loadRelationsQueryBuilder.setRelationName('chatHistory');

  const [loading, setLoading] = useState(false);

  // get messages from DB
  const getStoredMessages = async () => {
    setLoading(true);
    queryBuilder.setOffset(0).setPageSize(50).setSortBy('created DESC');
    const storedMessages = await Backendless.Data.of('ChatHistory').find(queryBuilder);

    store.dispatch(messagesAction.setMessages(storedMessages));
    setLoading(false);
  };

  // get first page messages of conversation from DB
  const loadConversationMessages = async (user1, user2) => {
    setLoading(true);

    const resultConversation = await conversation.findConversation(user1, user2);

    if (resultConversation !== null) {
      loadRelationsQueryBuilder.setOffset(0).setPageSize(50).setSortBy('created DESC');

      const messages = await Backendless.Data.of(TABLE_CONVERSATION).loadRelations(
        resultConversation.objectId,
        loadRelationsQueryBuilder,
      );
      store.dispatch(messagesAction.setMessages(messages));
    }

    setLoading(false);
  };

  // get next page messages of conversation from DB
  const updateStoredMessages = async (conversationId) => {
    setLoading(true);

    if (hasNext) {
      offset = offset + pagesize;
      loadRelationsQueryBuilder.setOffset(offset).setPageSize(pagesize).setSortBy('created DESC');
      const nextPageMessages = await Backendless.Data.of(TABLE_CONVERSATION).loadRelations(
        conversationId,
        loadRelationsQueryBuilder,
      );
      store.dispatch(messagesAction.updateMessagesList(nextPageMessages));

      if (nextPageMessages.length === 0) hasNext = false;
    }
    setLoading(false);
  };

  // for messages listener
  const onMessage = (message) => {
    if (message)
      store.dispatch(
        messagesAction.addMessage({
          created: message.timestamp, // creation time of the message
          messageData: message.message,
          objectId: message.messageId,
          publisher: message.publisherId,
        }),
      );
  };

  // subscribe to channel if not exist will create one
  // channel represent chat rooms (conversations).
  const subscribeToChannel = () => {
    channel.addMessageListener(onMessage);
  };

  // remove listener and reset offset
  const unsubscribeToChannel = () => {
    channel.removeMessageListener(onMessage);
    offset = 0;
    hasNext = true;
  };

  // send message to channel and save it in DB
  const sendMessage = async (message, publisherId, contactId) => {
    const publishOptions = new Backendless.PublishOptions({
      publisherId: `${publisherId}`,
    });

    await Backendless.Messaging.publish(channelName, message, publishOptions).catch((err) =>
      console.error(err),
    );

    const response = await Backendless.Data.of(TABLE_CHAT_HISTORY).save({
      messageData: message,
      publisher: publisherId,
    });

    await conversation.addToConversation(publisherId, contactId, response.objectId);
  };

  return {
    subscribeToChannel,
    getStoredMessages,
    loadConversationMessages,
    updateStoredMessages,
    unsubscribeToChannel,
    sendMessage,
    loading,
  };
};

export default useMessages;
