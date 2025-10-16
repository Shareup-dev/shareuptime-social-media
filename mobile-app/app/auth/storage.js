import EncryptedStorage from 'react-native-encrypted-storage';

import JwtDecode from 'jwt-decode';

const key = 'authToken';
const storeToken = async (authToken) => {
  try {
    await EncryptedStorage.setItem(key, authToken);
  } catch (error) {
    console.error('Error storing the auth token', error);
  }
};

const getToken = async () => {
  try {
    return await EncryptedStorage.getItem(key);
  } catch (error) {
    console.error('Error getting the auth token', error);
  }
};

const getUser = async () => {
  const token = await getToken();
  return token ? JwtDecode(token) : null;
};

const removeToken = async () => {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing the auth token', error);
  }
};

export default {
  getUser,
  getToken,
  storeToken,
  removeToken,
};
