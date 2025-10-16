import axios from 'axios';
import settings from '../config/settings';
import AuthService from './old/auth.services';

const baseURL = `${settings.apiUrl}`;
let authAxios = null;

const authenticate = async () => {
  await AuthService.getCurrentUser().then(
    (res) => {
      authAxios = axios.create({
        baseURL: `${baseURL}/api/v1/`,
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
class ReelService {
  addReel = async (userId, reelData) => {
    try {
      const result = await authAxios.post(`/reelslocal/${userId}`, reelData);
      return result;
    } catch (error) {
      console.error('An error occurred while posting reel: ', error);
      return error;
    }
  };
  getReels = async () => {
    try {
      const result = await authAxios.get(`/reels`);
      return result;
    } catch (error) {
      console.error('An error occurred while getting reel: ', error);
      return error;
    }
  };
}

export default new ReelService();
