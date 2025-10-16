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
          Authorization: `Bearer ${res.jwt}`,
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
class StoryService {
  addStory = async (userId, storyData) => {
    try {
      const result = await authAxios.post(`/Stories/${userId}`, storyData);
      return result;
    } catch (error) {
      console.error('An error occurred while posting stories: ', error);
      return error;
    }
  };
  getStories = async () => {
    try {
      const result = await authAxios.get(`/stories`);
      return result;
    } catch (error) {
      console.error('An error occurred while getting stories: ', error);
      return error;
    }
  };
}

export default new StoryService();
