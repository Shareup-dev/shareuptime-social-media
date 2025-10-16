import AuthAxios from './authAxios';

class Friends {
  userStatus = (fid, uid) => AuthAxios.get(`/${uid}/friend_with/${fid}`);
  sendRequest = (uid, fid) => AuthAxios.post(`/${uid}/friend_request/${fid}`);
  addFriends = (uid, fid) => AuthAxios.post(`/friends/${uid}/${fid}`);
  removeFriends = (uid, fid) => AuthAxios.delete(`/friends/${uid}/${fid}`);
  acceptRequest = (uid, fid) => AuthAxios.post(`/${uid}/accept_friend_request/${fid}`);
  declineRequest = (uid, fid) => AuthAxios.post(`/${uid}/decline_friend_request/${fid}`);
}
export default new Friends();
