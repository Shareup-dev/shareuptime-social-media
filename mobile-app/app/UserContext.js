import {createContext} from 'react';

const authContext = createContext({
  user: null,
  setUser: user => user,
});

export default authContext;
