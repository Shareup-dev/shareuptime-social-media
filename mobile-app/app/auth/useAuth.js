import AuthContext from './context';
import authStorage from './storage';
import { useContext } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

const useAuth = () => {
  const ctx = useContext(AuthContext);

  const logIn = (authToken) => {
    authStorage.storeToken(authToken);
  };

  const logOut = () => {
    authStorage.removeToken();
    EncryptedStorage.removeItem('user');
  };

  return { user: ctx?.user, logIn, logOut };
};

export default useAuth;
