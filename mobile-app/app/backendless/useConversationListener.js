import Backendless from './Backendless';
import conversation from './conversation';

const TABLE_CONVERSATION = 'Conversation';

export default function useConversationListener() {
  const conversationEventHandler = Backendless.Data.of(TABLE_CONVERSATION).rt();

  const onConversationUpdate = async (object, userId) => {
    conversation.getConversations(userId);
  };

  const onError = (error) => console.error('An error has occurred /', error);

  const addConversationListener = (userId) => {
    conversationEventHandler.addUpdateListener(
      (conversation) => onConversationUpdate(conversation, userId),
      onError,
    );
  };

  const removeConversationListener = () => {
    conversationEventHandler.removeUpdateListener();
  };

  return {
    addConversationListener,
    removeConversationListener,
  };
}
