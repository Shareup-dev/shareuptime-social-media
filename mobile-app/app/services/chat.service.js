import ChatAxios from './chatAxios';

class ChatService {
  getAllConversations = (username) => ChatAxios.get(`/getAllConversations/${username}`);
  getConversation = (username, friend) => ChatAxios.get(`/getConversation/${username}/${friend}`);
  getAllArchivedChat = (email) => ChatAxios.get(`/getArchivedConversations/${email}`);
  archiveChat = (email, cid) => ChatAxios.post(`/archiveConversation/${cid}/${email}`);
  unArchiveChat = (email, cid) => ChatAxios.post(`/unarchiveConversation/${cid}/${email}`);
  removeConversations = (cid, email) => ChatAxios.get(`/removeConversation/${cid}/${email}`);
}

export default new ChatService();
