import AuthAxios from './authAxios';

class UserService {
  search = (keyword) => AuthAxios.get(`search?keyword=${keyword}`);

  /*..............User..............*/
  getUserByEmail = (email) => AuthAxios.get(`users/email/${email}`);
  getUsers = () => AuthAxios.get(`users`);
  getUserById = (userId) => AuthAxios.get(`users/${userId}`);

  /*..............UserProfile..............*/
  editProfile = (email, user) => AuthAxios.put(`users/${email}/edit_profile`, user);
  uploadProfilePicture = (email, formdata) =>
    AuthAxios.post(`users/${email}/upload_profile_picture`, formdata);
  uploadCoverPicture = (email, formdata) =>
    AuthAxios.post(`users/${email}/upload_cover_picture`, formdata);

  /*..............Friends..............*/
  searchFriends = (uid, keyword) => AuthAxios.get(`/friends/search/${uid}?keyword=${keyword}`);
  getFriends = (email) => AuthAxios.get(`friends/email/${email}`);
  sendFriendRequest = (uid, fid) => AuthAxios.post(`${uid}/friend_request/${fid}`);
  acceptFriendRequest = (uid, fid) => AuthAxios.post(`${uid}/accept_friend_request/${fid}`);
  declineFriendRequest = (uid, fid) => AuthAxios.post(`${uid}/decline_friend_request/${fid}`);
  addFriend = (uid, fid) => AuthAxios.post(`friends/${uid}/${fid}`);
  deleteFriend = (uid, fid) => AuthAxios.delete(`friends/${uid}/${fid}`);
  getFriendRequestSent = (email) => AuthAxios.get(`${email}/friend_request_sent`);
  getFriendRequestRecieved = (email) => AuthAxios.get(`${email}/friend_request_recieved`);
  getFriendsOfFriend = (fid) => AuthAxios.get(`friends/${fid}`);
  getPostOfFriend = (fid) => AuthAxios.get(`getpostfriends/${fid}`);
  getAllFriendRequest = (email) => AuthAxios.get(`friendsWithRequests/${email}`);

  /*..............Flowers..............*/
  getFollowers = (email) => AuthAxios.get(`${email}/followers`);
  getFollowing = (email) => AuthAxios.get(`${email}/following`);
  follow = (email, followed_id) => AuthAxios.post(`${email}/follows/${followed_id}`);
  unfollow = (email, followed_id) => AuthAxios.delete(`${email}/unfollow/${followed_id}`);
  blockUser = (uid, bid) => AuthAxios.post(`${uid}/blocks/${bid}`);
  unBlockUser = (uid, bid) => AuthAxios.post(`${uid}/unblocks/${bid}`);
}

export default new UserService();
