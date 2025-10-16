import axios from 'axios';
import AuthService from './old/auth.services';
import settings from '../config/settings';

const baseURL = `${settings.apiUrl}/api/v1/`;
let authAxios = null;

// const authenticate = () => {
//   if (AuthService.getCurrentUser()) {
//     authAxios = axios.create({
//       baseURL: baseURL,
//       headers: {
//         Authorization: `Bearer ${AuthService.getCurrentUser().jwt}`,
//         "Access-Control-Allow-Origin": "*",
//       },
//     });
//   } else {
//     authAxios = axios.create({
//       baseURL: baseURL,
//     });
//   }
// };
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

class FriendService {
  getFriends = async (email) => {
    try {
      authenticate();
      const result = await authAxios.get('/friends/' + email);
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  addFriends = async (uid, fid) => {
    const result = await authAxios.post(`/friends/${uid}/${fid}`);
    return result;
  };

  removeFriends = async (uid, fid) => {
    const result = await authAxios.delete(`/friends/${uid}/${fid}`);
    return result;
  };

  sendRequest = async (uid, fid) => {
    const result = await authAxios.post(`/${uid}/friend_request/${fid}`);
    return result;
  };

  acceptRequest = async (uid, fid) => {
    const result = await authAxios.post(`/${uid}/accept_friend_request/${fid}`);
    return result;
  };

  declineRequest = async (uid, fid) => {
    const result = await authAxios.post(`/${uid}/decline_friend_request/${fid}`);
    return result;
  };

  unsendRequest = async (uid, fid) => {
    const result = await authAxios.post(`/${uid}/decline_friend_request/${fid}`);
    return result;
  };
}

export default new FriendService();
