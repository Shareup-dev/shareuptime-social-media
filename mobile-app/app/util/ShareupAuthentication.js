import React, { useEffect, useReducer, useMemo } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import colors from '../config/colors';
import EncryptedStorage from 'react-native-encrypted-storage';
import { removeAxiosToken, setTokenForAxios } from '../services/authHeader';
import store from '../redux/store';
import { Provider } from 'react-redux';
import AuthContext from '../authContext';
import { AuthNavigator } from '../navigation';
import userService from '../services/user.service';
import HomeNavigator from '../navigation/HomeNavigator';

export default function ShareupAuthentication() {
  const initState = {
    username: null,
    userData: {},
    isLoading: true,
    userToken: null,
  };
  const actions = {
    SET_STATE: 'SET_STATE',
    CLEAR_STATE: 'CLEAR_STATE',
  };

  // ------------------ handle user auth data with Reducer ------------------
  const authReducer = (prevState, action) => {
    switch (action.type) {
      case actions.SET_STATE:
        return {
          ...prevState,
          username: action.username,
          userToken: action.userToken,
          userData: action.userData,
          isLoading: false,
        };

      case actions.CLEAR_STATE:
        return {
          ...initState,
          isLoading: false,
        };

      default:
        return {
          ...initState,
          isLoading: false,
        };
    }
  };
  const [userState, dispatch] = useReducer(authReducer, initState);

  const gettingUserInfo = (username, userToken) => {
    // getting user information
    userService
      .getUserByEmail(username)
      .then((res) =>
        dispatch({
          type: actions.SET_STATE,
          username,
          userToken,
          userData: res.data,
        }),
      )
      .catch((e) => {
        dispatch({
          type: actions.CLEAR_STATE,
        });
      });
  };

  // ------------------ Based on the action change the auth STATE  ------------------
  const authActions = useMemo(
    () => ({
      //   retrieving Token from the secure
      retrieveToken: async () => {
        const session = await EncryptedStorage.getItem('auth_session');
        if (session) {
          const { username, userToken } = JSON.parse(session);
          setTokenForAxios(userToken);
          await gettingUserInfo(username, userToken);
        } else {
          dispatch({ type: actions.CLEAR_STATE });
        }
      },
      // Login
      login: async (username, userToken) => {
        await EncryptedStorage.setItem(
          'auth_session',
          JSON.stringify({
            userToken,
            username,
          }),
        );
        setTokenForAxios(userToken);
        // getting user information
        await gettingUserInfo(username, userToken);
      },
      // logout
      logout: async () => {
        await EncryptedStorage.removeItem('auth_session');
        removeAxiosToken();
        dispatch({ type: actions.CLEAR_STATE });
      },
      // signup
      signup: async (username, userToken) => {
        await EncryptedStorage.setItem(
          'auth_session',
          JSON.stringify({
            userToken,
            username,
          }),
        );
        setTokenForAxios(userToken);
        // getting user information
        await gettingUserInfo(username, userToken);
      },
    }),
    [],
  );

  // initial check if token exist
  useEffect(() => {
    authActions.retrieveToken();
  }, []);

  if (userState.isLoading) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator style={styles.gobalLoadingIndicator} size="large" color="#044566" />
      </View>
    );
  } else {
    return (
      <AuthContext.Provider value={{ authActions, userState }}>
        <Provider store={store}>
          {userState.userToken ? <HomeNavigator /> : <AuthNavigator />}
        </Provider>
      </AuthContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  loadingOverlay: {
    flex: 1,
    position: 'absolute',
    zIndex: 1,
    elevation: 1,
    opacity: 1,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    alignContent: 'center',
    justifyContent: 'center',
  },
  listItem: {
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 6,
  },
});
