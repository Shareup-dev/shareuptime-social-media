import AuthContext from './context';
import JwtDecode from 'jwt-decode';
import authStorage from './storage';
import {useContext} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

export default useAuth = () => {
  // const {user, setUser} = useContext(AuthContext);

  const logIn = authToken => {
    // const user = JwtDecode(authToken);
    // setUser(user);
    authStorage.storeToken(authToken);
  };

  const logOut = () => {
    // setUser(null);
    authStorage.removeToken();

    EncryptedStorage.removeItem('user');
  };

  return {user, logIn, logOut};
};
