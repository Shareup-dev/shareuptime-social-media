import axios from 'axios';
// import sessionStorage from '../Storage.jsx';

import EncryptedStorage from 'react-native-encrypted-storage';
import settings from '../../config/settings';

const url = `${settings.apiUrl}/api/v1/users`;
let authAxios = null;

// =======================================
// localStorage is now EncryptedStorage
// =======================================

class AuthService {
  login = async (username, password) => {
    return await axios
      .post(url + '/authenticate', {
        username,
        password,
      })
      .then(async (response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  };

  getCurrentUser = async () => {
    try {
      const user = await EncryptedStorage.getItem('auth_session');
      if (user !== null) {
        let token = await JSON.parse(user);

        return token;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error retrieving data');
    }
  };
}

export default new AuthService();
