import AuthAxios from './authAxios';

const setTokenForAxios = (token) => {
  if (token) AuthAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
  else AuthAxios.defaults.headers.common.Authorization = null;
};
const removeAxiosToken = () => {
  AuthAxios.defaults.headers.common.Authorization = null;
};

export { setTokenForAxios, removeAxiosToken };
