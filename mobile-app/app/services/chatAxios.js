import axios from 'axios';
import settings from '../config/settings';

const baseURL = `${settings.apiUrl}`;

const ChatAxios = axios.create({
  baseURL: baseURL,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});
export default ChatAxios;
