import AuthService from './auth.services';
import axios from 'axios';
import settings from '../../config/settings';

const USER_API_BASE_URL = 'http://192.168.100.239:8080/api/v1/users';
const servers_api = 'http://192.168.100.239:8080';
const my_api = 'http://192.168.100.239:8080';
const baseURL = `${settings.apiUrl}/api/v1/`;
let authAxios = null;

const authenticate = async () => {
  await AuthService.getCurrentUser().then(
    (res) => {
      authAxios = axios.create({
        baseURL: baseURL,
        headers: {
          Authorization: `Bearer ${res.userToken}`,
          'Access-Control-Allow-Origin': '*',
        },
      });
    },
    (error) => {
      console.error(error);
    },
  );
};
authenticate();

class UserService {
  getUsers = async () => {
    const result = await authAxios.get('users/');
    return result;
  };

  createUser = async (user) => {
    const result = await axios.post(`${baseURL}users/`, user);
    return result;
  };

  editProfile = async (email, user) => {
    const result = await authAxios.put(`users/${email}/edit_profile`, user);
    return result;
  };

  getUserByEmail = async (email) => {
    authenticate();
    const result = await authAxios.get('users/email/' + email).then((res) => res);
    return result;
  };

  getUserById = async (userId) => {
    authenticate();
    const result = await authAxios.get('users/' + userId);

    return result;
  };

  getFriends = async (email) => {
    try {
      const result = await authAxios.get('/friends/email/' + email);
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  getFollowers = async (email) => {
    const result = await authAxios.get(`${email}/followers`);
    return result;
  };

  getFollowing = async (email) => {
    const result = await authAxios.get(`${email}/following`);
    return result;
  };

  getFriendRequestSent = async (email) => {
    const result = await authAxios.get(`${email}/friend_request_sent`);
    return result;
  };

  getFriendRequestRecieved = async (email) => {
    const result = await authAxios.get(`${email}/friend_request_recieved`);
    return result;
  };

  follow = async (email, followed_id) => {
    const result = await authAxios.post(`${email}/follows/${followed_id}`);
    return result;
  };

  unfollow = async (email, followed_id) => {
    const result = await authAxios.delete(`${email}/unfollow/${followed_id}`);
    return result;
  };

  uploadProfilePicture = async (email, formdata) => {
    const result = await authAxios.post(`users/${email}/upload_profile_picture`, formdata);

    return result;
  };

  uploadCoverPicture = async (email, formdata) => {
    const result = await authAxios.post(`users/${email}/upload_cover_picture`, formdata);
    return result;
  };

  likePost = async (uid, pid) => {
    const result = await authAxios.put(`/posts/${uid}/like-unlike/${pid}`, {
      emoji: 'like',
    });
    return result;
  };

  savePost = async (uid, pid) => {
    const result = await authAxios.put(`/posts/${uid}/save-unsave/${pid}`);
    return result;
  };
}

export default new UserService();
