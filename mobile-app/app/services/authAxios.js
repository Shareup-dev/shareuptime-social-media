import axios from 'axios';
import settings from '../config/settings';

const baseURL = `${settings.apiUrl}/api/v1/`;

const AuthAxios = axios.create({
  baseURL: baseURL,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});
export default AuthAxios;
