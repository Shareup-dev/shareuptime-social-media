import Backendless from './Backendless';
import UserService from '../services/user.service';
import dateFormatter from '../dates/dateFormatter';
import moment from 'moment';
import store from '../redux/store';
import { conversationAction } from '../redux/ConversationsSlice';

const TABLE_CONVERSATION = 'Conversation';

const { calendarFormatter } = dateFormatter;

// Helpers will construct their own query builders to avoid shared state

// user1: the user who started the conversation
const addToConversation = async (user1, user2, messageId) => {
  // where-clause computed inside findConversation

  try {
    const result = await findConversation(user1, user2);

    let conversation = result;

    if (result === null) {
      conversation = await createConversation(user1, user2);
    }

    await Backendless.Data.of(TABLE_CONVERSATION).addRelation(conversation, 'chatHistory', [
      { objectId: messageId },
    ]);

    updateConversation(conversation.objectId);
  } catch (error) {
    console.error(error);
  }
};

// user1: the user who started the conversation
const createConversation = async (user1, user2) => {
  const result = await Backendless.Data.of(TABLE_CONVERSATION)
    .save({
      user1: user1,
      user2: user2,
    })
    .catch((err) => console.error(err));

  Backendless.Messaging.subscribe(result.objectId);

  const publishOptions = new Backendless.PublishOptions({
    publisherId: `${user1}`,
  });

  await Backendless.Messaging.publish(result.objectId, 'init', publishOptions).catch((err) =>
    console.error(err),
  );

  return result;
};

const findConversation = async (user1, user2) => {
  const whereConversation = `user1 in ('${user1}', '${user2}') and user2 in ('${user1}', '${user2}')`;
  const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereConversation);

  const result = await Backendless.Data.of(TABLE_CONVERSATION).find(queryBuilder);

  if (result.length === 0) return null;

  return result[0];
};

const updateConversation = async (conversationId) => {
  const updatedConversation = await Backendless.Data.of(TABLE_CONVERSATION).save({
    objectId: conversationId,
    updated: moment().unix(),
  });

  return updatedConversation;
};

const getConversations = async (userId) => {
  const whereConversationsOfUser = `user1 = '${userId}' OR user2 = '${userId}'`;

  const queryBuilder =
    Backendless.DataQueryBuilder.create().setWhereClause(whereConversationsOfUser);

  queryBuilder.setSortBy('updated DESC');

  const loadRelationsQueryBuilder = Backendless.LoadRelationsQueryBuilder.create();
  loadRelationsQueryBuilder.setOffset(0).setPageSize(1).setSortBy('created DESC');

  loadRelationsQueryBuilder.addProperties([
    'YEAR (created)',
    'MONTH (created)',
    'DAYOFMONTH (created)',
    'HOUR (created)',
    'MINUTE (created)',
    'SECOND (created)',
    'messageData',
  ]);

  loadRelationsQueryBuilder.setRelationName('chatHistory');

  const result = await Backendless.Data.of(TABLE_CONVERSATION).find(queryBuilder);

  let mappedConversations = [];

  for (let i = 0; i < result.length; i++) {
    const lastMessage = await Backendless.Data.of(TABLE_CONVERSATION).loadRelations(
      result[i].objectId,
      loadRelationsQueryBuilder,
    );

    if (lastMessage.length !== 0) {
      const conversations = await mapConversation(result[i], userId, lastMessage[0]);
      mappedConversations.push(conversations);
    }
  }

  store.dispatch(conversationAction.setConversations(mappedConversations));

  return mappedConversations;
};

const mapConversation = async (conversation, userId, lastMessage) => {
  const user = await getContactUser(userId, conversation);

  const date = calendarFormatter(
    lastMessage.DayOfMonth,
    lastMessage.Month,
    lastMessage.Year,
    lastMessage.Hour,
    lastMessage.Minute,
    lastMessage.Second,
  );

  return {
    id: conversation.objectId,
    title: user.firstName + ' ' + user.lastName,
    profilePicture: user.profilePicturePath,
    lastMessage: lastMessage.messageData,
    lastMessageTime: date,
    contact: user,
  };
};

const getContactUser = async (userId, conversation) => {
  if (userId === conversation.user1) {
    return await callUserApi(conversation.user2);
  } else if (userId === conversation.user2) {
    return await callUserApi(conversation.user1);
  } else {
    return null;
  }
};

const callUserApi = async (userId) => {
  const id = parseInt(userId, 10);
  const response = await UserService.getUserById(id);
  return response.data;
};

export default {
  createConversation,
  addToConversation,
  getConversations,
  findConversation,
};
